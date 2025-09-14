import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPasswordAdmin = await bcrypt.hash('Bukavu1234@', 12);
  const hashedPasswordManager = await bcrypt.hash('Bukavu1234@', 12);

  // Créer un utilisateur avec le rôle ADMIN
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@isp.com' },
    update: {},
    create: {
      email: 'admin@isp.com',
      password: hashedPasswordAdmin,
      name: 'FIDELE ISP BUKAVU',
      role: 'ADMIN',
    },
  });

  // Créer un utilisateur avec le rôle GESTIONNAIRE
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@isp.com' },
    update: {},
    create: {
      email: 'manager@isp.com',
      password: hashedPasswordManager,
      name: 'Manager User',
      role: 'GESTIONNAIRE',
      nomAgent: 'FIDELE',
      prenomAgent: 'Paul',
      service: 'Gestion des billets',
    },
  });

  console.log({ adminUser, managerUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });