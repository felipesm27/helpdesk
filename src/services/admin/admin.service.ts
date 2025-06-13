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

export async function createService(data: { name: string; price: number }) {
  const newService = await prisma.service.create({
    data: {
      name: data.name,
      price: data.price,
      active: true, // sempre true na criação
    },
    select: {
      id: true,
      name: true,
      price: true,
      active: true,
      createdAt: true,
    },
  });

  return newService;
}

export async function updateService(
  serviceId: string,
  data: { name?: string; price?: number }
) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!service) {
    throw new AppError("Serviço não encontrado", 404);
  }

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data,
    select: {
      id: true,
      name: true,
      price: true,
      active: true,
      createdAt: true,
    },
  });

  return updated;
}

export async function listServices() {
  return await prisma.service.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      price: true,
      active: true,
      createdAt: true,
    },
  });
}

export async function desactivedServices() {
  return await prisma.service.findMany({
    where: { active: false },
    select: {
      id: true,
      name: true,
      price: true,
      active: true,
      createdAt: true,
    },
  });
}

export async function disableService(serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!service) throw new AppError("Serviço não encontrado", 404);

  return prisma.service.update({
    where: { id: serviceId },
    data: { active: false },
    select: {
      id: true,
      name: true,
      active: true,
      price: true,
      createdAt: true,
    },
  });
}

export async function reactivateService(serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!service) throw new AppError("Serviço não encontrado", 404);

  return await prisma.service.update({
    where: { id: serviceId },
    data: { active: true },
    select: {
      id: true,
      name: true,
      price: true,
      active: true,
      createdAt: true,
    },
  });
}

export async function listSchedules() {
  const schedules = await prisma.schedule.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return schedules;
}

export async function createSchedule(data: { hour: string; userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new AppError("Técnico não encontrado", 404);
  }

  if (user.role !== "tecnico") {
    throw new AppError("Horários só podem ser atribuídos a técnicos", 400);
  }

  // Verifica se já existe horário duplicado para o mesmo técnico
  const existing = await prisma.schedule.findFirst({
    where: {
      hour: data.hour,
      userId: data.userId,
    },
  });

  if (existing) {
    throw new AppError("Este técnico já possui esse horário cadastrado", 409);
  }

  const schedule = await prisma.schedule.create({
    data: {
      hour: data.hour,
      userId: data.userId,
    },
    select: {
      id: true,
      hour: true,
      userId: true,
    },
  });

  return schedule;
}

export async function deleteSchedule(scheduleId: string) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new AppError("Horário não encontrado", 404);
  }

  await prisma.schedule.update({
    where: { id: scheduleId },
    data: { active: false }, // Soft delete
  });

  return { message: "Horário desativado com sucesso." };
}

export async function reactivateSchedule(scheduleId: string) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new AppError("Horário não encontrado", 404);
  }

  return await prisma.schedule.update({
    where: { id: scheduleId },
    data: { active: true },
  });
}
