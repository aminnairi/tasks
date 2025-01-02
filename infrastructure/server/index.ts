import { createServer } from "@todo/core";
import { createNodeHttpServerAdapter } from "@renkei/node"
import { listTasksImplementation } from "./implementations/listTasksImplementation";
import { loginImplementation } from "./implementations/loginImplementation";
import { InitializeAdministratorUsecase } from "@todo/application/usecases/InitializeAdministratorUsecase";
import { eventRepository } from "./repositories/eventRepository";
import { eventParserService } from "./services/eventParserService";
import { passwordService } from "./services/passwordService";
import { settings } from "./settings";
import { exhaustive } from "exhaustive";
import { createProjectImplementation } from "./implementations/createProjectImplementation";

const main = async () => {
  const initializeAdministratorUsecase = new InitializeAdministratorUsecase(
    eventRepository,
    eventParserService,
    passwordService
  );

  const result = await initializeAdministratorUsecase.execute(
    settings.administrator.username,
    settings.administrator.password
  );

  if (result instanceof Error) {
    exhaustive(result.name, {
      FailedToStreamFailedError: () => {
        console.error("Failed to fetch from the stream.");
      },
      FetchFromStreamError: () => {
        console.error("Stream error, possible data corruption.");
      },
      ParseError: () => {
        console.error("Failed to parse events from the stream, possible data corruption.");
      }
    });
    return;
  }

  console.log("Administrator initialized successfully.");

  const server = createServer({
    adapter: createNodeHttpServerAdapter({
      clients: [
        "http://localhost:5173"
      ]
    }),
    implementations: {
      listTasks: listTasksImplementation,
      login: loginImplementation,
      createProject: createProjectImplementation
    }
  });

  await server.start({
    port: 8000,
    host: "0.0.0.0"
  });

  console.log("Server started on http://localhost:8000");
}

main().catch(error => {
  console.error(error);
});