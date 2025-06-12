import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  technicianId: z.string().uuid(),
  hourId: z.string().uuid(),
  services: z.array(z.string().uuid()).min(1),
});
