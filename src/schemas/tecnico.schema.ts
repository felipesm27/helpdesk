import { z } from "zod";
import { TicketStatus } from "@prisma/client";

export const updateTicketStatusSchema = z.object({
  status: z.enum([TicketStatus.EM_ATENDIMENTO, TicketStatus.ENCERRADO]),
});

export const addServiceToTicketSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
});
