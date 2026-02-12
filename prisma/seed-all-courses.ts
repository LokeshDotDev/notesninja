import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding all course categories with sample data...');

  // Define course categories with their pricing
  const courseCategories = [
    {
      name: 'MBA',
      slug: 'mba',
      price: 3999,
      compareAtPrice: 5999,
      subcategories: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
    },
    {
      name: 'BBA',
      slug: 'bba', 
      price: 3999,
      compareAtPrice: 5999,
      subcategories: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
    },
    {
      name: 'MCA',
      slug: 'mca',
      price: 3999,
      compareAtPrice: 5999,
      subcategories: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
    },
    {
      name: 'BCA',
      slug: 'bca',
      price: 3999,
      compareAtPrice: 5999,
      subcategories: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
    },
    {
      name: 'MA Economics',
      slug: 'maeco',
      price: 3999,
      compareAtPrice: 5999,
      subcategories: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
    },
    {
      name: 'MAJMC',
      slug: 'majmc',
      price: 3999,
      compareAtPrice: 5999,
      subcategories: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
    }
  ];

  // Sample post templates for different course types
  const postTemplates = {
    mba: [
      {
        title: 'Business Strategy & Leadership',
        description: 'Comprehensive notes on strategic management, leadership theories, and organizational behavior.'
      },
      {
        title: 'Financial Management & Accounting',
        description: 'Detailed study materials on financial analysis, budgeting, and managerial accounting.'
      },
      {
        title: 'Marketing Management & Research',
        description: 'Complete guide to marketing principles, consumer behavior, and market research techniques.'
      },
      {
        title: 'Operations & Supply Chain Management',
        description: 'In-depth coverage of operations management, logistics, and supply chain optimization.'
      },
      {
        title: 'Human Resource Management',
        description: 'Essential HR concepts, recruitment strategies, and organizational development theories.'
      }
    ],
    bba: [
      {
        title: 'Business Mathematics Mock Papers',
        description: 'Comprehensive collection of mock papers for Business Mathematics examination preparation.'
      },
      {
        title: 'Financial Accounting Assignments',
        description: 'Complete set of assignments covering all topics in Financial Accounting.'
      },
      {
        title: 'Business Law Study Materials',
        description: 'Detailed notes and case studies for Business Law course.'
      },
      {
        title: 'Economics Project Reports',
        description: 'Sample project reports and presentations for Economics.'
      },
      {
        title: 'Marketing Management Case Studies',
        description: 'Real-world case studies for Marketing Management course.'
      }
    ],
    mca: [
      {
        title: 'Data Structures & Algorithms',
        description: 'Complete implementation and explanation of data structures with algorithm analysis.'
      },
      {
        title: 'Database Management Systems',
        description: 'Comprehensive notes on SQL, database design, and management systems.'
      },
      {
        title: 'Software Engineering & Project Management',
        description: 'Software development lifecycle, testing methodologies, and project management.'
      },
      {
        title: 'Web Development Technologies',
        description: 'Full-stack web development notes covering frontend and backend technologies.'
      },
      {
        title: 'Computer Networks & Security',
        description: 'Network protocols, security measures, and system administration concepts.'
      }
    ],
    bca: [
      {
        title: 'Programming Fundamentals with C',
        description: 'Basic to advanced programming concepts with practical examples and exercises.'
      },
      {
        title: 'Digital Logic & Computer Architecture',
        description: 'Fundamental concepts of digital circuits and computer organization.'
      },
      {
        title: 'Operating Systems Concepts',
        description: 'Process management, memory allocation, and OS architecture fundamentals.'
      },
      {
        title: 'Object Oriented Programming with Java',
        description: 'Complete OOP concepts, Java programming, and practical implementations.'
      },
      {
        title: 'Web Technologies & Internet',
        description: 'HTML, CSS, JavaScript, and modern web development frameworks.'
      }
    ],
    maeco: [
      {
        title: 'Microeconomic Theory & Applications',
        description: 'Advanced microeconomic concepts, market analysis, and consumer theory.'
      },
      {
        title: 'Macroeconomic Policy & Analysis',
        description: 'National income, fiscal policy, monetary policy, and economic growth theories.'
      },
      {
        title: 'Econometrics & Statistical Methods',
        description: 'Statistical analysis, regression models, and economic data interpretation.'
      },
      {
        title: 'International Economics & Trade',
        description: 'Global trade theories, exchange rates, and international economic policies.'
      },
      {
        title: 'Development Economics',
        description: 'Economic growth strategies, poverty analysis, and development policies.'
      }
    ],
    majmc: [
      {
        title: 'Journalism Principles & Practices',
        description: 'Fundamental journalism concepts, news writing, and reporting techniques.'
      },
      {
        title: 'Mass Communication Theories',
        description: 'Communication models, media effects, and audience analysis theories.'
      },
      {
        title: 'Digital Media & Content Creation',
        description: 'Social media strategies, content creation, and digital marketing techniques.'
      },
      {
        title: 'Media Ethics & Laws',
        description: 'Ethical guidelines, media laws, and regulatory frameworks for journalism.'
      },
      {
        title: 'Advertising & Public Relations',
        description: 'Campaign planning, brand management, and corporate communication strategies.'
      }
    ]
  };

  for (const category of courseCategories) {
    console.log(`\n📚 Processing ${category.name} category...`);

    // Create or find category
    let categoryRecord = await prisma.category.findFirst({
      where: {
        slug: category.slug,
        parentId: null,
      },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
        },
      });
      console.log(`✅ Created ${category.name} category`);
    } else {
      console.log(`✅ Found existing ${category.name} category`);
    }

    // Create subcategories
    const createdSubcategories = [];
    for (const subcategoryName of category.subcategories) {
      const existingSubcategory = await prisma.subcategory.findFirst({
        where: {
          name: subcategoryName,
          categoryId: categoryRecord.id,
        },
      });

      let subcategory;
      if (existingSubcategory) {
        subcategory = existingSubcategory;
      } else {
        subcategory = await prisma.subcategory.create({
          data: {
            name: subcategoryName,
            categoryId: categoryRecord.id,
          },
        });
      }
      createdSubcategories.push(subcategory);
    }

    // Create sample posts
    const templates = postTemplates[category.slug as keyof typeof postTemplates] || postTemplates.bba;
    
    for (const subcategory of createdSubcategories) {
      for (const template of templates) {
        // Check if post already exists
        const existingPost = await prisma.post.findFirst({
          where: {
            title: `${template.title} - ${subcategory.name}`,
            categoryId: categoryRecord.id,
            subcategoryId: subcategory.id,
          },
        });

        if (!existingPost) {
          await prisma.post.create({
            data: {
              title: `${template.title} - ${subcategory.name}`,
              description: `${template.description} This material is specifically designed for ${subcategory.name.toLowerCase()} students.`,
              categoryId: categoryRecord.id,
              subcategoryId: subcategory.id,
              price: category.price,
              compareAtPrice: category.compareAtPrice,
              isDigital: true,
            },
          });
          console.log(`  ✅ Created: "${template.title} - ${subcategory.name}"`);
        } else {
          console.log(`  ⏭️  Skipped existing: "${template.title} - ${subcategory.name}"`);
        }
      }
    }
  }

  console.log('\n🎉 All course categories seeded successfully with MRP pricing!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
