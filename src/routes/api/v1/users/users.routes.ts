import { Router } from "express";
import {
  deleteProfileController,
  getProfileController,
  updateUserProfileController,
} from "@/controllers/users/user.controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

const routes = Router();

routes.get("/profile", ensureAuthenticated, getProfileController);
routes.put("/profile", ensureAuthenticated, updateUserProfileController);
routes.delete("/profile", ensureAuthenticated, deleteProfileController);

export { routes as usersRoutes };
