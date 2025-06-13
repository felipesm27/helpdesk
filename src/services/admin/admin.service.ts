import { prisma } from "@/lib/prisma";

export async function listClientsService() {
  return await prisma.user.findMany({
    where: { role: "cliente" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}
