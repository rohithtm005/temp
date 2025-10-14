import React from 'react';

export type SectionId = 'home' | 'about' | 'experience' | 'projects' | 'education' | 'contact';

export interface DockItem {
  id: SectionId;
  label: string;
  // Fix: Changed from JSX.Element to React.ReactNode to resolve namespace issue.
  icon: React.ReactNode;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  points: string[];
}

export interface ProjectCategory {
  title: string;
  meta: string;
  projects: ProjectItem[];
}


export interface ProjectItem {
  title: string;
  description: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  status?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  details: string;
  duration: string;
  grade: string;
}
