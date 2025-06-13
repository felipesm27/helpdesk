import { Request, Response } from "express";
import { listClientsService } from "@/services/admin/admin.service";

export async function listClientsController(req: Request, res: Response) {
  const clients = await listClientsService();
  return res.status(200).json({ clients });
}
