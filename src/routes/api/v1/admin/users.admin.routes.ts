import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import { listClientsController } from "@/controllers/admin/admin.controller";

const router = Router();

router.get(
  "/clientes",
  ensureAuthenticated,
  ensureRole("admin"),
  listClientsController
);

export { router as usersAdminRoutes };
