const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteArticles() {
  try {
    const articles = ['hello', 'some', 'asdfasdf'];
    
    for (const slug of articles) {
      const deleted = await prisma.article.deleteMany({
        where: {
          slug: slug,
        },
      });
      
      console.log(`Deleted article "${slug}": ${deleted.count} record(s)`);
    }
    
    console.log('\n✅ All articles deleted successfully!');
  } catch (error) {
    console.error('Error deleting articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteArticles();
