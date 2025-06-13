import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import {
  addServiceToTicketController,
  getTechnicianTicketsController,
  getTicketDetailsByTechnicianController,
  getTicketLogsController,
  updateTicketStatusController,
} from "@/controllers/tecnico/tecnico.controller";

const router = Router();

router.get(
  "/",
  ensureAuthenticated,
  ensureRole("tecnico"),
  getTechnicianTicketsController
);

router.get(
  "/:id",
  ensureAuthenticated,
  ensureRole("tecnico"),
  getTicketDetailsByTechnicianController
);

router.patch(
  "/:id/status",
  ensureAuthenticated,
  ensureRole("tecnico"),
  updateTicketStatusController
);

router.post(
  "/:id/servico",
  ensureAuthenticated,
  ensureRole("tecnico"),
  addServiceToTicketController
);

router.get(
  "/:id/logs",
  ensureAuthenticated,
  ensureRole("tecnico"),
  getTicketLogsController
);

export { router as ticketsTecnicoRoutes };
