const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndCreateAdmin() {
  try {
    // Check if any admin users exist
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      }
    });

    console.log('Found admin users:', adminUsers.length);

    if (adminUsers.length === 0) {
      console.log('No admin users found. Creating default admin...');
      
      // Create a default admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@notesninja.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN'
        }
      });

      console.log('Created admin user:', admin.email);
      console.log('Login credentials:');
      console.log('Email: admin@notesninja.com');
      console.log('Password: admin123');
    } else {
      console.log('Existing admin users:');
      adminUsers.forEach(user => {
        console.log(`- ${user.email} (${user.name || 'No name'})`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateAdmin();
