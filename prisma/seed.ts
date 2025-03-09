import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding the database...');

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      username: 'sample_user',
      gamesPlayed: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    }
  });
  
  console.log(`Created sample user with ID: ${user.id}`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 