import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import {
  createServiceController,
  deleteUserByAdminController,
  disableServiceController,
  listClientsController,
  listServicesController,
  listTechniciansController,
  reactivateServiceController,
  updateServiceController,
  updateUserByAdminController,
} from "@/controllers/admin/admin.controller";

const routes = Router();

routes.use(ensureAuthenticated);
routes.use(ensureRole("admin"));

routes.get("/users/clientes", listClientsController);
routes.get("/users/tecnicos", listTechniciansController);
routes.put("/users/:id", updateUserByAdminController);
routes.delete("/users/:id", deleteUserByAdminController);
routes.get("/services", listServicesController);
routes.post("/services", createServiceController);
routes.put("/services/:id", updateServiceController);
routes.delete("/services/:id", disableServiceController);
routes.patch("/services/:id/activate", reactivateServiceController);

export { routes as adminRoutes };
