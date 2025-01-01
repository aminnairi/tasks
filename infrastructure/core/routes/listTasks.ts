import { createHttpRoute } from "@renkei/core";
import { z } from "zod";

export const [listTaskRoute, implementListTaskRoute] = createHttpRoute({
  input: z.object({
    authenticationToken: z.string()
  }).parse,
  output: value => {
    return z.union([
      z.object({
        success: z.literal(true),
        tasks: z.array(z.object({
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
          creatorIdentifier: z.string(),
          assigneeIdentifier: z.union([
            z.string(),
            z.null(),
          ]),
        })),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("STREAM_ERROR")
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNEXPECTED_ERROR"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNAUTHORIZED_ERROR"),
      }),
    ]).parse(value);
  }
});