import { ListProjectsUsecase } from "@todo/application/usecases/ListProjectsUsecase";
import { implementListProjectsRoute } from "@todo/core/routes/listProject";
import { eventRepository } from "../repositories/eventRepository";
import { eventParserService } from "../services/eventParserService";
import { exhaustive } from "exhaustive";

export const listProjectsImplementation = implementListProjectsRoute(async () => {
  const listProjectsUsecase = new ListProjectsUsecase(
    eventRepository,
    eventParserService
  );

  const projects = await listProjectsUsecase.execute();

  if (projects instanceof Error) {
    return exhaustive(projects.name, {
      ApplyError: () => {
        return {
          success: false,
          error: "DATABASE_CORRUPTED"
        } as const;
      },
      FetchFromStreamError: () => {
        return {
          success: false,
          error: "STREAM_FETCH_ERROR"
        } as const;
      },
      ParseError: () => {
        return {
          success: false,
          error: "DATABASE_CORRUPTED"
        } as const;
      },
      UnexpectedError: () => {
        return {
          success: false,
          error: "UNEXPECTED_ERROR"
        } as const;
      }
    });
  }

  return {
    success: true,
    projects
  };
});