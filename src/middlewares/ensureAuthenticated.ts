import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@/utils/AppError";
import { Role } from "@prisma/client";

interface JwtPayload {
  id: string;
  role: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token não fornecido", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role as Role,
    };

    return next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
