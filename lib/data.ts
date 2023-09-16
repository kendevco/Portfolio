import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaAnchor, FaDatabase, FaDotCircle, FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import discordantImg from "@/public/images/discordant.png";
import smartchatbotImg from "@/public/images/smart-chatbot-ui.png";
import quizmifyImg from "@/public/images/quizmify.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

/* export const experiencesData = [
  {
    title: "Graduated bootcamp",
    location: "Miami, FL",
    description:
      "I graduated after 6 months of studying. I immediately found a job as a front-end developer.",
    icon: React.createElement(LuGraduationCap),
    date: "2019",
  },
  {
    title: "Front-End Developer",
    location: "Orlando, FL",
    description:
      "I worked as a front-end developer for 2 years in 1 job and 1 year in another job. I also upskilled to the full stack.",
    icon: React.createElement(CgWorkAlt),
    date: "2019 - 2021",
  },
  {
    title: "Full-Stack Developer",
    location: "Houston, TX",
    description:
      "I'm now a full-stack developer working as a freelancer. My stack includes React, Next.js, TypeScript, Tailwind, Prisma and MongoDB. I'm open to full-time opportunities.",
    icon: React.createElement(FaReact),
    date: "2021 - present",
  },
] as const; */
export const experiencesData = [
  {
   title: "DNN Subject Matter Expert",
   location: "Remote",
   description: "Led technical management and maintenance for 35 standalone DNN websites hosting 50+ custom healthcare web apps, demanding expertise in DNN/MVC frameworks. Orchestrated upgrade of 20 sites from DNN 8 to 9, migrating to Windows Server 2019. Demonstrated leadership in complex migrations.",
   icon: React.createElement(FaReact),
   date: "Mar 2021 - Present", 
 },
 {
   title: "Independent Developer",
   location: "Tampa, FL",
   description: "Supported and maintained custom DNN modules including document management system, gallery module, store module developed for Advantage International and rebranded to KenDev.Co.",
   icon: React.createElement(FaDotCircle),
   date: "May 2015 - Apr 2021",
 },
 {
   title: "Senior .NET Consultant",
   location: "Tampa, FL",
   description: "Integrated two separate DNN websites operating on different versions, upgraded both sites to latest version 4.9.2. Upgraded commercial Portal Store module. Combined 10,000+ user accounts from sites into new consolidated site.",
   icon: React.createElement(FaDatabase),
   date: "Feb 2009 - May 2015",
 }, 
 {
    title: "DotNetNuke Architect",
    location: "Tampa, FL",
    description: "Architected social networking site on DNN and .NET 3.5 for tracking favorite sports teams and fantasy leagues. Developed custom DNN modules for forums, messaging, surveys, analytics. Integrated sports stats feed.", 
    icon: React.createElement(FaDatabase),
    date: "Sep 2008 - Nov 2008",
 },
 {
    title: "Internal Systems Architect", 
    location: "Tampa, FL",
    description: "Enhanced LOB ERP system used by 500+ sales reps to add order return capabilities, streamlining process. Led major CRM integration project to create 360 customer view across 10 core business systems.",
    icon: React.createElement(FaDatabase), 
    date: "Jun 2006 - Oct 2008",
 },

 {
  title: "Senior .NET Developer",
  location: "Tampa, FL",
  description: "Developed 'pluggable' WinForms apps using .NET for project management system. Created Windows Services framework for batch processing and message queueing. Published work on Mainframe report processing tool.",
  icon: React.createElement(FaDatabase),
  date: "Feb 2006 - Jun 2006", 
},
{
  title: "Senior .NET Developer",
  location: "Tampa, FL",
  description: "Developed SOA integrations using ASP.NET Web Services and XML transformations on proprietary middleware platform.",
  icon: React.createElement(FaDatabase),
  date: "Nov 2005 - Feb 2006",
},
{
  title: "Senior .NET Developer",
  location: "Tampa, FL", 
  description: "Developed and maintained N-Tier OLTP student information system managing 100,000+ students. Technical lead for student administration system. Integrated with SAP accounting system.",
  icon: React.createElement(FaDatabase),
  date: "Jan 2004 - Nov 2005",
},
{
  title: "Mortgage Software Engineer",
  location: "Tampa, FL",
  description: "Member of team focused on N-Tier enterprise mortgage underwriting analysis app. Provided analysis to transform business rules into coded solutions. Authored technical documentation.",
  icon: React.createElement(FaDatabase),
  date: "Mar 2001 - Jan 2003", 
},
{
  title: "Software Developer",
  location: "St Petersburg, FL",
  description: "Designed and developed solutions utilizing VB, ASP, COM+, SQL Server. Integrated ecommerce sites with payment systems. Implemented order fulfillment, inventory management, and data synchronization.",
  icon: React.createElement(FaDatabase),
  date: "Jan 2000 - Jan 2001",
}, 
{
  title: "Navy Machinist's Mate", 
  location: "United States",
  description: "Operated, maintained, and tested components on nuclear submarine. Qualified for all watchstations of Naval Nuclear Propulsion Plant. Assisted in submarine decommissioning.", 
  icon: React.createElement(FaAnchor),
  date: "Jan 1991 - Oct 1994", 
},
]

export const projectsData = [
  {
    title: "Discordant",
    description:
      "Full featured Discord clone with 1-1 voice and video calling, Clerk authentication, Upload Thing file repository, and more.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Redux"],
    imageUrl: discordantImg,
    href: "https://discordant.vercel.app/",
  },
  {
    title: "Chat GPT Clone + More",
    description:
      "A personal clone of Chat GPT plus enhancements.",
    tags: ["React", "Next.js", "Mongo", "Tailwind", "Prisma"],
    imageUrl: smartchatbotImg,
    href: "https://kendev-chatbot-ui.vercel.app/",
  },
  {
    title: "QuizmiFy - AI Powered Quiz App",
    description:
      "Quizmify App integrated into this for demonstration purposes.",
    tags: ["React", "Next.js", "MongoDB", "Tailwind", "Prisma"],
    imageUrl: quizmifyImg,
    href: "/quizmify",
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Apollo",
  "Express",
  "PostgreSQL",
  "Python",
  "Django",
  "Framer Motion",
  "Databases",
  "Windows Server",
  "HTML",
  "ASP.NET MVC",
  "ASP.NET",
  "JavaScript",
  "SQL",
  "React.js",
  "Web Design",
  "Scrum",
  "Responsive Web Design",
  "Documentation",
  "Debugging",
  "Cascading Style Sheets (CSS)",
  "DotNetNuke (DNN)",
  "Next.js",
  "Vue.js",
  "Dynatrace",
  "Internet Information Services (IIS)",
  "Microsoft SQL Server",
  ".NET Framework",
  "Microsoft Visual Studio.NET 2003",
  "VB 6.0",
  "ADO.NET",
  "Microsoft SQL Server 2000",
  "Microsoft Visual Source Safe",
  "Microsoft Project",
  "Visio",
  "Windows Server 2003 & IIS 6.0",
] as const;