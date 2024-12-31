import { randomUUID } from "crypto";
import { TaskAggregate } from "../../domain/aggregates/TaskAggregate";
import { UserEntity } from "../../domain/entities/UserEntity";
import { UnexpectedError } from "../../domain/errors/UnexpectedError";
import { TaskCreatedEvent } from "../../domain/events/tasks/TaskCreatedEvent";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { TaskView } from "../views/TaskView";

export class CreateTaskUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly taskView: TaskView,
  ) { }

  public async execute(
    description: string,
    createdByIdentifier: string,
    assignedToIdentifier: string | null,
    doneAt: Date | null,
    dueAt: Date | null
  ) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      await eventLock.lock();

      const unparsedTaskEvents = await this.eventRepository.fetchFromStream("task-");

      if (unparsedTaskEvents instanceof Error) {
        return unparsedTaskEvents;
      }

      const unparsedCreatorEvents = await this.eventRepository.fetchFromStream(`user-${createdByIdentifier}`);

      if (unparsedCreatorEvents instanceof Error) {
        return unparsedCreatorEvents;
      }

      const unparsedAssigneeEvents = await this.eventRepository.fetchFromStream(`user-${assignedToIdentifier}`);

      if (unparsedAssigneeEvents instanceof Error) {
        return unparsedAssigneeEvents;
      }

      const taskEvents = this.eventParserService.parseTaskEvents(unparsedTaskEvents);

      if (taskEvents instanceof Error) {
        return taskEvents;
      }

      const creatorEvents = this.eventParserService.parseUserEvents(unparsedCreatorEvents);

      if (creatorEvents instanceof Error) {
        return creatorEvents;
      }

      const assigneeEvents = this.eventParserService.parseUserEvents(unparsedAssigneeEvents);

      if (assigneeEvents instanceof Error) {
        return assigneeEvents;
      }

      const taskAggregate = TaskAggregate.from(taskEvents);

      if (taskAggregate instanceof Error) {
        return taskAggregate;
      }

      const creator = UserEntity.fromEvents(creatorEvents);

      if (creator instanceof Error) {
        return creator;
      }

      const maybeAssignee = UserEntity.fromEvents(assigneeEvents);
      const assignee = maybeAssignee instanceof Error ? null : maybeAssignee;

      const task = taskAggregate.addTask(
        description,
        doneAt,
        dueAt,
        creator,
        assignee
      );

      if (task instanceof Error) {
        return task;
      }

      const taskCreatedEvent: TaskCreatedEvent = {
        date: new Date(),
        identifier: randomUUID(),
        type: "TASK_CREATED",
        version: 1,
        data: {
          assignedTo: assignee && assignee.identifier,
          createdAt: task.createdAt,
          createdBy: creator.identifier,
          description: task.description.value,
          doneAt: task.doneAt,
          dueAt: task.dueAt,
          identifier: task.identifier,
          updatedAt: task.updatedAt
        }
      }

      const result = await this.eventRepository.saveToStream(`task-${task.identifier}`, taskCreatedEvent);

      if (result instanceof Error) {
        return result;
      }

      await this.taskView.apply(taskCreatedEvent);

      return null;
    } catch (error) {
      return new UnexpectedError(error instanceof Error ? error.message : String(error));
    } finally {
      eventLock.unlock();
    }
  }
}