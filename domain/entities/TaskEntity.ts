import { Entity } from "./Entity";
import { TaskDescription } from "../values/TaskDescription"
import { TaskEvent } from "../events/tasks/TaskEvent";
import { TaskCreatedEvent } from "../events/tasks/TaskCreatedEvent";
import { randomUUID } from "crypto";

export class TaskEntity implements Entity<TaskEvent> {
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
    projectIdentifier: string,
    categoryIdentifier: string,
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
      assigneeIdentifier,
      projectIdentifier,
      categoryIdentifier
    );
  }

  public apply(event: TaskEvent) {
    switch (event.type) {
      case "TASK_CREATED":
        return TaskEntity.from(
          event.data.identifier,
          event.data.description,
          event.data.doneAt,
          event.data.dueAt,
          event.data.createdAt,
          event.data.updatedAt,
          event.data.creatorIdentifier,
          event.data.assigneeIdentifier,
          event.data.projectIdentifier,
          event.data.categoryIdentifier,
        );
    }
  }

  public static create(
    identifier: string,
    description: string,
    doneAt: Date | null,
    dueAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
    creatorIdentifier: string,
    assigneeIdentifier: string | null,
    projectIdentifier: string,
    categoryIdentifier: string,
  ) {
    const task = TaskEntity.from(
      identifier,
      description,
      doneAt,
      dueAt,
      createdAt,
      updatedAt,
      creatorIdentifier,
      assigneeIdentifier,
      projectIdentifier,
      categoryIdentifier
    );

    if (task instanceof Error) {
      return task;
    }

    const taskCreatedEvent: TaskCreatedEvent = {
      date: new Date(),
      identifier: randomUUID(),
      type: "TASK_CREATED",
      version: 1,
      data: {
        assigneeIdentifier: task.assigneeIdentifier,
        categoryIdentifier: task.categoryIdentifier,
        createdAt: task.createdAt,
        creatorIdentifier: task.creatorIdentifier,
        description: task.description.value,
        doneAt: task.doneAt,
        dueAt: task.dueAt,
        identifier: task.identifier,
        projectIdentifier: task.projectIdentifier,
        updatedAt: task.updatedAt
      },
    }

    return taskCreatedEvent;
  }
}