import { z } from "zod";
export const updateUserByAdminSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .optional(),
});

export const createServiceSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  price: z.number().positive("Preço deve ser maior que zero"),
});

export const updateServiceSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  price: z.number().positive("Preço deve ser maior que zero").optional(),
});
