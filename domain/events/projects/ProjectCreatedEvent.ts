import { EventShape } from "../EventShape";

export interface ProjectCreatedEventData {
  readonly identifier: string,
  readonly name: string,
  readonly managerIdentifier: string,
  readonly createdAt: Date,
  readonly updatedAt: Date
}

export interface ProjectCreatedEvent extends EventShape<"PROJECT_CREATED", 1, ProjectCreatedEventData> { }