import { Request, Response } from "express";
import {
  deleteUserAccount,
  getUserProfile,
  updateUserProfile,
} from "@/services/users/user.service";
import { updateProfileSchema } from "@/schemas/user.schema";

export async function getProfileController(req: Request, res: Response) {
  const user = await getUserProfile(req.user!.id);

  return res.status(200).json({
    message: "Perfil carregado com sucesso!",
    user,
  });
}

export async function updateProfileController(req: Request, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const updated = await updateUserProfile(req.user!.id, parsed.data);

  return res.status(200).json({
    message: "Perfil atualizado com sucesso",
    user: updated,
  });
}
export async function deleteProfileController(req: Request, res: Response) {
  const result = await deleteUserAccount(req.user!.id);

  return res.status(200).json(result);
}
