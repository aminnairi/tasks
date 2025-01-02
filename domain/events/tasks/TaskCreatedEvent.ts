import { EventShape } from "../EventShape";

export interface TaskCreatedEventData {
  identifier: string,
  description: string,
  doneAt: Date | null,
  dueAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
  creatorIdentifier: string,
  assigneeIdentifier: string | null,
}

export interface TaskCreatedEvent extends EventShape<"TASK_CREATED", 1, TaskCreatedEventData> { }