import { PrismaClient } from '@prisma/client';
import { projectsData } from '@/lib/data';

const prisma = new PrismaClient();

async function seedProjects() {
  console.log('🌱 Seeding projects...');

  try {
    // Clear existing projects
    await prisma.project.deleteMany({});
    console.log('🗑️ Cleared existing projects');

    // Add projects from sample data
    const projects = await Promise.all(
      projectsData.map(async (projectData) => {
        return prisma.project.create({
          data: {
            title: projectData.title,
            description: projectData.description,
            tags: [...projectData.tags], // Convert readonly array to mutable array
            imageUrl: typeof projectData.imageUrl === 'string' ? projectData.imageUrl : projectData.imageUrl.src, // Handle both string and StaticImageData
          },
        });
      })
    );

    console.log(`✅ Created ${projects.length} projects successfully!`);
    
    projects.forEach((project) => {
      console.log(`  - ${project.title}`);
    });

  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedProjects();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 