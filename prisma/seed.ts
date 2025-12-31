import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample tags by category
const tagsByCategory = {
  interests: [
    'photography', 'cooking', 'gaming', 'reading', 'music', 'art', 'travel',
    'fitness', 'yoga', 'hiking', 'camping', 'fishing', 'gardening', 'crafts',
    'knitting', 'painting', 'drawing', 'writing', 'blogging', 'coding'
  ],
  tech: [
    'gadgets', 'smartphones', 'laptops', 'tablets', 'smart home', 'audio',
    'headphones', 'speakers', 'cameras', 'drones', 'gaming console', 'pc gaming',
    'accessories', 'wearables', 'vr', 'ai', 'software', 'apps'
  ],
  fashion: [
    'clothing', 'shoes', 'accessories', 'jewelry', 'watches', 'bags',
    'sunglasses', 'hats', 'scarves', 'belts', 'wallets', 'casual', 'formal',
    'sportswear', 'vintage', 'designer', 'streetwear', 'sustainable'
  ],
  home: [
    'decor', 'furniture', 'kitchen', 'bedding', 'lighting', 'organization',
    'plants', 'candles', 'artwork', 'rugs', 'pillows', 'storage', 'cleaning',
    'appliances', 'smart home', 'minimalist', 'rustic', 'modern'
  ],
  sports: [
    'running', 'cycling', 'swimming', 'basketball', 'football', 'soccer',
    'tennis', 'golf', 'baseball', 'hockey', 'skiing', 'snowboarding',
    'surfing', 'skateboarding', 'martial arts', 'boxing', 'gym', 'crossfit'
  ],
  food: [
    'gourmet', 'organic', 'vegan', 'vegetarian', 'coffee', 'tea', 'wine',
    'chocolate', 'snacks', 'baking', 'grilling', 'cocktails', 'spices',
    'international', 'healthy', 'comfort food', 'desserts', 'breakfast'
  ],
  beauty: [
    'skincare', 'makeup', 'haircare', 'fragrance', 'nails', 'spa', 'bath',
    'natural', 'organic', 'anti-aging', 'moisturizer', 'serum', 'masks',
    'tools', 'brushes', 'perfume', 'cologne', 'grooming'
  ],
  entertainment: [
    'movies', 'tv shows', 'streaming', 'board games', 'card games', 'puzzles',
    'books', 'audiobooks', 'comics', 'manga', 'concerts', 'theater',
    'comedy', 'podcasts', 'vinyl', 'collectibles', 'memorabilia'
  ],
  kids: [
    'toys', 'games', 'educational', 'creative', 'outdoor play', 'stuffed animals',
    'action figures', 'dolls', 'building blocks', 'puzzles', 'books',
    'art supplies', 'sports equipment', 'electronics', 'learning', 'stem'
  ],
  occasions: [
    'birthday', 'christmas', 'anniversary', 'wedding', 'graduation',
    'valentines', 'mothers day', 'fathers day', 'thank you', 'housewarming',
    'baby shower', 'retirement', 'promotion', 'get well', 'sympathy'
  ]
};

// Sample product templates
const productTemplates = [
  { prefix: 'Premium', suffix: 'Set' },
  { prefix: 'Professional', suffix: 'Kit' },
  { prefix: 'Deluxe', suffix: 'Collection' },
  { prefix: 'Ultimate', suffix: 'Bundle' },
  { prefix: 'Essential', suffix: 'Pack' },
  { prefix: 'Luxury', suffix: 'Gift Box' },
  { prefix: 'Complete', suffix: 'System' },
  { prefix: 'Advanced', suffix: 'Tool' },
  { prefix: 'Classic', suffix: 'Edition' },
  { prefix: 'Modern', suffix: 'Design' },
];

function generateProductTitle(tag: string): string {
  const template = productTemplates[Math.floor(Math.random() * productTemplates.length)];
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  return `${template.prefix} ${capitalize(tag)} ${template.suffix}`;
}

function generatePrice(): number {
  const prices = [9.99, 14.99, 19.99, 24.99, 29.99, 39.99, 49.99, 59.99, 79.99, 99.99, 149.99, 199.99, 299.99];
  return prices[Math.floor(Math.random() * prices.length)];
}

function generateImageUrl(seed: string): string {
  // Using placeholder image service
  return `https://picsum.photos/seed/${seed}/400/400`;
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create tags
  console.log('Creating tags...');
  const createdTags: Record<string, any[]> = {};
  
  for (const [category, tags] of Object.entries(tagsByCategory)) {
    createdTags[category] = [];
    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: {
          name: tagName,
          category,
          isSystemTag: true,
          usageCount: 0,
        },
      });
      createdTags[category].push(tag);
    }
  }

  const totalTags = Object.values(createdTags).flat().length;
  console.log(`✅ Created ${totalTags} tags\n`);

  // Create sample products
  console.log('Creating sample products...');
  const allTags = Object.values(createdTags).flat();
  const productsToCreate = 1000;
  let productsCreated = 0;

  for (let i = 0; i < productsToCreate; i++) {
    // Pick 2-5 random tags for this product
    const numTags = Math.floor(Math.random() * 4) + 2;
    const productTags = [];
    const usedIndices = new Set();
    
    while (productTags.length < numTags) {
      const randomIndex = Math.floor(Math.random() * allTags.length);
      if (!usedIndices.has(randomIndex)) {
        productTags.push(allTags[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    // Use first tag as main theme for product title
    const mainTag = productTags[0];
    const title = generateProductTitle(mainTag.name);
    const price = generatePrice();
    const productId = `seed-product-${i}`;
    
    try {
      // Create product
      const product = await prisma.product.create({
        data: {
          externalId: productId,
          source: 'sample',
          title,
          description: `A high-quality ${mainTag.name} product perfect for enthusiasts and beginners alike.`,
          price,
          currency: 'USD',
          imageUrl: generateImageUrl(productId),
          productUrl: `https://example.com/product/${productId}`,
          rating: Math.random() * 2 + 3, // 3.0 to 5.0
          reviewCount: Math.floor(Math.random() * 1000),
        },
      });

      // Assign tags to product
      for (const tag of productTags) {
        await prisma.productTag.create({
          data: {
            productId: product.id,
            tagId: tag.id,
          },
        });

        // Increment tag usage count
        await prisma.tag.update({
          where: { id: tag.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      productsCreated++;
      
      // Progress indicator
      if (productsCreated % 100 === 0) {
        console.log(`  Created ${productsCreated}/${productsToCreate} products...`);
      }
    } catch (error) {
      console.error(`Error creating product ${i}:`, error);
    }
  }

  console.log(`✅ Created ${productsCreated} products\n`);

  // Summary
  const tagCount = await prisma.tag.count();
  const productCount = await prisma.product.count();
  const productTagCount = await prisma.productTag.count();

  console.log('📊 Seed Summary:');
  console.log(`  • ${tagCount} tags across ${Object.keys(tagsByCategory).length} categories`);
  console.log(`  • ${productCount} products`);
  console.log(`  • ${productTagCount} product-tag associations`);
  console.log('\n✨ Database seeding complete!\n');

  console.log('💡 Try these pages:');
  console.log('  • http://localhost:3000/tags - Browse all tags');
  console.log('  • http://localhost:3000/tags/[tagId] - View products by tag');
  console.log('  • http://localhost:3000/saved - View sample products\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
