"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
        <div
          className="inline-block w-full text-justify"
        >      
      <p className="mb-3">

          Seasoned full stack developer and .NET expert with over 20 years of experience designing,
          developing, and delivering complex business solutions. Technical lead across the full 
          software project lifecycle, from planning and architecture to implementation and support.

      </p>

      <p>
        Proficient in JavaScript frameworks - NextJS, VUE 3, React, jQuery, AJAX, Angular.
         Skilled in .NET frameworks - ASP.NET, VB.NET, C#, WPF, Web API, Windows Services, Azure. 
         Expert in DNN (DotNetNuke) platform with experience building custom modules and enhancements. 
         Strong database development background including Mongo, Atlas, Supabase, FIrebase, SQL Server, 
         T-SQL, SQL Reporting. Knowledgeable in SOA and integration technologies - XML, Web Services, 
         BizTalk. Successful track record technical leadership and team collaboration. 
         Direct experience guiding compliance, security, and regulatory initiatives. 
         Industry experience includes healthcare, education, financial services, and retail. 
         Most recently served as Lead Developer for 35 DNN websites supporting healthcare applications. 
         Upgraded 20 sites from DNN 8 to DNN 9 while migrating to new infrastructure. 
         Built and maintained 50+ custom DNN modules and apps using MVC and Vue.js. Managed team of 4 developers.
      </p>

      <p>
        Led development of custom DNN solutions for 20+ organizations, serving as lead architect and 
        engineer. Designed CRM, order processing, and data integration systems using ASP.NET, C#, VB.NET, and 
        MS SQL Server. Managed software teams up to 10 developers and provided coaching and mentoring.
      </p>

      <p>
        Looking to leverage my deep technical expertise and leadership capabilities to take on new challenges as a hands-on technology leader. Let's connect to discuss current needs and how I can drive innovation and results for your organization.
      </p>
      </div>
    </motion.section>
  );
}
