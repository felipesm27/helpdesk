import { Router } from "express";
import { usersRoutes } from "./users/users.routes";
import { authRoutes } from "./auth/auth.routes";
import { ticketsClienteRoutes } from "./tickets/tickets.cliente.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/tickets/cliente", ticketsClienteRoutes);

export { routes };
