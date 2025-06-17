import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      { name: 'React Conference', location: 'Delhi', startTime: '2025-07-01T10:00:00Z' },
      { name: 'Node.js Meetup', location: 'Mumbai', startTime: '2025-07-10T18:00:00Z' },
      { name: 'GraphQL Summit', location: 'Bangalore', startTime: '2025-07-20T09:30:00Z' },
    ],
  });
}

main().finally(() => prisma.$disconnect());