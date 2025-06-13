import { Router } from "express";
import {
  deleteProfileController,
  getProfileController,
  updateUserProfileController,
} from "@/controllers/users/user.controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

const router = Router();

router.get("/profile", ensureAuthenticated, getProfileController);
router.put("/profile", ensureAuthenticated, updateUserProfileController);
router.delete("/profile", ensureAuthenticated, deleteProfileController);

export { router as usersRoutes };
