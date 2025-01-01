import { ListTasksUsecase } from "@todo/application/usecases/ListTasksUsecase";
import { implementListTaskRoute } from "@todo/core/routes/listTasks";
import { exhaustive } from "exhaustive";
import { eventRepository } from "../repositories/eventRepository";
import { eventParserService } from "../services/eventParserService";
import { authenticationService } from "../services/authenticationService";

export const listTasksImplementation = implementListTaskRoute(async ({ authenticationToken }) => {
  try {
    const listTasksUsecase = new ListTasksUsecase(
      eventRepository,
      eventParserService,
      authenticationService
    );

    const tasks = await listTasksUsecase.execute(authenticationToken);

    if (tasks instanceof Error) {
      return exhaustive(tasks.name, {
        ApplyError: () => {
          return {
            success: false,
            error: "STREAM_ERROR"
          }
        },
        FetchFromStreamError: () => {
          return {
            success: false,
            error: "STREAM_ERROR",
          }
        },
        ParseError: () => {
          return {
            success: false,
            error: "STREAM_ERROR",
          }
        },
        UnauthorizedError: () => {
          return {
            success: false,
            error: "UNAUTHORIZED_ERROR",
          } as const;
        },
        UserNotFoundError: () => {
          return {
            success: false,
            error: "UNAUTHORIZED_ERROR",
          } as const;
        }
      });
    }

    return {
      success: true,
      tasks
    } as const
  } catch (error) {
    return {
      success: false,
      error: "UNEXPECTED_ERROR"
    } as const
  }
});