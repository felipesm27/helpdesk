import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { Role } from "@prisma/client"; // 👈 forma mais segura

export function ensureRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError("Acesso não autorizado", 403);
    }

    return next();
  };
}
