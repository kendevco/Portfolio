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
        <div className="inline-block w-full text-justify">
          <p className="mb-3">
            As a seasoned full stack developer and .NET expert with over 20 years of experience, 
            I bring a rich blend of technical acumen and innovative thinking to the forefront of 
            technology development. My journey spans designing, developing, and delivering complex 
            business solutions, with a specialized focus on integrating cutting-edge AI technologies.
          </p>
          <p>
            I am proficient in a diverse array of JavaScript frameworks, including NextJS, Vue 3, React, 
            jQuery, AJAX, and Angular, and have deep expertise in .NET frameworks such as ASP.NET, VB.NET, 
            C#, WPF, Web API, and Azure. My technical portfolio also extends to the DNN (DotNetNuke) platform, 
            where I have built custom modules and enhancements, demonstrating my prowess in this domain.
          </p>
          <p>
            My skills in generative AI technologies set me apart in the industry. I excel in writing 
            personalized Chat GPT clients and agents, fine-tuning OpenAI and other open-source LLMs. 
            My proficiency in using vector encodings for document search and crafting custom generative 
            AI solutions is a testament to my ability to stay ahead in the tech curve.
          </p>
          <p>
            With a strong background in database development, including Mongo, Atlas, Supabase, Firebase, 
            SQL Server, T-SQL, and SQL Reporting, I bring a comprehensive skill set to the table. My 
            experience in SOA and integration technologies, encompassing XML, Web Services, and BizTalk, 
            further complements my technical expertise.
          </p>
          <p>
            I am eager to leverage my extensive technical expertise, leadership skills, and innovative 
            approach in a hands-on technology leadership role. I am excited to explore opportunities 
            where I can drive innovation and deliver exceptional results for your organization. 
            Let's connect and discuss how I can contribute to your team.
          </p>
        </div>
    </motion.section>
  );
}
