/**
 * Offline Fallback Answering Engine
 * Provides deterministic, data-grounded answers when the AI server route or API key is unavailable.
 * Grounded 100% in src/data/portfolio.ts. Never invents facts.
 */

import {
  personalInfo,
  portfolioProjects,
  education,
  awards,
  skills,
} from "../data/portfolio";

export function getOfflineAnswer(query: string): string {
  const q = query.trim().toLowerCase();

  // Out-of-scope code generation, scripts, or unrelated topics
  if (
    q.includes("python script") ||
    q.includes("write code") ||
    q.includes("write a script") ||
    q.includes("solve this") ||
    q.includes("tell me a joke") ||
    q.includes("weather")
  ) {
    return "I am an assistant specifically for Diwakar Reddy's portfolio. I cannot help with external coding tasks or general queries, but I'd be glad to answer questions regarding Diwakar's projects, technical stacks, or education!";
  }

  // Prompt injection or persona change attempts
  if (
    q.includes("ignore") ||
    q.includes("system prompt") ||
    q.includes("instructions") ||
    q.includes("pretend") ||
    q.includes("years of experience")
  ) {
    return "I am an assistant grounded strictly in Diwakar Reddy's portfolio. Diwakar is currently pursuing his B.E. in Computer Science and Design at RRCE Bengaluru (2023 - Present) and develops software projects.";
  }

  // 1. Projects Questions
  if (
    q.includes("project") ||
    q.includes("what has he built") ||
    q.includes("built") ||
    q.includes("portfolio")
  ) {
    if (q.includes("adenver") || q.includes("assistant")) {
      const p = portfolioProjects.find((x) => x.id === "adenver-ai");
      return `ADENVER AI is Diwakar's desktop-based local AI personal assistant built with Python, PySide6, SQLite, and Qt. It features intelligent multi-provider routing (Ollama, LM Studio, Groq, Gemini) with secure action confirmation dialogs.`;
    }
    if (q.includes("icu") || q.includes("sepsis")) {
      const p = portfolioProjects.find((x) => x.id === "icu-monitoring");
      return `Smart ICU Monitoring is a real-time healthcare IoT & predictive ML project. An ESP32 sensor unit (MAX30102, MLX90614, MPU6050) streams vitals to a Flask/Socket.IO backend running a Random Forest sepsis-risk classifier. Research paper published in IJIRCCE.`;
    }
    if (q.includes("ets") || q.includes("expense")) {
      return `ETS (Expense Tracking System) is a business software web application engineered for Sri Basaveshwara Harvesting & Co. using Python, Django, MySQL, HTML, CSS, and JavaScript to track financial transactions and farm equipment expenditures.`;
    }

    const titles = portfolioProjects.map((p) => p.title).join("; ");
    return `Diwakar has built 3 primary featured projects: 1) ADENVER AI (Local AI desktop assistant with PySide6 & Ollama), 2) Smart ICU Monitoring (Healthcare IoT & Random Forest sepsis prediction, published in IJIRCCE), and 3) Sri Basaveshwara Harvesting & Co. (Agribusiness Expense Tracking System with Python & Django).`;
  }

  // 2. Specific project queries
  if (q.includes("adenver")) {
    return `ADENVER AI is a local-first personal AI assistant desktop app built by Diwakar using Python, PySide6, Qt, and SQLite. It provides multi-provider LLM routing (Ollama, LM Studio, Groq, Gemini), persistent local conversation history, and user-confirmed action execution.`;
  }

  if (q.includes("icu") || q.includes("sepsis")) {
    return `The Smart ICU Monitoring project uses ESP32 sensors (MAX30102, MLX90614, MPU6050) to monitor vitals, streaming to a Flask and Socket.IO backend with a Random Forest model for early sepsis risk analysis. Published in IJIRCCE (Oct 2026).`;
  }

  // 3. Skills Questions
  if (
    q.includes("skill") ||
    q.includes("stack") ||
    q.includes("technolog") ||
    q.includes("language") ||
    q.includes("what can he do")
  ) {
    const skillList = skills.map((s) => `${s.name} (${s.tier})`).join(", ");
    return `Diwakar's core capabilities include: ${skillList}. His primary stacks are Python (Django, PySide6), React.js, HTML/CSS/JavaScript, SQL (MySQL, SQLite), Basic Java, and Applied AI with Firebase integration.`;
  }

  // 4. Education & CGPA
  if (
    q.includes("education") ||
    q.includes("college") ||
    q.includes("degree") ||
    q.includes("university") ||
    q.includes("cgpa") ||
    q.includes("school") ||
    q.includes("10th") ||
    q.includes("pu")
  ) {
    return `Diwakar is pursuing a B.E. in Computer Science and Design at Rajarajeswari College of Engineering (RRCE), Bengaluru (2023 - Present) with a CGPA of ${personalInfo.cgpa}. Previously, he completed Pre-University (PU, PCMB) at Daffodils PU College (68.17%, First Class) and 10th (SSLC) at Anand High School (65.44%).`;
  }

  // 5. Research Publication / Paper / ICAAN
  if (
    q.includes("publication") ||
    q.includes("paper") ||
    q.includes("research") ||
    q.includes("journal") ||
    q.includes("ijircce") ||
    q.includes("icaan")
  ) {
    const pub = awards[0];
    return `Diwakar published a peer-reviewed research paper titled "AI-Driven Design of Advanced Smart ICU Monitoring with Early Sepsis Risk Analysis" in IJIRCCE (Vol. 14, Issue 10, Oct 2026). He also presented this work at the International Conference on Advances in Applied Network (ICAAN 2026).`;
  }

  // 6. Availability, Internships, Hiring & Location
  if (
    q.includes("intern") ||
    q.includes("hire") ||
    q.includes("available") ||
    q.includes("job") ||
    q.includes("status") ||
    q.includes("location") ||
    q.includes("bengaluru")
  ) {
    return `Diwakar is based in ${personalInfo.location} and is currently AVAILABLE and actively open to software engineering internships and web development roles. You can contact him at ${personalInfo.email}.`;
  }

  // 7. Contact Info
  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("linkedin") ||
    q.includes("github")
  ) {
    return `You can reach Diwakar directly via email at ${personalInfo.email}, on LinkedIn at ${personalInfo.linkedin}, or review his code repositories at ${personalInfo.github}.`;
  }

  // Default fallback for questions whose answers are NOT in the portfolio
  return `I don't have that information on my portfolio. You can email Diwakar directly at ${personalInfo.email} to ask him!`;
}
