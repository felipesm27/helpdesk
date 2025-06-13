import { Router } from "express";
import { usersAdminRoutes } from "./users.admin.routes";

const routes = Router();

routes.use("/users", usersAdminRoutes);

export { routes as adminRoutes };
