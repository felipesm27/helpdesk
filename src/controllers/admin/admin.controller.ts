import { Request, Response } from "express";
import {
  listClientsService,
  updateUserByAdmin,
} from "@/services/admin/admin.service";
import { AppError } from "@/utils/AppError";
import { updateUserByAdminSchema } from "@/schemas/admin.schema";

export async function listClientsController(req: Request, res: Response) {
  const clients = await listClientsService();
  return res.status(200).json({ clients });
}

export async function updateUserByAdminController(req: Request, res: Response) {
  const userId = req.params.id;

  const parsed = updateUserByAdminSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Dados inválidos", 400);
  }

  const user = await updateUserByAdmin(userId, parsed.data);

  return res.status(200).json({
    message: "Usuário atualizado com sucesso!",
    user,
  });
}
