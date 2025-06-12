import { Request, Response } from "express";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { AppError } from "@/utils/AppError";
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from "@/services/auth/auth.service";
import { Role } from "@prisma/client";

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Dados inválidos no registro", 400);
  }

  const user = await registerUser(parsed.data);

  return res.status(201).json({
    message: "Usuário registrado com sucesso",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: Role,
    },
  });
}

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Credenciais inválidas", 400);
  }

  const { email, password } = parsed.data;

  const result = await loginUser(email, password);

  return res.status(200).json({
    message: "Login realizado com sucesso",
    ...result,
  });
}

export async function changePasswordController(req: Request, res: Response) {
  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Dados inválidos", 400);
  }

  const { currentPassword, newPassword } = parsed.data;

  const result = await changePassword(
    req.user!.id,
    currentPassword,
    newPassword
  );

  return res.status(200).json(result);
}

export async function forgotPasswordController(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await forgotPassword(parsed.data.email);
  return res.status(200).json(result);
}

export async function resetPasswordController(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { token, newPassword } = parsed.data;

  const result = await resetPassword(token, newPassword);

  return res.status(200).json(result);
}
