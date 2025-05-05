import { z } from "zod";

export const configSchema = z.object({
  token: z.string(),
  roles: z.object({
    admin: z.string(),
    member: z.string(),
  }),
  channels: z.object({
    presentation: z.string(),
  }),
  welcome: z.object({
    deleteDelay: z.number().int().positive(),
  }),
});

export type Config = z.infer<typeof configSchema>;
