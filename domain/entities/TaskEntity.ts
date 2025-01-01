import { Entity } from "./Entity";
import { TaskDescription } from "../values/TaskDescription"
import { TaskEvent } from "../events/tasks/TaskEvent";
import { TaskNotFoundError } from "../errors/TaskNotFoundError";
import { TaskDescriptionTooShortError } from "../errors/TaskDescriptionTooShortError";

export class TaskEntity implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly description: TaskDescription,
    public readonly doneAt: Date | null,
    public readonly dueAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly creatorIdentifier: string,
    public readonly assigneeIdentifier: string | null,
    public readonly projectIdentifier: string,
    public readonly categoryIdentifier: string
  ) { }

  public static from(
    identifier: string,
    description: string,
    doneAt: Date | null,
    dueAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
    creatorIdentifier: string,
    assigneeIdentifier: string | null,
  ) {
    const taskDescription = TaskDescription.from(description);

    if (taskDescription instanceof Error) {
      return taskDescription;
    }

    return new TaskEntity(
      identifier,
      taskDescription,
      doneAt,
      dueAt,
      createdAt,
      updatedAt,
      creatorIdentifier,
      assigneeIdentifier
    );
  }

  public static fromEvents(events: TaskEvent[]) {
    const initialTask = new TaskNotFoundError as TaskNotFoundError | TaskDescriptionTooShortError | TaskEntity

    const task = events.reduce((previousTask, event) => {
      if (!previousTask) {
        return previousTask;
      }

      switch (event.type) {
        case "TASK_CREATED":
          return TaskEntity.from(
            event.data.identifier,
            event.data.description,
            event.data.doneAt,
            event.data.dueAt,
            event.data.createdAt,
            event.data.updatedAt,
            event.data.createdBy,
            event.data.assignedTo,
          )
      }
    }, initialTask);

    if (task instanceof Error) {
      return task;
    }

    return task;
  }
}