import { ProjectAggregate } from "@todo/domain/aggregates/ProjectAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { AuthenticationService } from "../services/AuthenticationService";
import { UnexpectedError } from "@todo/domain/errors/UnexpectedError";

export class GetProjectDetailsUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(authenticationToken: string, projectIdentifier: string) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      await eventLock.lock();

      const userIdentifier = await this.authenticationService.verifyAuthenticationToken(authenticationToken);

      if (userIdentifier instanceof Error) {
        return userIdentifier;
      }

      const unparsedProjectsEvents = await this.eventRepository.fetchFromStream("project-");

      if (unparsedProjectsEvents instanceof Error) {
        return unparsedProjectsEvents;
      }

      const projectsEvents = this.eventParserService.parseProjectEvents(unparsedProjectsEvents);

      if (projectsEvents instanceof Error) {
        return projectsEvents;
      }

      const projectAggregate = ProjectAggregate.fromEvents(projectsEvents);

      if (projectAggregate instanceof Error) {
        return projectAggregate;
      }

      const project = projectAggregate.getProjectFromManager(
        userIdentifier,
        projectIdentifier,
      );

      if (project instanceof Error) {
        return project;
      }

      return project;
    } catch (error) {
      return new UnexpectedError(error instanceof Error ? error.message : String(error));
    } finally {
      eventLock.unlock();
    }
  }
}