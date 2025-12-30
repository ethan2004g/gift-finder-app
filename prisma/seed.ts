import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create some default tags
  const tags = [
    { name: 'Tech', category: 'Electronics', isSystemTag: true },
    { name: 'Fashion', category: 'Clothing', isSystemTag: true },
    { name: 'Books', category: 'Media', isSystemTag: true },
    { name: 'Sports', category: 'Outdoor', isSystemTag: true },
    { name: 'Gaming', category: 'Entertainment', isSystemTag: true },
    { name: 'Music', category: 'Entertainment', isSystemTag: true },
    { name: 'Art', category: 'Creative', isSystemTag: true },
    { name: 'Cooking', category: 'Home', isSystemTag: true },
    { name: 'Outdoor', category: 'Recreation', isSystemTag: true },
    { name: 'Beauty', category: 'Personal Care', isSystemTag: true },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  console.log('✅ Seeded default tags');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

