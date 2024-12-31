import { EventShape } from "../EventShape";

export interface UserCreatedEventData {
  readonly identifier: string,
  readonly email: string,
  readonly firstname: string,
  readonly lastname: string,
  readonly createdAt: Date,
  readonly updatedAt: Date,
}

export interface UserCreatedEvent extends EventShape<"USER_CREATED", 1, UserCreatedEventData> { }