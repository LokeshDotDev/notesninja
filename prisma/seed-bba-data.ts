import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BBA sample data...');

  // Create BBA category
  let bbaCategory = await prisma.category.findFirst({
    where: {
      slug: 'bba',
      parentId: null,
    },
  });

  if (!bbaCategory) {
    bbaCategory = await prisma.category.create({
      data: {
        name: 'BBA',
        slug: 'bba',
      },
    });
  }

  console.log('✅ Created BBA category:', bbaCategory.name);

  // Create BBA subcategories
  const subcategories = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
  ];

  const createdSubcategories = [];
  for (const subcategoryName of subcategories) {
    // Check if subcategory already exists
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: subcategoryName,
        categoryId: bbaCategory.id,
      },
    });

    let subcategory;
    if (existingSubcategory) {
      subcategory = existingSubcategory;
    } else {
      subcategory = await prisma.subcategory.create({
        data: {
          name: subcategoryName,
          categoryId: bbaCategory.id,
        },
      });
    }
    createdSubcategories.push(subcategory);
    console.log(`✅ ${existingSubcategory ? 'Found' : 'Created'} subcategory: ${subcategory.name}`);
  }

  // Create sample posts for each subcategory
  const samplePosts = [
    {
      title: 'Business Mathematics Mock Papers',
      description: 'Comprehensive collection of mock papers for Business Mathematics examination preparation.',
    },
    {
      title: 'Financial Accounting Assignments',
      description: 'Complete set of assignments covering all topics in Financial Accounting.',
    },
    {
      title: 'Business Law Study Materials',
      description: 'Detailed notes and case studies for Business Law course.',
    },
    {
      title: 'Economics Project Reports',
      description: 'Sample project reports and presentations for Economics.',
    },
    {
      title: 'Marketing Management Case Studies',
      description: 'Real-world case studies for Marketing Management course.',
    },
  ];

  for (let i = 0; i < createdSubcategories.length; i++) {
    const subcategory = createdSubcategories[i];
    
    for (let j = 0; j < samplePosts.length; j++) {
      const postData = samplePosts[j];
      await prisma.post.create({
        data: {
          title: `${postData.title} - ${subcategory.name}`,
          description: `${postData.description} This material is specifically designed for ${subcategory.name.toLowerCase()} students.`,
          categoryId: bbaCategory.id,
          subcategoryId: subcategory.id,
        },
      });
    }
    
    console.log(`✅ Created ${samplePosts.length} posts for ${subcategory.name}`);
  }

  console.log('🎉 BBA sample data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
