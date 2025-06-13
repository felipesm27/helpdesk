import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";

export async function getTechnicianTickets(userId: string) {
  const tickets = await prisma.ticket.findMany({
    where: { technicianId: userId },
    include: {
      services: {
        include: { service: true },
      },
      client: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tickets.map((ticket) => {
    const total = ticket.services.reduce((sum, s) => sum + s.service.price, 0);

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      client: ticket.client,
      services: ticket.services.map((s) => s.service),
      total,
    };
  });
}

export async function getTicketDetailsByTechnician(
  ticketId: string,
  technicianId: string
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      technician: true,
      client: { select: { id: true, name: true } },
      services: {
        include: { service: true },
      },
    },
  });

  if (!ticket) throw new AppError("Chamado não encontrado", 404);

  if (ticket.technicianId !== technicianId)
    throw new AppError("Você não tem permissão para acessar este chamado", 403);

  const total = ticket.services.reduce((sum, s) => sum + s.service.price, 0);

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    client: ticket.client,
    services: ticket.services.map((ts) => ts.service),
    total,
  };
}

export async function updateTicketStatusService(
  technicianId: string,
  ticketId: string,
  status: "EM_ATENDIMENTO" | "ENCERRADO"
) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      technicianId,
    },
  });

  if (!ticket) {
    throw new AppError("Chamado não encontrado ou não atribuído a você", 404);
  }

  if (ticket.status === "ENCERRADO") {
    throw new AppError(
      "Chamado já está encerrado. Não é possível alterar o status.",
      400
    );
  }

  // (opcional) impedir transições inválidas
  if (ticket.status === "ABERTO" && status === "ENCERRADO") {
    throw new AppError(
      "Você precisa iniciar o atendimento antes de encerrá-lo.",
      400
    );
  }

  const updated = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  await prisma.ticketLog.create({
    data: {
      ticketId,
      previousStatus: ticket.status,
      newStatus: status,
      changedBy: technicianId,
    },
  });

  return updated;
}

export async function addServiceToTicketService(
  technicianId: string,
  ticketId: string,
  data: { name: string; price: number }
) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      technicianId,
      status: "EM_ATENDIMENTO",
    },
  });

  if (!ticket) {
    throw new AppError(
      "Chamado não encontrado ou não está em atendimento",
      404
    );
  }

  const newService = await prisma.service.create({
    data: {
      name: data.name,
      price: data.price,
    },
  });

  await prisma.ticketService.create({
    data: {
      ticketId,
      serviceId: newService.id,
    },
  });

  return {
    message: "Serviço adicional incluído com sucesso!",
    service: newService,
  };
}

export async function getTicketLogsService(
  technicianId: string,
  ticketId: string
) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      technicianId,
    },
  });

  if (!ticket) {
    throw new AppError("Chamado não encontrado ou não atribuído a você", 404);
  }

  const logs = await prisma.ticketLog.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      previousStatus: true,
      newStatus: true,
      changedBy: true,
      createdAt: true,
    },
  });

  return logs;
}
