import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import bcrypt from "bcryptjs";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
  }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (data.newPassword) {
    const isValid = await bcrypt.compare(data.currentPassword!, user.password);
    if (!isValid) {
      throw new AppError("Senha atual incorreta", 401);
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      password: data.newPassword
        ? await bcrypt.hash(data.newPassword, 10)
        : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });

  return updated;
}

export async function deleteUserAccount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  await prisma.user.delete({ where: { id: userId } });

  return { message: "Conta excluída com sucesso" };
}
