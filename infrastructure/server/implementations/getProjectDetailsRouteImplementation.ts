import { GetProjectDetailsUsecase } from "@todo/application/usecases/GetProjectDetailsUsecase";
import { implementGetProjectDetailsRoute } from "@todo/core/routes/getProjectDetails";
import { eventRepository } from "../repositories/eventRepository";
import { eventParserService } from "../services/eventParserService";
import { authenticationService } from "../services/authenticationService";
import { exhaustive } from "exhaustive";

export const getProjectDetailsRouteImplementation = implementGetProjectDetailsRoute(async ({ authenticationToken, projectIdentifier }) => {
  try {
    const getProjectDetailsUsecase = new GetProjectDetailsUsecase(
      eventRepository,
      eventParserService,
      authenticationService,
    );

    const result = await getProjectDetailsUsecase.execute(
      authenticationToken,
      projectIdentifier,
    );

    if (result instanceof Error) {
      return exhaustive(result.name, {
        ApplyError: () => {
          return {
            success: false,
            error: "CORRUPTED_DATABASE"
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
            error: "CORRUPTED_DATABASE"
          } as const;
        },
        ProjectNotFoundError: () => {
          return {
            success: false,
            error: "PROJECT_NOT_FOUND"
          } as const;
        },
        UnauthorizedError: () => {
          return {
            success: false,
            error: "UNAUTHORIZED"
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
      project: {
        createdAt: result.createdAt,
        identifier: result.identifier,
        name: result.name.value,
        updatedAt: result.updatedAt
      }
    } as const;
  } catch (error) {
    return {
      success: false,
      error: "UNEXPECTED_ERROR"
    } as const;
  }
});