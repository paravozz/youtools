import { z } from "zod";

export const ConfigSchema = z.object({
  typescript: z.boolean(),
  overwrite: z.boolean(),
  appendToIndex: z.boolean(),
  path: z.string(),
  silent: z.boolean(),
});

export const AddOptionsSchema = ConfigSchema.extend({
  utils: z.array(z.string()).optional(),
  path: z.string().optional(),
});

export const InitOptionsSchema = ConfigSchema.extend({});
