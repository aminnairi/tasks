import { TaskAggregate } from "../../domain/aggregates/TaskAggregate";
import { EventRepository } from "../repositories/EventRepository";
import { TasksResponse } from "../responses/TasksResponse";
import { EventParserService } from "../services/EventParserService";

export class ListTasksUsecase {
  public constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParserService: EventParserService,
  ) { }

  public async execute() {
    const unparsedTaskEvents = await this.eventRepository.fetchFromStream("task-");

    if (unparsedTaskEvents instanceof Error) {
      return unparsedTaskEvents;
    }

    const taskEvents = this.eventParserService.parseTaskEvents(unparsedTaskEvents);

    if (taskEvents instanceof Error) {
      return taskEvents;
    }

    const taskAggregate = TaskAggregate.from(taskEvents);

    if (taskAggregate instanceof Error) {
      return taskAggregate;
    }

    const tasks = taskAggregate.listTasks();

    const response: TasksResponse = {
      tasks: tasks.map(task => {
        return {
          ...task,
          description: task.description.value
        }
      })
    };

    return response;
  }
}