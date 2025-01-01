import { EventShape } from "../EventShape";

export interface UserCreatedEventData {
  readonly identifier: string,
  readonly username: string,
  readonly password: string,
  readonly createdAt: Date,
  readonly updatedAt: Date,
  readonly administrator: boolean,
}

export interface UserCreatedEvent extends EventShape<"USER_CREATED", 1, UserCreatedEventData> { }