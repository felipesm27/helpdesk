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

const allowedHours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "18:00",
] as const;

export const createScheduleSchema = z.object({
  hour: z.enum(allowedHours),
  userId: z.string().uuid(),
});
