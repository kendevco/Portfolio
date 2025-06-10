"use client";

import React from "react";
import SectionHeading from "./section-heading";
import ContentBlock from "./content-block";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import SessionManager from "@/lib/session-manager";

export default function Contact() {
  const { ref } = useSectionInView("Contact");

  const [encodedEmail, setEncodedEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    const email = "kenneth.courtney@gmail.com";
    const encoded = Array.from(email)
      .map((char) => `&#${char.charCodeAt(0)};`)
      .join("");
    setEncodedEmail(encoded);

    // Track that user is on contact page
    SessionManager.trackPageVisit('/contact', {
      section: 'contact-form'
    });

    // Pre-populate if we have session data
    const sessionData = SessionManager.getSessionData();
    if (sessionData?.name) setSenderName(sessionData.name);
    if (sessionData?.email) setSenderEmail(sessionData.email);
  }, []);

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <ContentBlock 
        contentKey="contact-title" 
        defaultContent="Contact me"
        as="h2"
        className="text-3xl font-bold capitalize mb-8 text-center"
      />

      <ContentBlock 
        contentKey="contact-description" 
        defaultContent={`Please contact me directly at ${encodedEmail} or through this form.`}
        className="text-gray-700 -mt-6 dark:text-white/80"
      />

      <form
        className="mt-10 flex flex-col dark:text-black"
        action={async (formData) => {
          const name = formData.get("senderName") as string;
          const email = formData.get("senderEmail") as string;
          const message = formData.get("message") as string;

          // Update session with contact info
          SessionManager.setVisitorIdentity(name, email);

          const { data, error } = await sendEmail(formData);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success("Message sent successfully! We'll get back to you soon.");
        }}
      >
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderName"
          type="text"
          required
          maxLength={100}
          placeholder="Your name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
        />
        <input
          className="h-14 px-4 mt-3 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />
        <textarea
          className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="message"
          placeholder="Your message"
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
}
