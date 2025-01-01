import { UnauthorizedError } from "@todo/domain/errors/UnauthorizedError";
import { TaskAggregate } from "../../domain/aggregates/TaskAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { TasksResponse } from "../responses/TasksResponse";
import { AuthenticationService } from "../services/AuthenticationService";
import { EventParserService } from "../services/EventParserService";
import { UserEntity } from "@todo/domain/entities/UserEntity";

export class ListTasksUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(authenticationToken: string) {
    const userIdentifier = await this.authenticationService.verifyAuthenticationToken(authenticationToken);

    if (!userIdentifier) {
      return new UnauthorizedError();
    }

    const unparsedUserEvents = await this.eventRepository.fetchFromStream(`user-${userIdentifier}`);

    if (unparsedUserEvents instanceof Error) {
      return unparsedUserEvents;
    }

    const userEvents = this.eventParserService.parseUserEvents(unparsedUserEvents);

    if (userEvents instanceof Error) {
      return userEvents;
    }

    const user = UserEntity.fromEvents(userEvents);

    if (user instanceof Error) {
      return user;
    }

    const unparsedTaskEvents = await this.eventRepository.fetchFromStream("task-");

    if (unparsedTaskEvents instanceof Error) {
      return unparsedTaskEvents;
    }

    const taskEvents = this.eventParserService.parseTaskEvents(unparsedTaskEvents);

    if (taskEvents instanceof Error) {
      return taskEvents;
    }

    const taskAggregate = TaskAggregate.from(taskEvents);

    if (taskAggregate instanceof Error) {
      return taskAggregate;
    }

    const tasks = taskAggregate.listTasks();

    const response: TasksResponse = tasks.map(task => {
      return {
        ...task,
        description: task.description.value
      }
    });

    return response;
  }
}