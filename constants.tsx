
import React from 'react';
import type { DockItem, ExperienceItem, ProjectCategory, Certification, EducationItem } from './types';

// Heroicons SVGs
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);
const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v7a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zm-2 2V4h4v1H8z" clipRule="evenodd" /></svg>
);
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
);
const AcademicCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 011.056 0l4-1.819-2.1-4.202zM10 15a1 1 0 100-2 1 1 0 000 2z" /><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M3 10a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1zm14 0a1 1 0 01-1 1h-.01a1 1 0 110-2H16a1 1 0 011 1zm-8.293 4.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 16.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4z" /></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
);


export const DOCK_ITEMS: DockItem[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'about', label: 'About Me', icon: <UserIcon /> },
    { id: 'experience', label: 'Experience', icon: <BriefcaseIcon /> },
    { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
    { id: 'education', label: 'Education', icon: <AcademicCapIcon /> },
    { id: 'contact', label: 'Contact', icon: <MailIcon /> },
];

export const PROFILE_SUMMARY = "A curious and motivated analog layout engineer, looking for a full-time role in analog layout design, aiming to contribute my technical skills and layout proficiency to develop high-performance analog IP.";

export const EXPERIENCES: ExperienceItem[] = [
    {
        role: "Analog Layout Intern",
        company: "Texas Instruments",
        duration: "Jan 2025 – Jul 2025",
        points: [
            "Worked on analog layout in TSMC 28nm process using Cadence Virtuoso Layout XL.",
            "Handled hierarchical floorplanning, routing, DRC/LVS verification and PEX extraction for IP blocks.",
            "Familiar with layout-dependent effects and CMOS fabrication process.",
            "Optimized layouts for parasitic reduction, shielding, RC delay, EM, coupling, latch-up.",
            "Designed layouts for differential pairs, LDO, op-amps, current mirrors."
        ]
    },
    {
        role: "Layout Intern",
        company: "C2i Semiconductors",
        duration: "Aug 2025 – Present",
        points: [
            "Working on analog blocks in GF22FDX and TPSCo 65nm process nodes.",
            "Handling analog blocks such as PLLs, ADCs, and sub-blocks in the I/O ring.",
            "Proficient in Calibre DRC/LVS/PEX/FillGen runs and Voltus-XFi EMIR analysis.",
            "Ran DFM tests like DRC Plus and MAS and ensured manufacturability."
        ]
    }
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
    {
        title: "Layout Works",
        meta: "Technology Node - TSMC N28, GF22FDX, TPSCo 65 | Tools Used: Cadence Virtuoso, Pegasus, Calibre, ADE Assembler, Voltus-XFi",
        projects: [
            {
                title: "I. Low Dropout Regulator (LDO) - TSMC N28",
                description: [
                    "Completed full-block layout of LDO, including the hierarchy of pass-transistor and error amplifier.",
                    "Ensured IR drop was less than 5 mV across power rails.",
                    "Conducted temperature-aware parasitic extraction for C worst at 115°C and verified the results with designer.",
                    "Placed decoupling capacitors close to sensitive blocks for noise suppression.",
                    "Met EM constraints through optimized metal stacking and routing strategy."
                ]
            },
            {
                title: "II. 4-bit Flash ADC Layout - GF22FDX",
                description: [
                    "Handled top-level and hierarchical blocks.",
                    "Implemented Matching patterns and symmetric routings to cancel gradient mismatches.",
                    "Used shielding for critical signals and isolated the analog blocks from substrate noises.",
                    "Analyzed RBB and FBB topologies and worked with designer to optimize the area effectively."
                ]
            }
        ]
    },
    {
        title: "SKILL Automation Works",
        meta: "Automation scripts to improve layout efficiency.",
        projects: [
            {
                title: "1. Estimating Current-Carrying Capacity",
                description: ["Written a script to calculate the current carrying capacity of the metals for EM-aware routing based on metal width, layer type, and temperature."]
            },
            {
                title: "2. Object Relocation",
                description: ["Implemented a SKILL function to move selected layout objects by user-defined value for faster manual editing and placement refinement."]
            },
            {
                title: "3. Instance Swap",
                description: ["Created a bind-key-based SKILL tool to quickly swap two selected instances in the layout, reducing manual effort during cell placement optimization."]
            }
        ]
    }
];

export const CERTIFICATIONS: Certification[] = [
    { name: "VLSI Design RTL to GDS", issuer: "NPTEL" },
    { name: "Transistor-Level Power Signoff with Voltus-XFi", issuer: "Cadence Design Systems" },
    { name: "SKILL Programming Training", issuer: "Cadence Design Systems", status: "Ongoing" }
];

export const EDUCATION_HISTORY: EducationItem[] = [
    {
        institution: "Government College of Technology, Coimbatore",
        degree: "B.E in Electrical and Electronics Engineering",
        details: "Minor Degree in VLSI Design, ECE",
        duration: "Oct 2021 – May 2025",
        grade: "8.5, CGPA"
    },
    {
        institution: "Kendriya Vidyalaya Mandapam Camp, CMFRI",
        degree: "CBSE HSC",
        details: "",
        duration: "June 2019 – May 2021",
        grade: "96, Percentage"
    }
];

export const CONTACT_DETAILS = {
  name: "Rohith T M",
  email: "rohithtm.05@gmail.com",
  phone: "+91 9025923752",
  linkedin: "linkedin.com/in/rohith-tm",
  location: "Bangalore, Karnataka"
};

