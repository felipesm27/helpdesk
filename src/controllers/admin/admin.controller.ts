import { Request, Response } from "express";
import {
  deleteUserByAdmin,
  listClientsService,
  listTechnicians,
  updateUserByAdmin,
} from "@/services/admin/admin.service";
import { AppError } from "@/utils/AppError";
import { updateUserByAdminSchema } from "@/schemas/admin.schema";

export async function listClientsController(req: Request, res: Response) {
  const clients = await listClientsService();
  return res.status(200).json({ clients });
}

export async function listTechniciansController(req: Request, res: Response) {
  const technicians = await listTechnicians();

  return res.status(200).json({ technicians });
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

// export async function deleteUserByAdminController(req: Request, res: Response) {
//   const userId = req.params.id;

//   const result = await deleteUserByAdmin(userId);

//   return res.status(200).json(result);
// }

export async function deleteUserByAdminController(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    const result = await deleteUserByAdmin(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
