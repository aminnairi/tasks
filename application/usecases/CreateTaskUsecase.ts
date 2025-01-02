import { randomUUID } from "crypto";
import { TaskAggregate } from "../../domain/aggregates/TaskAggregate";
import { UserEntity } from "../../domain/entities/UserEntity";
import { UnexpectedError } from "../../domain/errors/UnexpectedError";
import { TaskCreatedEvent } from "../../domain/events/tasks/TaskCreatedEvent";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { CategoryEntity } from "@todo/domain/entities/CategoryEntity";
import { AuthenticationService } from "../services/AuthenticationService";

export class CreateTaskUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(
    authenticationToken: string,
    description: string,
    assignedToIdentifier: string | null,
    projectIdentifier: string,
    categoryIdentifier: string,
    doneAt: Date | null,
    dueAt: Date | null
  ) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      await eventLock.lock();

      const creatorIdentifier = await this.authenticationService.verifyAuthenticationToken(authenticationToken);
      const unparsedTaskEvents = await this.eventRepository.fetchFromStream("task-");

      if (unparsedTaskEvents instanceof Error) {
        return unparsedTaskEvents;
      }

      const unparsedCreatorEvents = await this.eventRepository.fetchFromStream(`user-${creatorIdentifier}`);

      if (unparsedCreatorEvents instanceof Error) {
        return unparsedCreatorEvents;
      }

      const unparsedAssigneeEvents = await this.eventRepository.fetchFromStream(`user-${assignedToIdentifier}`);

      if (unparsedAssigneeEvents instanceof Error) {
        return unparsedAssigneeEvents;
      }

      const unparsedCategoryEvents = await this.eventRepository.fetchFromStream(`category-${categoryIdentifier}`);

      if (unparsedCategoryEvents instanceof Error) {
        return unparsedCategoryEvents;
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

      const categoryEvents = this.eventParserService.parseCategoryEvents(unparsedCategoryEvents);

      if (categoryEvents instanceof Error) {
        return categoryEvents;
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
      const category = CategoryEntity.fromEvents(categoryEvents);

      if (category instanceof Error) {
        return category;
      }

        description,
        doneAt,
        dueAt,
        creator,
        assignee
        category
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
          assigneeIdentifier: assignee && assignee.identifier,
          createdAt: task.createdAt,
          creatorIdentifier: creator.identifier,
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

      return null;
    } catch (error) {
      return new UnexpectedError(error instanceof Error ? error.message : String(error));
    } finally {
      eventLock.unlock();
    }
  }
}