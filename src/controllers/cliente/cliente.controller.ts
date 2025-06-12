import { Request, Response } from "express";
import { createTicketSchema } from "@/schemas/tickets.schema";
import { createTicketService } from "@/services/cliente/cliente.service";

export async function createTicketController(req: Request, res: Response) {
  const parsed = createTicketSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await createTicketService(req.user!.id, parsed.data);

  return res.status(201).json({
    message: "Chamado criado com sucesso",
    ticket: result,
  });
}
