import { ProjectEvent } from "@todo/domain/events/projects/ProjectEvent";
import { TaskEvent } from "../../domain/events/tasks/TaskEvent";
import { UserEvent } from "../../domain/events/users/UserEvent";
import { ParseError } from "@todo/domain/errors/ParseError"
import { CategoryEvent } from "@todo/domain/events/categories/CategoryEvent";

export interface EventParserService {
  readonly parseUserEvents: (events: unknown[]) => ParseError | UserEvent[];
  readonly parseTaskEvents: (events: unknown[]) => ParseError | TaskEvent[];
  readonly parseProjectEvents: (events: unknown[]) => ParseError | ProjectEvent[];
  readonly parseCategoryEvents: (events: unknown[]) => ParseError | CategoryEvent[];
}