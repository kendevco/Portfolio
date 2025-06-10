import { PrismaClient } from '@prisma/client';
import { experiencesData } from '@/lib/data';

const prisma = new PrismaClient();

async function seedExperiences() {
  console.log('🌱 Seeding experiences...');

  try {
    // Clear existing experiences
    await prisma.experience.deleteMany({});
    console.log('🗑️ Cleared existing experiences');

    // Add experiences from sample data
    const experiences = await Promise.all(
      experiencesData.map(async (experienceData) => {
        return prisma.experience.create({
          data: {
            title: experienceData.title,
            location: experienceData.location,
            description: experienceData.description,
            icon: 'FaReact', // Default icon since data has React elements
            date: experienceData.date,
          },
        });
      })
    );

    console.log(`✅ Created ${experiences.length} experiences successfully!`);
    
    experiences.forEach((experience) => {
      console.log(`  - ${experience.title} at ${experience.location}`);
    });

  } catch (error) {
    console.error('❌ Error seeding experiences:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedExperiences();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 