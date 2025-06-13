import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import {
  createTicketController,
  getClientTicketByIdController,
  getClientTicketsController,
} from "@/controllers/cliente/cliente.controller";

const router = Router();

router.post(
  "/",
  ensureAuthenticated,
  ensureRole("cliente"),
  createTicketController
);

router.get(
  "/",
  ensureAuthenticated,
  ensureRole("cliente"),
  getClientTicketsController
);

router.get(
  "/:id",
  ensureAuthenticated,
  ensureRole("cliente"),
  getClientTicketByIdController
);

export { router as ticketsClienteRoutes };
