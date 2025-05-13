import { z } from "zod";

export const configSchema = z.object({
  token: z.string(),
  mongoUri: z.string(),
  roles: z.object({
    admin: z.string(),
    member: z.string(),
  }),
  channels: z.object({
    presentation: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>;
