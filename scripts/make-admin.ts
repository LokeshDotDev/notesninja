import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const email = 'purohitlokesh46@gmail.com';
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    
    console.log('✅ User updated successfully!');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('\n🎉 You are now an ADMIN! Please log out and log back in.');
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
