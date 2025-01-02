import { createHttpRoute } from "@renkei/core";
import { z } from "zod";

export const [createProjectRoute, implementCreateProjectRoute] = createHttpRoute({
  input: value => {
    const schema = z.object({
      name: z.string(),
      authenticationToken: z.string()
    });

    return schema.parse(value);
  },
  output: value => {
    const schema = z.union([
      z.object({
        success: z.literal(true),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNEXPECTED_ERROR")
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("STREAM_ERROR"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("PROJECT_NAME_ALREADY_EXISTS"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("PROJECT_NAME_TOO_SHORT"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNAUTHORIZED"),
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("CORRUPTION_ERROR"),
      }),
    ]);

    return schema.parse(value);
  }
});