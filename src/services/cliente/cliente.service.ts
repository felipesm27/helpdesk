import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";

export async function createTicketService(
  clientId: string,
  data: {
    title: string;
    description: string;
    technicianId: string;
    hourId: string;
    services: string[];
  }
) {
  const { title, description, technicianId, hourId, services } = data;

  const technician = await prisma.user.findFirst({
    where: { id: technicianId, role: "tecnico" },
  });

  if (!technician) throw new AppError("Técnico inválido", 404);

  const schedule = await prisma.schedule.findFirst({
    where: { id: hourId, userId: technicianId },
  });

  if (!schedule) throw new AppError("Horário inválido para este técnico", 400);

  const serviceRecords = await prisma.service.findMany({
    where: { id: { in: services }, active: true },
  });

  if (serviceRecords.length !== services.length) {
    throw new AppError("Um ou mais serviços são inválidos", 400);
  }

  const total = serviceRecords.reduce((sum, s) => sum + s.price, 0);

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      clientId,
      technicianId,
      status: "ABERTO",
      services: {
        create: serviceRecords.map((service) => ({
          serviceId: service.id,
        })),
      },
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      technician: true,
    },
  });

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    createdAt: ticket.createdAt,
    technician: {
      id: ticket.technician!.id,
      name: ticket.technician!.name,
    },
    services: ticket.services.map((ts) => ts.service),
    total,
  };
}
