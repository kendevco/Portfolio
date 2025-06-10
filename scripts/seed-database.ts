import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extract the raw data without React components or image imports
const experiencesData = [
  {
    title: "DNN Subject Matter Expert",
    location: "Remote",
    description: "Led technical management and maintenance for 35 standalone DNN websites hosting 50+ custom healthcare web apps, demanding expertise in DNN/MVC frameworks. Orchestrated upgrade of 20 sites from DNN 8 to 9, migrating to Windows Server 2019. Demonstrated leadership in complex migrations.",
    icon: "FaReact",
    date: "Mar 2021 - Present", 
  },
  {
    title: "Independent Developer",
    location: "Tampa, FL",
    description: "Supported and maintained custom DNN modules including document management system, gallery module, store module developed for Advantage International and rebranded to KenDev.Co.",
    icon: "FaDotCircle",
    date: "May 2015 - Apr 2021",
  },
  {
    title: "Senior .NET Consultant",
    location: "Tampa, FL",
    description: "Integrated two separate DNN websites operating on different versions, upgraded both sites to latest version 4.9.2. Upgraded commercial Portal Store module. Combined 10,000+ user accounts from sites into new consolidated site.",
    icon: "FaDatabase",
    date: "Feb 2009 - May 2015",
  }, 
  {
    title: "DotNetNuke Architect",
    location: "Tampa, FL",
    description: "Architected social networking site on DNN and .NET 3.5 for tracking favorite sports teams and fantasy leagues. Developed custom DNN modules for forums, messaging, surveys, analytics. Integrated sports stats feed.", 
    icon: "FaDatabase",
    date: "Sep 2008 - Nov 2008",
  },
  {
    title: "Internal Systems Architect", 
    location: "Tampa, FL",
    description: "Enhanced LOB ERP system used by 500+ sales reps to add order return capabilities, streamlining process. Led major CRM integration project to create 360 customer view across 10 core business systems.",
    icon: "FaDatabase", 
    date: "Jun 2006 - Oct 2008",
  },
  {
    title: "Senior .NET Developer",
    location: "Tampa, FL",
    description: "Developed 'pluggable' WinForms apps using .NET for project management system. Created Windows Services framework for batch processing and message queueing. Published work on Mainframe report processing tool.",
    icon: "FaDatabase",
    date: "Feb 2006 - Jun 2006", 
  },
  {
    title: "Senior .NET Developer",
    location: "Tampa, FL",
    description: "Developed SOA integrations using ASP.NET Web Services and XML transformations on proprietary middleware platform.",
    icon: "FaDatabase",
    date: "Nov 2005 - Feb 2006",
  },
  {
    title: "Senior .NET Developer",
    location: "Tampa, FL", 
    description: "Developed and maintained N-Tier OLTP student information system managing 100,000+ students. Technical lead for student administration system. Integrated with SAP accounting system.",
    icon: "FaDatabase",
    date: "Jan 2004 - Nov 2005",
  },
  {
    title: "Mortgage Software Engineer",
    location: "Tampa, FL",
    description: "Member of team focused on N-Tier enterprise mortgage underwriting analysis app. Provided analysis to transform business rules into coded solutions. Authored technical documentation.",
    icon: "FaDatabase",
    date: "Mar 2001 - Jan 2003", 
  },
  {
    title: "Software Developer",
    location: "St Petersburg, FL",
    description: "Designed and developed solutions utilizing VB, ASP, COM+, SQL Server. Integrated ecommerce sites with payment systems. Implemented order fulfillment, inventory management, and data synchronization.",
    icon: "FaDatabase",
    date: "Jan 2000 - Jan 2001",
  }, 
  {
    title: "Navy Machinist's Mate", 
    location: "United States",
    description: "Operated, maintained, and tested components on nuclear submarine. Qualified for all watchstations of Naval Nuclear Propulsion Plant. Assisted in submarine decommissioning.", 
    icon: "FaAnchor",
    date: "Jan 1991 - Oct 1994", 
  },
];

const projectsData = [
  {
    title: "Discordant",
    description: "Full featured Discord clone with 1-1 voice and video calling, Clerk authentication, Upload Thing file repository, and more.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Redux"],
    imageUrl: "/images/discordant.png",
    href: "https://discordant.kendev.co/",
  },
  {
    title: "Next LMS",
    description: "Next LMS is a powerful and flexible learning management system with user management, dark mode, error handling for video upload, and a variety of other features by Code with Antonio.",
    tags: ["React", "Next.js", "MongoDB", "Tailwind", "Prisma"],
    imageUrl: "/images/NextLMS.png",
    href: "https://lms.kendev.co",
  },
  {
    title: "Notion Clone",
    description: "A personal clone of Notion, plus enhancements for personal use by Code with Antonio.",
    tags: ["React", "Next.js", "Mongo", "Tailwind", "Prisma"],
    imageUrl: "/images/jotion.png",
    href: "https://notes.kendev.co/",
  },
  {
    title: "Next Commerce",
    description: "A fullstack commerce solution with separate admin dashboard by Code with Antonio.",
    tags: ["React", "Next.js", "Mongo", "Tailwind", "Prisma"],
    imageUrl: "/images/commerce.png",
    href: "https://next-commerce-store.kendev.co/",
  },
];

const skillsData = [
  // Web Development
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "React.js", "Node.js", "Next.js", "Vue.js", 
  "Web Design", "Responsive Web Design", "Cascading Style Sheets (CSS)",
  // Backend Development
  "ASP.NET", "ASP.NET MVC", "Python", "Django", "SQL", "PL/SQL", "Prisma", "App.Write", "GraphQL", 
  "PostgreSQL", "MongoDB", "Databases", "ADO.NET",
  // DevOps
  "Git", "Windows Server", "Windows Server Administration", "Internet Information Services (IIS)", 
  "Microsoft SQL Server",
  // .NET Framework
  "C#", ".NET Framework", "Microsoft Visual Studio.NET", "Visual Studio Code", "Visual Basic", 
  "DotNetNuke (DNN)",
  // Project Management
  "Scrum", "Microsoft Project", "Visio", "Documentation",
  // Debugging and Performance
  "Debugging", "Dynatrace",
  // UI/UX
  "Framer Motion", "Tailwind", "Redux",
  // Version Control
  "Microsoft Visual Source Safe",
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.project.deleteMany({});
    await prisma.experience.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed experiences
    console.log('📝 Seeding experiences...');
    const experiences = await Promise.all(
      experiencesData.map(async (exp) => {
        return prisma.experience.create({
          data: {
            title: exp.title,
            location: exp.location,
            description: exp.description,
            icon: exp.icon,
            date: exp.date,
          },
        });
      })
    );
    console.log(`✅ Created ${experiences.length} experiences`);

    // Seed projects
    console.log('🚀 Seeding projects...');
    const projects = await Promise.all(
      projectsData.map(async (project) => {
        return prisma.project.create({
          data: {
            title: project.title,
            description: project.description,
            tags: project.tags,
            imageUrl: project.imageUrl,
          },
        });
      })
    );
    console.log(`✅ Created ${projects.length} projects`);

    // Create a sample skill record (if you have a skills table)
    // For now, skills are just used in the frontend directly

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${experiences.length} experiences`);
    console.log(`   - ${projects.length} projects`);
    console.log(`   - ${skillsData.length} skills available`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 