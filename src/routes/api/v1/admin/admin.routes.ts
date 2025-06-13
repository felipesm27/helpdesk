import { Router } from "express";
import { usersAdminRoutes } from "./users.admin.routes";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureRole } from "@/middlewares/ensureRole";
import { updateUserByAdminController } from "@/controllers/admin/admin.controller";

const routes = Router();

routes.use("/users", usersAdminRoutes);

routes.put(
  "/users/:id",
  ensureAuthenticated,
  ensureRole("admin"),
  updateUserByAdminController
);

export { routes as adminRoutes };
