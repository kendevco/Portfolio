"use client";

import React from 'react';
import SectionHeading from './section-heading';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { experiencesData } from '@/lib/data';
import { useSectionInView } from '@/lib/hooks';
import { useTheme } from '@/context/theme-context';
// Import the icon library you're using
import { FaReact, FaDotCircle, FaDatabase, FaAnchor } from 'react-icons/fa';

export default function Experience() {
  const { ref } = useSectionInView('Experience');
  const { theme } = useTheme();

  // Function to determine background based on the theme
  const getBackground = (isLightTheme: boolean): string => {
    return isLightTheme ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)';
  };

  const lineColor = theme === 'light' ? '#e5e7eb' : 'rgba(229, 231, 235, 0.2)'; // bg-gray-200 color in hex

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>My experience</SectionHeading>
      <VerticalTimeline  lineColor={lineColor}>
        {experiencesData.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{
              background: getBackground(theme === 'light'),
              boxShadow: 'none',
              border: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.5)'}`,
              textAlign: 'left',
              padding: '1.3rem 2rem',
            }}
            contentArrowStyle={{
              borderRight: `7px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.5)'}`,
            }}
            date={item.date}
            iconStyle={{
              background: theme === 'light' ? 'white' : 'rgba(255, 255, 255, 0.15)',
              fontSize: '1.5rem',
            }}
            icon={item.icon}
            visible={true} 
          >
            <h3 className="vertical-timeline-element-title">{item.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">{item.location}</h4>
            <p>{item.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </section>
  );
}
