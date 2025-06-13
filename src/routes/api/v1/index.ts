import { Router } from "express";
import { usersRoutes } from "./users/users.routes";
import { authRoutes } from "./auth/auth.routes";
import { ticketsClienteRoutes } from "./cliente/cliente.routes";
import { ticketsTecnicoRoutes } from "./tecnico/tecnico.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/tickets/cliente", ticketsClienteRoutes);
routes.use("/tickets/tecnico", ticketsTecnicoRoutes);

export { routes };
