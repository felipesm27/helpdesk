import { Request, Response } from "express";
import {
  addServiceToTicketService,
  getTechnicianTickets,
  getTicketDetailsByTechnician,
  getTicketLogsService,
  updateTicketStatusService,
} from "@/services/tecnico/tecnico.service";
import {
  addServiceToTicketSchema,
  updateTicketStatusSchema,
} from "@/schemas/tecnico.schema";

export async function getTechnicianTicketsController(
  req: Request,
  res: Response
) {
  const userId = req.user!.id;
  const tickets = await getTechnicianTickets(userId);

  return res.status(200).json({ tickets });
}

export async function getTicketDetailsByTechnicianController(
  req: Request,
  res: Response
) {
  const ticketId = req.params.id;
  const technicianId = req.user!.id;

  const ticket = await getTicketDetailsByTechnician(ticketId, technicianId);

  return res.status(200).json({ ticket });
}

export async function updateTicketStatusController(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  const technicianId = req.user!.id;
  const parsed = updateTicketStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const updated = await updateTicketStatusService(
    technicianId,
    id,
    parsed.data.status
  );

  return res.status(200).json({
    message: "Status atualizado com sucesso!",
    ticket: updated,
  });
}

export async function addServiceToTicketController(
  req: Request,
  res: Response
) {
  const technicianId = req.user!.id;
  const ticketId = req.params.id;

  const parsed = addServiceToTicketSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await addServiceToTicketService(
    technicianId,
    ticketId,
    parsed.data
  );

  return res.status(201).json(result);
}

export async function getTicketLogsController(req: Request, res: Response) {
  const technicianId = req.user!.id;
  const ticketId = req.params.id;

  const logs = await getTicketLogsService(technicianId, ticketId);

  return res.status(200).json({ logs });
}
