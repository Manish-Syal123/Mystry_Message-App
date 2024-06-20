import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), //itentifier => email or name
  password: z.string(),
});
