import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import {
  createScheduleController,
  createServiceController,
  deleteScheduleController,
  deleteUserByAdminController,
  disableServiceController,
  listClientsController,
  listSchedulesController,
  listServicesController,
  listTechniciansController,
  reactivateScheduleController,
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
routes.get("/schedules", listSchedulesController);
routes.post("/schedules", createScheduleController);
routes.delete("/schedules/:id", deleteScheduleController);
routes.patch("/schedules/:id/activate", reactivateScheduleController);

export { routes as adminRoutes };
