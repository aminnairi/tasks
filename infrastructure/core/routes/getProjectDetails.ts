import { createHttpRoute } from "@renkei/core";
import { z } from "zod";

export const [getProjectDetailsRoute, implementGetProjectDetailsRoute] = createHttpRoute({
  input: value => {
    const schema = z.object({
      authenticationToken: z.string(),
      projectIdentifier: z.string()
    });

    return schema.parse(value);
  },
  output: value => {
    const schema = z.union([
      z.object({
        success: z.literal(true),
        project: z.object({
          identifier: z.string(),
          name: z.string(),
          createdAt: z.date({ coerce: true }),
          updatedAt: z.date({ coerce: true })
        })
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNEXPECTED_ERROR"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNAUTHORIZED"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("CORRUPTED_DATABASE"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("PROJECT_NOT_FOUND"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("STREAM_FETCH_ERROR"),
      }),
    ]);

    return schema.parse(value);
  }
});