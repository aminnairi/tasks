import { z, ZodSchema } from "zod";
import { EventParserService } from "@todo/application/services/EventParserService";
import { TaskEvent } from "@todo/domain/events/tasks/TaskEvent";
import { UserEvent } from "@todo/domain/events/users/UserEvent";
import { ParseError } from "@todo/domain/errors/ParseError";
import { ProjectEvent } from "@todo/domain/events/projects/ProjectEvent";
import { CategoryEvent } from "@todo/domain/events/categories/CategoryEvent";

export class ZodEventParserService implements EventParserService {
  public parseUserEvents(events: unknown[]): ParseError | UserEvent[] {
    const userEventsSchema = z.array(z.object({
      identifier: z.string(),
      type: z.literal("USER_CREATED"),
      version: z.literal(1),
      date: z.date({ coerce: true }),
      data: z.object({
        identifier: z.string(),
        username: z.string(),
        password: z.string(),
        createdAt: z.date({ coerce: true }),
        updatedAt: z.date(),
        administrator: z.boolean(),
      })
    })) satisfies ZodSchema<Array<UserEvent>>;

    const validation = userEventsSchema.safeParse(events);

    if (validation.success) {
      return validation.data;
    }

    return new ParseError
  }

  parseTaskEvents(events: unknown[]): ParseError | TaskEvent[] {
    const taskEventsSchema = z.array(z.object({
      identifier: z.string(),
      type: z.literal("TASK_CREATED"),
      version: z.literal(1),
      date: z.date({ coerce: true }),
      data: z.object({
        identifier: z.string(),
        description: z.string(),
        doneAt: z.union([
          z.date({ coerce: true }),
          z.null()
        ]),
        dueAt: z.union([
          z.date({ coerce: true }),
          z.null()
        ]),
        createdAt: z.date({ coerce: true }),
        updatedAt: z.date({ coerce: true }),
        assignedTo: z.union([
        creatorIdentifier: z.string(),
          z.string(),
          z.null()
        ])
      })
    }));

    const validation = taskEventsSchema.safeParse(events);

    if (validation.success) {
      return validation.data;
    }

    return new ParseError
  }

  public parseProjectEvents(events: unknown[]): ParseError | ProjectEvent[] {
    const schema = z.array(z.object({
      identifier: z.string(),
      date: z.date({ coerce: true }),
      version: z.literal(1),
      type: z.literal("PROJECT_CREATED"),
      data: z.object({
        identifier: z.string(),
        name: z.string(),
        managerIdentifier: z.string(),
        createdAt: z.date({ coerce: true }),
        updatedAt: z.date({ coerce: true })
      }),
    })) satisfies ZodSchema<Array<ProjectEvent>>;

    const validation = schema.safeParse(events);

    if (validation.success) {
      return validation.data;
    }

    return new ParseError(String(validation.error));
  }

  public parseCategoryEvents(events: unknown[]): ParseError | CategoryEvent[] {
    const schema = z.array(z.object({
      identifier: z.string(),
      date: z.date({ coerce: true }),
      type: z.literal("CATEGORY_CREATED"),
      version: z.literal(1),
      data: z.object({
        identifier: z.string(),
        name: z.string(),
        color: z.string(),
        projectIdentifier: z.string(),
      }),
    })) satisfies ZodSchema<Array<CategoryEvent>>;

    return schema.parse(events);
  }
}