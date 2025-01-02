import { LoginUsecase } from "@todo/application/usecases/LoginUsecase";
import { implementLoginRoute } from "@todo/core/routes/login";
import { eventRepository } from "../repositories/eventRepository";
import { eventParserService } from "../services/eventParserService";
import { passwordService } from "../services/passwordService";
import { authenticationService } from "../services/authenticationService";
import { exhaustive } from "exhaustive";

export const loginImplementation = implementLoginRoute(async ({ username, password }) => {
  const loginUsecase = new LoginUsecase(
    eventRepository,
    eventParserService,
    passwordService,
    authenticationService
  );

  const result = await loginUsecase.execute(
    username,
    password
  );

  if (result instanceof Error) {
    return exhaustive(result.name, {
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
      UnexpectedError: () => {
        return {
          success: false,
          error: "UNEXPECTED_ERROR"
        } as const;
      },
      UserNotFoundError: () => {
        return {
          success: false,
          error: "BAD_CREDENTIALS"
        } as const;
      },
      ApplyError: () => {
        return {
          success: false,
          error: "CORRUPTED_DATABASE"
        } as const;
      }
    });
  }

  return {
    success: true,
    authenticationToken: result
  } as const;
});