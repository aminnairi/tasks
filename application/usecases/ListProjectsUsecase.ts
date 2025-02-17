import { ProjectAggregate } from "@todo/domain/aggregates/ProjectAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { UnexpectedError } from "@todo/domain/errors/UnexpectedError";
import { ProjectsResponse } from "../responses/ProjectsResponse";
import { AuthenticationService } from "../services/AuthenticationService";

export class ListProjectsUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  public async execute(authenticationToken: string) {
    const eventLock = this.eventRepository.createEventLock();

    try {
      await eventLock.lock();

      const userIdentifier = await this.authenticationService.verifyAuthenticationToken(authenticationToken);

      if (userIdentifier instanceof Error) {
        return userIdentifier;
      }

      const unparsedProjectEvents = await this.eventRepository.fetchFromStream("project-");

      if (unparsedProjectEvents instanceof Error) {
        return unparsedProjectEvents;
      }

      const projectEvents = this.eventParserService.parseProjectEvents(unparsedProjectEvents);

      if (projectEvents instanceof Error) {
        return projectEvents;
      }

      const projectAggregate = ProjectAggregate.fromEvents(projectEvents);

      if (projectAggregate instanceof Error) {
        return projectAggregate;
      }

      const projects = projectAggregate.getAllProjectsForManager(userIdentifier);

      const response: ProjectsResponse = projects.map(project => {
        return {
          ...project,
          name: project.name.value
        }
      });

      return response;
    } catch (error) {
      console.error(error);
      return new UnexpectedError(error instanceof Error ? error.message : String(error));
    } finally {
      eventLock.unlock();
    }
  }
}