import { createHttpRoute } from "@renkei/core";
import { z } from "zod";

export const [loginRoute, implementLoginRoute] = createHttpRoute({
  input: value => {
    const schema = z.object({
      username: z.string(),
      password: z.string()
    });

    return schema.parse(value);
  },
  output: value => {
    const schema = z.union([
      z.object({
        success: z.literal(true),
        authenticationToken: z.string()
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("UNEXPECTED_ERROR")
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("STREAM_ERROR")
      }),
      z.object({
        success: z.literal(false),
        error: z.literal("BAD_CREDENTIALS")
      })
      z.object({
        success: z.literal(false),
        error: z.literal("CORRUPTED_DATABASE"),
      }),
    ]);

    return schema.parse(value);
  }
});