import { Request, Response } from "express";
import { createTicketSchema } from "@/schemas/tickets.schema";
import {
  createTicketService,
  getClientTicketByIdService,
  getClientTicketsService,
} from "@/services/cliente/cliente.service";

export async function createTicketController(req: Request, res: Response) {
  const parsed = createTicketSchema.safeParse(req.body);
  console.log(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await createTicketService(req.user!.id, parsed.data);

  return res.status(201).json({
    message: "Chamado criado com sucesso",
    ticket: result,
  });
}

export const getClientTicketsController = async (
  req: Request,
  res: Response
) => {
  const tickets = await getClientTicketsService(req.user!.id);

  return res.status(200).json({ tickets });
};

export const getClientTicketByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const ticket = await getClientTicketByIdService(req.user!.id, id);

  return res.status(200).json({ ticket });
};
