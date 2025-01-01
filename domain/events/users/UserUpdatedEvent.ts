import { EventShape } from "../EventShape";

export interface UserUpdatedEventData {
  readonly identifier: string,
  readonly username: string | null,
  readonly password: string | null,
  readonly createdAt: Date | null,
  readonly updatedAt: Date | null,
  readonly administrator: boolean | null,
}

export interface UserUpdatedEvent extends EventShape<"USER_UPDATED", 1, UserUpdatedEventData> { }