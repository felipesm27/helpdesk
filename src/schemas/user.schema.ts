import { z } from "zod";

export const updateUserProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword) return !!data.currentPassword;
      return true;
    },
    {
      message: "A senha atual é obrigatória para alterar a senha.",
      path: ["currentPassword"],
    }
  );
