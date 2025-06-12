import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  // Admins
  await prisma.user.createMany({
    data: [
      { name: "Admin 1", email: "admin1@mail.com", password, role: "admin" },
      { name: "Admin 2", email: "admin2@mail.com", password, role: "admin" },
      { name: "Admin 3", email: "admin3@mail.com", password, role: "admin" },
    ],
  });

  // Técnicos
  const tecnico1 = await prisma.user.create({
    data: {
      name: "Tecnico 1",
      email: "tecnico1@mail.com",
      password,
      role: "tecnico",
    },
  });

  const tecnico2 = await prisma.user.create({
    data: {
      name: "Tecnico 2",
      email: "tecnico2@mail.com",
      password,
      role: "tecnico",
    },
  });

  const tecnico3 = await prisma.user.create({
    data: {
      name: "Tecnico 3",
      email: "tecnico3@mail.com",
      password,
      role: "tecnico",
    },
  });

  // Clientes
  await prisma.user.createMany({
    data: [
      {
        name: "Cliente 1",
        email: "cliente1@mail.com",
        password,
        role: "cliente",
      },
      {
        name: "Cliente 2",
        email: "cliente2@mail.com",
        password,
        role: "cliente",
      },
      {
        name: "Cliente 3",
        email: "cliente3@mail.com",
        password,
        role: "cliente",
      },
    ],
  });

  // Horários para técnicos
  const scheduleHours = ["08:00", "10:00", "14:00"];
  const tecnicoIds = [tecnico1.id, tecnico2.id, tecnico3.id];

  for (let i = 0; i < tecnicoIds.length; i++) {
    for (const hour of scheduleHours) {
      await prisma.schedule.create({
        data: {
          hour,
          userId: tecnicoIds[i],
        },
      });
    }
  }

  // Serviços
  await prisma.service.createMany({
    data: [
      { name: "Instalação de Impressora", price: 120 },
      { name: "Formatação de PC", price: 150 },
      { name: "Troca de HD", price: 200 },
    ],
  });

  console.log("✅ Banco populado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao popular o banco:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
