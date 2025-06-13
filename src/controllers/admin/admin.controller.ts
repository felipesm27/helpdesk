import { Request, Response } from "express";
import {
  createService,
  deleteUserByAdmin,
  disableService,
  listClientsService,
  listServices,
  listTechnicians,
  reactivateService,
  updateService,
  updateUserByAdmin,
} from "@/services/admin/admin.service";
import { AppError } from "@/utils/AppError";
import {
  createServiceSchema,
  updateServiceSchema,
  updateUserByAdminSchema,
} from "@/schemas/admin.schema";

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

export async function deleteUserByAdminController(req: Request, res: Response) {
  const userId = req.params.id;

  const result = await deleteUserByAdmin(userId);

  return res.status(200).json(result);
}

export async function createServiceController(req: Request, res: Response) {
  const parsed = createServiceSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Dados inválidos", 400);
  }

  const service = await createService(parsed.data);

  return res.status(201).json({
    message: "Serviço criado com sucesso!",
    service,
  });
}

export async function updateServiceController(req: Request, res: Response) {
  const serviceId = req.params.id;

  const parsed = updateServiceSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Dados inválidos", 400);
  }

  const updated = await updateService(serviceId, parsed.data);

  return res.status(200).json({
    message: "Serviço atualizado com sucesso!",
    service: updated,
  });
}

export async function listServicesController(req: Request, res: Response) {
  const services = await listServices();

  return res.status(200).json({ services });
}

export async function disableServiceController(req: Request, res: Response) {
  const serviceId = req.params.id;

  const service = await disableService(serviceId);

  return res.status(200).json({
    message: "Serviço desativado com sucesso!",
    service,
  });
}

// export async function reactivateServiceController(req: Request, res: Response) {
//   const serviceId = req.params.id;

//   const service = await reactivateService(serviceId);

//   return res.status(200).json({
//     message: "Serviço reativado com sucesso!",
//     service,
//   });
// }

export async function reactivateServiceController(req: Request, res: Response) {
  const serviceId = req.params.id;

  try {
    const service = await reactivateService(serviceId);

    return res.status(200).json({
      message: "Serviço reativado com sucesso!",
      service,
    });
  } catch (error) {
    console.error("Erro ao reativar serviço:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
