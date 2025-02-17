import { Aggregate } from "./Aggregate";
import { TaskEvent } from "../events/tasks/TaskEvent";
import { TaskEntity } from "../entities/TaskEntity";
import { TaskDescriptionTooShortError } from "../errors/TaskDescriptionTooShortError";
import { ApplyError } from "../errors/ApplyError";
import { randomUUID } from "crypto";
import { UserEntity } from "../entities/UserEntity";
import { TaskWithSimilarDescriptionError } from "../errors/TaskWithSimilarDescriptionError"
import { ProjectEntity } from "../entities/ProjectEntity";
import { CategoryEntity } from "../entities/CategoryEntity";

export class TaskAggregate implements Aggregate<TaskEvent> {
  private constructor(private readonly tasks: TaskEntity[]) { }

  public static from(events: TaskEvent[]) {
    return new TaskAggregate([]).apply(events);
  }

  public apply(events: TaskEvent[]) {
    const initialTasks = [] as ApplyError<TaskDescriptionTooShortError> | TaskEntity[];

    const tasks: TaskEntity[] | ApplyError<TaskDescriptionTooShortError> = events.reduce((previousTasks, event) => {
      const task = TaskEntity.from(
        event.data.identifier,
        event.data.description,
        event.data.doneAt,
        event.data.dueAt,
        event.data.createdAt,
        event.data.updatedAt,
        event.data.creatorIdentifier,
        event.data.assigneeIdentifier,
        event.data.projectIdentifier,
        event.data.categoryIdentifier
      );

      if (task instanceof Error) {
        if (previousTasks instanceof Error) {
          return new ApplyError([...previousTasks.errors, task]);
        }

        return new ApplyError([task]);
      }

      if (previousTasks instanceof Error) {
        return previousTasks;
      }

      return [
        ...previousTasks,
        task
      ]
    }, initialTasks);

    if (tasks instanceof Error) {
      return tasks;
    }

    return new TaskAggregate(tasks);
  }

  public createTask(
    description: string,
    doneAt: Date | null,
    dueAt: Date | null,
    creator: UserEntity,
    assignee: UserEntity | null,
    project: ProjectEntity,
    category: CategoryEntity
  ) {
    const identifier = randomUUID() as string;
    const createdAt = new Date();
    const updatedAt = new Date();

    const taskWithSimilarDescription = this.tasks.find(task => {
      return task.description.isValue(description);
    });

    if (taskWithSimilarDescription) {
      return new TaskWithSimilarDescriptionError
    }

    return TaskEntity.create(
      identifier,
      description,
      doneAt,
      dueAt,
      createdAt,
      updatedAt,
      creator.identifier,
      assignee && assignee.identifier,
      project.identifier,
      category.identifier,
    );
  }

  public listTasks() {
    return this.tasks;
  }
}