import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const contentData = [
  {
    key: 'hero-title',
    type: 'HERO_TITLE',
    title: 'Hero Title',
    content: "Hello, I'm Ken. I'm a full-stack developer with 15 years of experience.",
    isPublished: true
  },
  {
    key: 'hero-subtitle',
    type: 'HERO_SUBTITLE', 
    title: 'Hero Subtitle',
    content: "I enjoy building sites & apps. My focus is React (Next.js).",
    isPublished: true
  },
  {
    key: 'hero-description',
    type: 'HERO_DESCRIPTION',
    title: 'Hero Description',
    content: "👋\nHello, I'm Ken. I'm a full-stack developer with 15 years of experience. I enjoy building sites & apps. My focus is React (Next.js).",
    isPublished: true
  },
  {
    key: 'microphone-title',
    type: 'MICROPHONE_TITLE',
    title: 'Voice Widget Title',
    content: "Talk to KenDev",
    isPublished: true
  },
  {
    key: 'microphone-description',
    type: 'MICROPHONE_DESCRIPTION',
    title: 'Voice Widget Description',
    content: "Click to start a voice conversation\nAsk about my projects, experience, or schedule a consultation",
    isPublished: true
  },
  {
    key: 'about-title',
    type: 'ABOUT_TITLE',
    title: 'About Section Title',
    content: "About me",
    isPublished: true
  },
  {
    key: 'about-content',
    type: 'ABOUT_CONTENT',
    title: 'About Section Content',
    content: `As a seasoned full stack developer and .NET expert with over 20 years of experience, I bring a rich blend of technical acumen and innovative thinking to the forefront of technology development. My journey spans designing, developing, and delivering complex business solutions, with a specialized focus on integrating cutting-edge AI technologies.

I am proficient in a diverse array of JavaScript frameworks, including NextJS, Vue 3, React, jQuery, AJAX, and Angular, and have deep expertise in .NET frameworks such as ASP.NET, VB.NET, C#, WPF, Web API, and Azure. My technical portfolio also extends to the DNN (DotNetNuke) platform, where I have built custom modules and enhancements, demonstrating my prowess in this domain.

My skills in generative AI technologies set me apart in the industry. I excel in writing personalized Chat GPT clients and agents, fine-tuning OpenAI and other open-source LLMs. My proficiency in using vector encodings for document search and crafting custom generative AI solutions is a testament to my ability to stay ahead in the tech curve.

With a strong background in database development, including Mongo, Atlas, Supabase, Firebase, SQL Server, T-SQL, and SQL Reporting, I bring a comprehensive skill set to the table. My experience in SOA and integration technologies, encompassing XML, Web Services, and BizTalk, further complements my technical expertise.

I am eager to leverage my extensive technical expertise, leadership skills, and innovative approach in a hands-on technology leadership role. I am excited to explore opportunities where I can drive innovation and deliver exceptional results for your organization. Let's connect and discuss how I can contribute to your team.`,
    isPublished: true
  },
  {
    key: 'projects-title',
    type: 'PROJECTS_TITLE',
    title: 'Projects Section Title',
    content: "My projects",
    isPublished: true
  },
  {
    key: 'skills-title',
    type: 'SKILLS_TITLE',
    title: 'Skills Section Title',
    content: "My skills",
    isPublished: true
  },
  {
    key: 'experience-title',
    type: 'EXPERIENCE_TITLE',
    title: 'Experience Section Title',
    content: "My experience",
    isPublished: true
  },
  {
    key: 'contact-title',
    type: 'CONTACT_TITLE',
    title: 'Contact Section Title',
    content: "Contact me",
    isPublished: true
  },
  {
    key: 'contact-description',
    type: 'CONTACT_DESCRIPTION',
    title: 'Contact Section Description',
    content: "Please contact me directly at kenneth.courtney@gmail.com or through this form.",
    isPublished: true
  },
  {
    key: 'contact-email',
    type: 'CONTACT_EMAIL',
    title: 'Contact Email',
    content: "kenneth.courtney@gmail.com",
    isPublished: true
  },
  {
    key: 'footer-text',
    type: 'FOOTER_TEXT',
    title: 'Footer Text',
    content: "© 2030 Ken. All rights reserved.\nAbout this website: built with React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Framer Motion, React Email & Resend, Vercel hosting.",
    isPublished: true
  },
  {
    key: 'navigation-cta',
    type: 'NAVIGATION_CTA',
    title: 'Navigation Call-to-Action',
    content: "Contact me here",
    isPublished: true
  }
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const member = await db.member.findFirst({
      where: {
        profile: {
          userId: userId
        },
        type: "ADMIN"
      }
    });

    if (!member) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const results = [];

    for (const content of contentData) {
      try {
        // Use upsert to avoid duplicates
        const result = await db.content.upsert({
          where: { key: content.key },
          update: {
            type: content.type as any,
            title: content.title,
            content: content.content,
            isPublished: content.isPublished
          },
          create: {
            key: content.key,
            type: content.type as any,
            title: content.title,
            content: content.content,
            isPublished: content.isPublished
          }
        });
        results.push({ key: content.key, status: 'success' });
      } catch (error) {
        console.error(`Error seeding content "${content.key}":`, error);
        results.push({ key: content.key, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return NextResponse.json({ 
      message: "Content seeding completed",
      results: results,
      totalSeeded: results.filter(r => r.status === 'success').length,
      totalErrors: results.filter(r => r.status === 'error').length
    });

  } catch (error) {
    console.error("[CONTENT_SEED]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 