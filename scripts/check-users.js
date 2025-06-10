const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('📊 Current users in database:\n');
    
    const profiles = await prisma.profile.findMany({
      include: {
        members: true
      }
    });

    if (profiles.length === 0) {
      console.log('No users found in database.');
      return;
    }

    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. Profile:`);
      console.log(`   User ID: ${profile.userId}`);
      console.log(`   Name: ${profile.name}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Created: ${profile.createdAt}`);
      
      if (profile.members.length > 0) {
        profile.members.forEach((member, memberIndex) => {
          console.log(`   Member ${memberIndex + 1}:`);
          console.log(`     Role: ${member.type}`);
          console.log(`     Provider: ${member.provider}`);
        });
      } else {
        console.log('   No member record found');
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 