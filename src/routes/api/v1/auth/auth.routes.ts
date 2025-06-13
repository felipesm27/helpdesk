import { Router } from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} from "@/controllers/auth/auth.controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/password", ensureAuthenticated, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export { router as authRoutes };
