import { ProjectEntity } from "@todo/domain/entities/ProjectEntity";
import { TaskAggregate } from "../../domain/aggregates/TaskAggregate";
import { UserEntity } from "../../domain/entities/UserEntity";
import { UnexpectedError } from "../../domain/errors/UnexpectedError";
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

      const unparsedProjectEvents = await this.eventRepository.fetchFromStream(`project-${projectIdentifier}`);

      if (unparsedProjectEvents instanceof Error) {
        return unparsedProjectEvents;
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

      const projectEvents = this.eventParserService.parseProjectEvents(unparsedProjectEvents);

      if (projectEvents instanceof Error) {
        return projectEvents;
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
      const project = ProjectEntity.fromEvents(projectEvents);

      if (project instanceof Error) {
        return project;
      }

      const category = CategoryEntity.fromEvents(categoryEvents);

      if (category instanceof Error) {
        return category;
      }

      const taskCreatedEvent = taskAggregate.createTask(
        description,
        doneAt,
        dueAt,
        creator,
        assignee,
        project,
        category
      );

      if (taskCreatedEvent instanceof Error) {
        return taskCreatedEvent;
      }

      const result = await this.eventRepository.saveToStream(`task-${taskCreatedEvent.identifier}`, taskCreatedEvent);

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