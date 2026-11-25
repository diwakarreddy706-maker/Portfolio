/**
 * Chat Knowledge Base Generator
 * Dynamically generated from src/data/portfolio.ts to ensure 100% synchronization.
 * Strictly adheres to privacy rules: NO personal ID numbers, no DOB, no parents, no phone, no home address.
 */

import {
  personalInfo,
  portfolioProjects,
  education,
  awards,
  skills,
  softSkills,
  socialLinks,
} from "../data/portfolio";

export function getChatKnowledgeBase(): string {
  const sections: string[] = [];

  // 1. Core Profile & Background
  sections.push(`=== ABOUT DIWAKAR REDDY ===
Full Name: ${personalInfo.fullName}
Professional Role: ${personalInfo.role} (${personalInfo.roleSub})
Location: ${personalInfo.location}
Current Status / Availability: ${personalInfo.availability} (Open to software engineering internships and development opportunities)
Email: ${personalInfo.email}
Degree: ${personalInfo.degreeFull}
Institution: ${personalInfo.institution}
Academic Period: ${personalInfo.academicPeriod}
Current CGPA: ${personalInfo.cgpa}
Headline: ${personalInfo.bioHeadline}
Overview: ${personalInfo.bioBody}
Personal Philosophy: ${personalInfo.voiceStatement}
LinkedIn Profile: ${personalInfo.linkedin}
GitHub Profile: ${personalInfo.github}
${personalInfo.instagram ? `Instagram Profile: ${personalInfo.instagram}` : ""}`);

  // 2. Education & Academic Qualifications
  const eduItems = education
    .map(
      (e) => `* Level: ${e.level}
  Qualification: ${e.qualification}
  Institution: ${e.institution}
  ${e.board ? `Examination Board: ${e.board}` : ""}
  Location: ${e.location}
  Academic Timeline: ${e.years}
  ${e.status ? `Status / Medium: ${e.status}` : ""}
  Academic Result: ${e.result}
  ${e.subjects && e.subjects.length > 0 ? `Key Subjects: ${e.subjects.join(", ")}` : ""}`
    )
    .join("\n");
  sections.push(`=== EDUCATION & ACADEMIC CREDENTIALS ===\n${eduItems}`);

  // 3. Featured Engineering Projects
  const projItems = portfolioProjects
    .map(
      (p) => `* Project Name: ${p.title}
  Category: ${p.category}
  ${p.subtitle ? `Subtitle / Company: ${p.subtitle}` : ""}
  ${p.statusBadge ? `Status Badge: ${p.statusBadge}` : ""}
  Description: ${p.description}
  Technologies / Stack: ${p.technologies.join(", ")}
  ${p.highlights && p.highlights.length > 0 ? `Highlights:\n    - ${p.highlights.join("\n    - ")}` : ""}
  ${p.repoUrl ? `Repository URL: ${p.repoUrl}` : "Repository: Available on GitHub profile / upon request"}
  ${p.demoUrl ? `Live Demo URL: ${p.demoUrl}` : "Live Demo: Integrated interactive simulation on portfolio"}
  ${p.videoUrl ? `Video URL: ${p.videoUrl}` : ""}`
    )
    .join("\n\n");
  sections.push(`=== FEATURED SOFTWARE & AI PROJECTS ===\n${projItems}`);

  // 4. Technical Skills & Proficiency Tiers
  const skillItems = skills
    .map(
      (s) => `* Skill: ${s.name}
  Category: ${s.category}
  Proficiency Tier: ${s.tier}
  Applied In Projects: ${s.usedIn}
  Description: ${s.description}`
    )
    .join("\n");
  sections.push(`=== TECHNICAL SKILLS & PROFICIENCY TIERS ===\n${skillItems}`);

  // 5. Interpersonal / Soft Skills
  sections.push(`=== INTERPERSONAL & SOFT SKILLS ===\n${softSkills.map((s) => `* ${s}`).join("\n")}`);

  // 6. Research Publication, Conference & Certifications
  const awardItems = awards
    .map(
      (a) => `* Title: ${a.name} (${a.year})
  Badge: ${a.badge}
  Summary: ${a.description}
  ${a.linkUrl ? `Paper Link: ${a.linkUrl}` : ""}
  ${a.certificateUrl ? `Certificate Link: ${a.certificateUrl}` : ""}`
    )
    .join("\n\n");
  sections.push(`=== RESEARCH PUBLICATIONS, CONFERENCES & CERTIFICATIONS ===\n${awardItems}`);

  // 7. Contact Details
  const socialItems = socialLinks.map((s) => `* ${s.name}: ${s.url}`).join("\n");
  sections.push(`=== OFFICIAL CONTACT & LINKS ===
Email: ${personalInfo.email}
${socialItems}`);

  return sections.join("\n\n");
}
