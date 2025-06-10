const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin(userId) {
  try {
    console.log(`Setting user ${userId} as admin...`);
    
    // Find or create profile
    let profile = await prisma.profile.findFirst({
      where: { userId },
      include: { members: true }
    });

    if (!profile) {
      console.log('Creating profile...');
      profile = await prisma.profile.create({
        data: {
          userId,
          name: "Admin User",
          email: "admin@example.com"
        },
        include: { members: true }
      });
    }

    // Create or update member record to ADMIN
    if (profile.members.length > 0) {
      console.log('Updating existing member to ADMIN...');
      await prisma.member.update({
        where: { id: profile.members[0].id },
        data: { type: "ADMIN" }
      });
    } else {
      console.log('Creating new ADMIN member...');
      await prisma.member.create({
        data: {
          profileId: profile.id,
          type: "ADMIN",
          provider: "clerk",
          providerAccountId: userId
        }
      });
    }

    console.log(`✅ Successfully set user ${userId} as admin!`);
    console.log(`Profile ID: ${profile.id}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get userId from command line argument
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: node scripts/make-admin.js <clerk-user-id>');
  console.log('Example: node scripts/make-admin.js user_2abc123def456');
  process.exit(1);
}

makeAdmin(userId); 