import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";

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
  data: { name: string }
) {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });
}

export async function deleteUserAccount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  await prisma.user.delete({ where: { id: userId } });

  return { message: "Conta excluída com sucesso" };
}
