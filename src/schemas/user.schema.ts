import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(2),
});
