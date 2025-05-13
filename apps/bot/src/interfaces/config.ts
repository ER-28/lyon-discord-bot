import { z } from "zod";

export const configSchema = z.object({
  token: z.string(),
  mongoUri: z.string(),
});

export type Config = z.infer<typeof configSchema>;
