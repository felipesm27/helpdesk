import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import { createTicketController } from "@/controllers/cliente/cliente.controller";

const router = Router();

router.post(
  "/",
  ensureAuthenticated,
  ensureRole("cliente"),
  createTicketController
);

export { router as ticketsClienteRoutes };
