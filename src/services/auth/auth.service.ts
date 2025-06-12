import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { AppError } from "@/utils/AppError";
import nodemailer from "nodemailer";
import { Role } from "@prisma/client";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) {
  const { name, email, password, role } = data;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new AppError("E-mail já está em uso", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("E-mail ou senha incorretos", 401);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    throw new AppError("Senha atual incorreta", 401);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError("A nova senha deve ser diferente da atual", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Senha alterada com sucesso" };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("E-mail não encontrado", 404);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const resetLink = `http://localhost:3333/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: '"HelpDesk" <no-reply@helpdesk.com>',
    to: user.email,
    subject: "Recuperação de Senha",
    html: `<p>Clique no link para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
  });

  return { message: "E-mail de recuperação enviado com sucesso" };
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tokenRecord) {
    throw new AppError("Token inválido", 400);
  }

  if (tokenRecord.expiresAt < new Date()) {
    throw new AppError("Token expirado", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { message: "Senha redefinida com sucesso" };
}
