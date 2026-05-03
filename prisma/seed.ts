import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: { email: 'admin@taskflow.com', password: 'password123', name: 'Admin' },
  });

  const count = await prisma.project.count();
  if (count === 0) {
    await prisma.project.createMany({
      data: [
        { name: 'Site E-commerce', color: '#e74c3c' },
        { name: 'App Mobile', color: '#3498db' },
        { name: 'API Backend', color: '#2ecc71' },
      ],
    });
  }

  console.log('Seed terminé !');
}

main().catch(console.error).finally(() => prisma.$disconnect());