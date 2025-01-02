import { ProjectEvent } from "@todo/domain/events/projects/ProjectEvent";
import { TaskEvent } from "../../domain/events/tasks/TaskEvent";
import { UserEvent } from "../../domain/events/users/UserEvent";
import { ParseError } from "@todo/domain/errors/ParseError"

export interface EventParserService {
  readonly parseUserEvents: (events: unknown[]) => ParseError | UserEvent[];
  readonly parseTaskEvents: (events: unknown[]) => ParseError | TaskEvent[];
  readonly parseProjectEvents: (events: unknown[]) => ParseError | ProjectEvent[];
}