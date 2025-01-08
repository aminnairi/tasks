import { createHttpRoute } from "@renkei/core";
import { z } from "zod";

export const [listProjectsRoute, implementListProjectsRoute] = createHttpRoute({
  input: value => {
    const schema = z.object({
      authenticationToken: z.string()
    });

    return schema.parse(value);
  },
  output: value => {
    const schema = z.union([
      z.object({
        success: z.literal(true),
        projects: z.array(z.object({
          identifier: z.string(),
          name: z.string(),
          createdAt: z.date({ coerce: true }),
          updatedAt: z.date({ coerce: true }),
        }))
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNEXPECTED_ERROR"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("DATABASE_CORRUPTED"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("STREAM_FETCH_ERROR"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNAUTHORIZED"),
      }),
    ]);

    return schema.parse(value);
  }
});