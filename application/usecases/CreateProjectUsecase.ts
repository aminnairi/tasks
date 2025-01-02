import { ProjectAggregate } from "@todo/domain/aggregates/ProjectAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { UserEntity } from "@todo/domain/entities/UserEntity";
import { AuthenticationService } from "../services/AuthenticationService";
import { UnauthorizedError } from "@todo/domain/errors/UnauthorizedError";
import { UnexpectedError } from "@todo/domain/errors/UnexpectedError";

export class CreateProjectUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly authenticationService: AuthenticationService,
  ) { }
  public async execute(
    name: string,
    authenticationToken: string,
  ) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      const managerIdentifier = await this.authenticationService.verifyAuthenticationToken(authenticationToken);

      if (!managerIdentifier) {
        return new UnauthorizedError();
      }

      const unparsedManagerEvents = await this.eventRepository.fetchFromStream(`user-${managerIdentifier}`)

      if (unparsedManagerEvents instanceof Error) {
        return unparsedManagerEvents;
      }

      const managerEvents = this.eventParserService.parseUserEvents(unparsedManagerEvents);

      if (managerEvents instanceof Error) {
        return managerEvents;
      }

      const manager = UserEntity.fromEvents(managerEvents)

      if (manager instanceof Error) {
        return manager;
      }

      const unparsedProjectEvents = await this.eventRepository.fetchFromStream("project-");

      if (unparsedProjectEvents instanceof Error) {
        return unparsedProjectEvents
      }

      const projectEvents = this.eventParserService.parseProjectEvents(unparsedProjectEvents);

      if (projectEvents instanceof Error) {
        return projectEvents;
      }

      const projectAggregate = ProjectAggregate.fromEvents(projectEvents);

      if (projectAggregate instanceof Error) {
        return projectAggregate;
      }

      const projectCreatedEvent = projectAggregate.createProject(
        name,
        manager
      );

      if (projectCreatedEvent instanceof Error) {
        return projectCreatedEvent;
      }

      const result = await this.eventRepository.saveToStream(`project-${projectCreatedEvent.data.identifier}`, projectCreatedEvent);

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