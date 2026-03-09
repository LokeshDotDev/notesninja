const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMBASubjects() {
  try {
    console.log('🌱 Seeding MBA Sem 1 subjects...');

    // Find the MBA Sem 1 product (you may need to adjust this query)
    const mbaProduct = await prisma.post.findFirst({
      where: {
        OR: [
          { title: { contains: 'MBA', mode: 'insensitive' } },
          { title: { contains: 'mba', mode: 'insensitive' } },
          { slug: { contains: 'mba-sem-1', mode: 'insensitive' } }
        ]
      }
    });

    if (!mbaProduct) {
      console.log('❌ MBA Sem 1 product not found. Please check the product title/slug.');
      return;
    }

    console.log(`📚 Found MBA product: ${mbaProduct.title} (ID: ${mbaProduct.id})`);

    // Define MBA Sem 1 subjects
    const subjects = [
      {
        subjectId: 'full_bundle',
        name: 'Complete Bundle (All Subjects)',
        description: 'All 6 subjects included at best price',
        price: 3999,
        isBundle: true,
        sortOrder: 0,
      },
      {
        subjectId: 'business_communication',
        name: 'Business Communication',
        description: 'Effective business communication skills and strategies',
        price: 999,
        isBundle: false,
        sortOrder: 1,
      },
      {
        subjectId: 'financial_accounting',
        name: 'Financial and Management Accounting',
        description: 'Principles of financial and management accounting',
        price: 999,
        isBundle: false,
        sortOrder: 2,
      },
      {
        subjectId: 'human_resource',
        name: 'Human Resource Management',
        description: 'Comprehensive guide to HR management practices',
        price: 999,
        isBundle: false,
        sortOrder: 3,
      },
      {
        subjectId: 'management_process',
        name: 'Management Process and Organisational Behaviour',
        description: 'Understanding management processes and organizational behavior',
        price: 999,
        isBundle: false,
        sortOrder: 4,
      },
      {
        subjectId: 'managerial_economics',
        name: 'Managerial Economics',
        description: 'Economic principles for managerial decision making',
        price: 999,
        isBundle: false,
        sortOrder: 5,
      },
      {
        subjectId: 'statistics',
        name: 'Statistics for Management',
        description: 'Statistical methods and applications in management',
        price: 999,
        isBundle: false,
        sortOrder: 6,
      }
    ];

    // Clear existing subjects for this product
    await prisma.productSubject.deleteMany({
      where: { postId: mbaProduct.id }
    });

    console.log('🗑️ Cleared existing subjects for MBA product');

    // Add subjects to database
    for (const subject of subjects) {
      await prisma.productSubject.create({
        data: {
          postId: mbaProduct.id,
          ...subject
        }
      });
      console.log(`✅ Added subject: ${subject.name}`);
    }

    console.log('🎉 Successfully seeded MBA Sem 1 subjects!');
    console.log(`📊 Total subjects added: ${subjects.length}`);

  } catch (error) {
    console.error('❌ Error seeding MBA subjects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedMBASubjects();
