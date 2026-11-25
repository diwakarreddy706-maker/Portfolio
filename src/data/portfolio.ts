/**
 * Portfolio Data Store - Centralized content for Diwakar Reddy's portfolio
 * Sourced strictly from Diwakar Reddy's official Resume (diwakarreddy706@gmail.com)
 */

export const personalInfo = {
  name: "DIWAKAR",
  fullName: "Diwakar Reddy",
  role: "COMPUTER SCIENCE & DESIGN",
  roleSub: "+ Software & Web Developer",
  location: "BENGALURU, KARNATAKA",
  availability: "AVAILABLE",
  timezone: "Asia/Kolkata",
  email: "diwakarreddy706@gmail.com",
  sinceYear: "2023",
  degree: "Bachelor of Engineering (B.E)",
  degreeFull: "Bachelor of Engineering (B.E) in Computer Science and Design",
  institution: "Rajarajeswari College of Engineering (RRCE), Bengaluru",
  cgpa: "7.00",
  academicPeriod: "Sept 2023 - Present",
  bioHeadline: "COMPUTER SCIENCE & DESIGN STUDENT CRAFTING PRACTICAL SOFTWARE & WEB SYSTEMS.",
  bioBody:
    "Computer Science and Design student at Rajarajeswari College of Engineering with skills in HTML, CSS, JavaScript, React.js, Basic Java, Python, Django, and SQL. Experienced in developing academic, personal, and business-focused software projects with a focus on responsive interfaces, application functionality, and practical problem-solving. Looking to apply technical skills in a professional environment and contribute to real-world software development projects while continuously improving development skills.",
  voiceStatement:
    "A Computer Science and Design engineering student looking to apply technical skills in a professional environment and contribute to real-world software development projects while continuously improving development skills.",
  linkedin: "https://www.linkedin.com/in/diwakar-reddy-10141b448",
  github: "https://github.com/diwakarreddy706-maker",
  instagram: "https://www.instagram.com/_diwakar__12?mdxt=b2gyeGdpcWcyN3Bx&utm_source=qr",
};

export const metadataStrip = [
  {
    iconType: "pin",
    tag: "BASED IN",
    value: "BENGALURU, KARNATAKA",
  },
  {
    iconType: "globe",
    tag: "EDUCATION & DEGREE",
    value: "B.E. CS & DESIGN · RRCE",
  },
  {
    iconType: "badge",
    tag: "PRIMARY SKILLS",
    value: "PYTHON, REACT, DJANGO & SQL",
  },
];

export const approachPhases = [
  {
    num: "01",
    step: "01 DISCOVER AND ANALYSIS",
    title: "Discover & Analyze",
    description:
      "Understand practical problem constraints, assess user interaction flows, and structure clean data schemas across relational and local databases.",
  },
  {
    num: "02",
    step: "02 DESIGN AND IMPLEMENT",
    title: "Design & Implement",
    description:
      "Engineer desktop AI architectures with PySide6/SQLite, responsive web applications with Python/Django & React.js, and secure multi-provider routing.",
  },
  {
    num: "03",
    step: "03 DELIVER AND TEST",
    title: "Deliver & Test",
    description:
      "Implement permission validation, test real-time cloud data flows with Firebase, and deliver structured database applications with MySQL.",
  },
];

export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle?: string;
  statusBadge?: string;
  description: string;
  technologies: string[];
  featured?: boolean;
  highlights?: string[];
  repoUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
}

export const portfolioProjects: Project[] = [
  {
    id: "adenver-ai",
    title: "ADENVER AI – Local-First Personal AI Assistant",
    category: "LOCAL AI & DESKTOP AUTOMATION",
    repoUrl: "https://github.com/diwakarreddy706-maker/Adenver-AI",
    description:
      "Desktop-based personal AI assistant with an interactive PySide6/Qt GUI supporting natural-language conversations, voice interaction, and local-first SQLite memory management.",
    technologies: [
      "Python",
      "PySide6",
      "SQLite",
      "Qt",
      "Ollama",
      "LM Studio",
      "Groq API",
      "Gemini API",
    ],
    featured: true,
    highlights: [
      "Developed a desktop-based AI personal assistant with an interactive GUI, supporting natural-language conversations, voice interaction, and AI-powered task management.",
      "Implemented a local-first architecture with SQLite-based memory management, allowing the assistant to store, retrieve, and manage user information, tasks, and notes.",
      "Integrated multiple AI providers with intelligent provider routing, enabling flexible model selection and AI response generation (Ollama, LM Studio, Groq, Gemini).",
      "Built a secure command execution framework with action validation, permission controls, and user confirmation for sensitive operations.",
      "Implemented voice interaction, scheduling, and automation components to support hands-free assistance and desktop productivity.",
    ],
  },
  {
    id: "icu-monitoring",
    title: "AI-Driven Smart ICU Monitoring with Early Sepsis Risk Analysis",
    category: "HEALTHCARE IOT & PREDICTIVE ML",
    repoUrl: "https://github.com/diwakarreddy706-maker/Smart-ICU-Monitoring",
    videoUrl: "/videos/icu-demo.mp4",
    posterUrl: "/videos/icu-demo-poster.jpg",
    statusBadge: "Prototype, not clinically validated",
    description:
      "A development prototype of a real-time ICU monitoring system. An ESP32 sensor unit (MAX30102, MLX90614, MPU6050) streams vital signs to a Flask and Socket.IO backend, which runs a Random Forest sepsis-risk classifier and updates a live web dashboard. Includes Firebase Firestore logging, a buzzer alert path, and local-LLM (Ollama) summaries and shift-handover reports. Published in IJIRCCE.",
    technologies: [
      "ESP32",
      "Flask",
      "Socket.IO",
      "Random Forest",
      "Firebase",
      "Ollama",
    ],
    featured: true,
    highlights: [
      "Development prototype of a real-time ICU monitoring system streaming vital signs from an ESP32 sensor unit (MAX30102, MLX90614, MPU6050).",
      "Flask and Socket.IO backend running a Random Forest sepsis-risk classifier with real-time web dashboard telemetry updates.",
      "Dual alert and persistence pathways with Firebase Firestore cloud logging and a buzzer alert path.",
      "Local-LLM (Ollama) integration for automated shift-handover summaries and vital sign reporting.",
      "Published in the International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE).",
    ],
  },
  {
    id: "ets-expense",
    title: "Sri Basaveshwara Harvesting & Co.",
    category: "INDEPENDENT BUSINESS SOFTWARE",
    subtitle: "Expense Tracking System (ETS)",
    repoUrl: "https://github.com/diwakarreddy706-maker/ETS-Expense-Tracker",
    description:
      "Business-focused financial and expense management web application engineered for Sri Basaveshwara Harvesting & Co. to manage income, business expenses, and financial transactions.",
    technologies: ["Python", "Django", "MySQL", "HTML", "CSS", "JavaScript"],
    featured: true,
    highlights: [
      "Conceptualized and developed an Expense Tracking System (ETS) from an original business idea for Sri Basaveshwara Harvesting & Co.",
      "Built a web application using Python, Django, and MySQL to organize business financial records.",
      "Designed structured modules for recording income, tracking categorized expenditures, and managing transaction logs.",
      "Implemented relational database models with MySQL and Django backend functionality for financial data management.",
    ],
  },
];

export const stats = [
  {
    number: "3",
    label: "PROJECTS",
  },
  {
    number: "1",
    label: "PUBLICATION",
  },
  {
    number: "1",
    label: "PRIZE",
  },
  {
    number: "2",
    label: "CERTIFICATIONS",
  },
];

export const experiences = [
  {
    company: "Sri Basaveshwara Harvesting & Co.",
    role: "Full-Stack Software Developer · Agribusiness ERP",
    date: "2024",
    summary:
      "Engineered an end-to-end Expense Tracking System (ETS) using Python, Django, and MySQL. Designed relational database schemas for categorized agricultural revenue, harvest fuel consumption, and operational machinery logs.",
  },
  {
    company: "ADENVER AI",
    role: "Lead Systems & AI Developer · Desktop Systems",
    date: "2024 - Present",
    summary:
      "Architected an offline-first desktop personal assistant using PySide6 (Qt) and SQLite. Implemented local LLM orchestration via Ollama 3.2 with cloud fallback routing to Groq and Gemini APIs, featuring action validation and voice interaction.",
  },
  {
    company: "AI-Driven Smart ICU Monitoring",
    role: "Embedded Systems & ML Developer · Published Research",
    date: "2024 - 2026",
    summary:
      "Co-authored and developed an IoT-driven critical care telemetry platform. Integrated ESP32 microcontrollers with pulse oximetry and temperature sensors to stream vitals to a Flask/Socket.IO backend running a Random Forest sepsis risk classifier. Published in IJIRCCE.",
  },
];

export interface EducationItem {
  level: string;
  qualification: string;
  institution: string;
  board?: string;
  location: string;
  years: string;
  result: string;
  subjects?: string[];
  status?: string;
}

export const education: EducationItem[] = [
  {
    level: "B.E.",
    qualification: "B.E. in Computer Science and Design",
    institution: "Rajarajeswari College of Engineering (RRCE)",
    location: "Bengaluru",
    years: "2023 - Present",
    status: "Pursuing",
    result: "CGPA: 7.00",
  },
  {
    level: "PU",
    qualification: "Pre-University (PU, 2nd year PUC), Science (PCMB)",
    institution: "Daffodils PU College",
    board: "Karnataka School Examination and Assessment Board (KSEAB)",
    location: "Amarapur, Sindhanur, Raichur",
    years: "March 2023",
    result: "409 / 600 (68.17%), First Class",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Sanskrit"],
  },
  {
    level: "10TH",
    qualification: "Secondary (SSLC, 10th)",
    institution: "Anand High School",
    board: "Karnataka Secondary Education Examination Board (KSEEB)",
    location: "Sindhanur, Raichur",
    years: "July 2021",
    status: "Medium: English",
    result: "409 / 625 (65.44%)",
  },
];

export interface Award {
  name: string;
  badge: string;
  year: string;
  description: string;
  certificateUrl?: string;
  linkUrl?: string;
  linkText?: string;
}

export const awards: Award[] = [
  {
    name: "Research Publication, IJIRCCE",
    badge: "OCTOBER 2026 // PEER-REVIEWED",
    year: "OCT 2026",
    description:
      '"AI-Driven Design of Advanced Smart ICU Monitoring with Early Sepsis Risk Analysis" — Diwakar Reddy, Divyam Singh, Haripriya MP, Shivani RK, Dr. M Selvi. International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE), Volume 14, Issue 10, October 2026, pp. 6876-6882. DOI: 10.15680/IJIRCCE.2026.1410044.',
    linkUrl: "/certificates/44_ai-driven-publication-paper.pdf",
    linkText: "VIEW PAPER",
    certificateUrl: "/certificates/ijircce-publication.pdf",
  },
  {
    name: "ICAAN 2026 Conference Presentation",
    badge: "INTERNATIONAL CONFERENCE",
    year: "2026",
    description:
      "Presented research paper on 'AI-Driven Design of Advanced Smart ICU Monitoring with Early Sepsis Risk Analysis' at the International Conference on Advances in Applied Network (ICAAN 2026).",
    certificateUrl: "/certificates/icaan-2026-presentation.pdf",
    linkText: "VIEW CERTIFICATE",
  },
  {
    name: "Won 3rd Prize at CMR University",
    badge: "TECHNICAL SYMPOSIUM",
    year: "2024",
    description:
      "Won 3rd Prize at the CMR University National Technical Symposium in the 'Prompt & Roast' technical competition.",
  },
  {
    name: "NPTEL Online Certification · IIT Kharagpur",
    badge: "IIT KHARAGPUR // NPTEL",
    year: "2024",
    description:
      "Successfully certified in 'Introduction to Internet of Things' (NPTEL online certification, 12-week course, IIT Kharagpur).",
    certificateUrl: "/certificates/NPTEL_IoT_Certificate.pdf",
  },
  {
    name: "Artificial Intelligence (AI) Course Certification",
    badge: "AI CERTIFICATION",
    year: "2024",
    description:
      "Certified in foundational and applied Artificial Intelligence concepts and intelligent system workflows.",
  },
];

export interface SkillItem {
  name: string;
  category: string;
  tier: "Used in projects" | "Comfortable" | "Learning";
  usedIn: string;
  description: string;
}

export const skills: SkillItem[] = [
  {
    name: "HTML, CSS & JAVASCRIPT",
    category: "FRONTEND & RESPONSIVE UI",
    tier: "Used in projects",
    usedIn: "ETS, Smart ICU Dashboard",
    description:
      "Responsive interfaces, React.js components, modern JavaScript, and Tailwind CSS utility styling.",
  },
  {
    name: "PYTHON & DJANGO",
    category: "BACKEND & APPLICATION LOGIC",
    tier: "Used in projects",
    usedIn: "ADENVER AI, ETS",
    description:
      "Python programming, Django web framework, PySide6 desktop GUI, and SQLite database management.",
  },
  {
    name: "BASIC JAVA & SQL",
    category: "CORE LANGUAGES & DATA",
    tier: "Comfortable",
    usedIn: "Academic Coursework, ETS (MySQL)",
    description:
      "Object-oriented programming basics in Java, relational database modeling, and structured SQL queries.",
  },
  {
    name: "APPLIED AI & CLOUD INTEGRATION",
    category: "APPLIED AI & FIREBASE",
    tier: "Used in projects",
    usedIn: "ADENVER AI, Smart ICU",
    description:
      "Multi-provider AI routing (Ollama, LM Studio, Groq, Gemini), Firebase cloud integration, and IoT fundamentals.",
  },
];

export const softSkills = [
  "Presentation",
  "Active Listening",
  "Practical Problem-Solving",
  "Responsive UI Design",
];

export const socialLinks = [
  { name: "INSTAGRAM", url: "https://www.instagram.com/_diwakar__12?mdxt=b2gyeGdpcWcyN3Bx&utm_source=qr" },
  { name: "LINKEDIN", url: "https://www.linkedin.com/in/diwakar-reddy-10141b448" },
  { name: "GITHUB", url: "https://github.com/diwakarreddy706-maker" },
  { name: "EMAIL", url: "mailto:diwakarreddy706@gmail.com" },
];
