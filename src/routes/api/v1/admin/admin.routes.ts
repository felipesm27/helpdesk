import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import {
  deleteUserByAdminController,
  listClientsController,
  listTechniciansController,
  updateUserByAdminController,
} from "@/controllers/admin/admin.controller";

const routes = Router();

routes.use(ensureAuthenticated);
routes.use(ensureRole("admin"));

routes.get("/users/clientes", listClientsController);
routes.get("/users/tecnicos", listTechniciansController);
routes.put("/users/:id", updateUserByAdminController);
routes.delete("/users/:id", deleteUserByAdminController);

export { routes as adminRoutes };
