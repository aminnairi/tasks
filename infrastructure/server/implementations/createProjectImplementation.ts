import { CreateProjectUsecase } from "@todo/application/usecases/CreateProjectUsecase";
import { implementCreateProjectRoute } from "@todo/core/routes/createProject";
import { eventRepository } from "../repositories/eventRepository";
import { eventParserService } from "../services/eventParserService";
import { authenticationService } from "../services/authenticationService";
import { exhaustive } from "exhaustive";

export const createProjectImplementation = implementCreateProjectRoute(async ({ authenticationToken, name }) => {
  const createProjectUsecase = new CreateProjectUsecase(
    eventRepository,
    eventParserService,
    authenticationService
  );

  const result = await createProjectUsecase.execute(
    name,
    authenticationToken
  );

  if (result instanceof Error) {
    return exhaustive(result.name, {
      ApplyError: () => {
        return {
          success: false,
          error: "CORRUPTION_ERROR"
        } as const;
      },
      FailedToStreamFailedError: () => {
        return {
          success: false,
          error: "STREAM_ERROR"
        } as const;
      },
      FetchFromStreamError: () => {
        return {
          success: false,
          error: "STREAM_ERROR"
        } as const;
      },
      ParseError: () => {
        return {
          success: false,
          error: "STREAM_ERROR"
        } as const;
      },
      ProjectNameAlreadyTakenError: () => {
        return {
          success: false,
          error: "PROJECT_NAME_ALREADY_EXISTS"
        } as const;
      },
      ProjectNameTooShortError: () => {
        return {
          success: false,
          error: "PROJECT_NAME_TOO_SHORT"
        } as const;
      },
      UnauthorizedError: () => {
        return {
          success: false,
          error: "UNAUTHORIZED",
        } as const;
      },
      UnexpectedError: () => {
        return {
          success: false,
          error: "UNEXPECTED_ERROR",
        } as const;
      }
    });
  }

  return {
    success: true
  } as const;
});