import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import bcrypt from "bcryptjs";

export async function listClientsService() {
  return await prisma.user.findMany({
    where: { role: "cliente" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function listTechnicians() {
  const technicians = await prisma.user.findMany({
    where: { role: "tecnico" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return technicians;
}

interface UpdateUserData {
  name?: string;
  password?: string;
}

export async function updateUserByAdmin(userId: string, data: UpdateUserData) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Não é permitido editar administradores", 403);
  }

  const updateData: UpdateUserData = {};

  if (data.name) updateData.name = data.name;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 8);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}

export async function deleteUserByAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Não é permitido excluir administradores", 403);
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "Usuário excluído com sucesso." };
}
