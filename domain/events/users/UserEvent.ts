import { UserCreatedEvent } from "./UserCreatedEvent";
import { UserUpdatedEvent } from "./UserUpdatedEvent";

export type UserEvent =
  | UserCreatedEvent
  | UserUpdatedEvent