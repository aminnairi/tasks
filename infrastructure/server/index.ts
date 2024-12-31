import { createServer, implementListTaskRoute } from "@todo/core";
import { createNodeHttpServerAdapter } from "@renkei/node"
import { ListTasksUsecase } from "@todo/application/usecases/ListTasksUsecase";
import { MemoryEventRepository } from "@todo/adapters/repositories/MemoryEventRepository";
import { ZodEventParserService } from "@todo/adapters/services/ZodEventParserService";
import { exhaustive } from "exhaustive";

const eventRepository = new MemoryEventRepository();
const eventParserService = new ZodEventParserService();

const listTasksImplementation = implementListTaskRoute(async () => {
  try {
    const listTasksUsecase = new ListTasksUsecase(eventRepository, eventParserService);
    const tasks = await listTasksUsecase.execute();

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
            error: "STREAM_ERROR"
          }
        },
        ParseError: () => {
          return {
            success: false,
            error: "STREAM_ERROR"
          }
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

const server = createServer({
  adapter: createNodeHttpServerAdapter({
    clients: [
      "http://localhost:5173"
    ]
  }),
  implementations: {
    listTasks: listTasksImplementation
  }
});

await server.start({
  port: 8000,
  host: "0.0.0.0"
});

console.log("Server started on http://localhost:8000");