export interface TaskResponse {
  readonly identifier: string,
  readonly description: string,
  readonly doneAt: Date | null,
  readonly dueAt: Date | null,
  readonly createdAt: Date,
  readonly updatedAt: Date,
  readonly creatorIdentifier: string,
  readonly assigneeIdentifier: string | null,
}

export type TasksResponse = Array<TaskResponse>