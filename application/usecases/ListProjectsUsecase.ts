import { ProjectAggregate } from "@todo/domain/aggregates/ProjectAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { EventParserService } from "../services/EventParserService";
import { UnexpectedError } from "@todo/domain/errors/UnexpectedError";
import { ProjectsResponse } from "../responses/ProjectsResponse";

export class ListProjectsUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
  ) { }

  public async execute() {
    const eventLock = this.eventRepository.createEventLock();

    try {
      await eventLock.lock();

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

      const projects = projectAggregate.getAllProjects();

      const response: ProjectsResponse = projects.map(project => {
        return {
          ...project,
          name: project.name.value
        }
      });

      return response;
    } catch (error) {
      return new UnexpectedError(error instanceof Error ? error.message : String(error));
    } finally {
      eventLock.unlock();
    }
  }
}