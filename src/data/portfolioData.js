// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Gangadhara K V",
  brandName: "Gangadhara K V",
  role: "Python Full Stack Developer",
  city: "Davangere, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "gangadhar.konddajji29@gmail.com",
  phone: "+91 7676172330",
  availability: "Open to Internship and Full Time",
  portrait: "/portrait.jpg",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/gangadharkonddajji",
  linkedin: "https://www.linkedin.com/in/gangadharakv",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro:
    "From mechanical engineering to software development, transforming analytical thinking into innovative digital solutions.",
  statusLines: [
    "Python Full Stack Developer Intern",
    "Engineering Meets Software",
    "Turning Logic Into Solutions",
  ],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Engineering mindset, software solutions.",
  paragraph:
    "I'm a Mechanical Engineering student exploring software development as a Python Full Stack Developer Intern, currently training in the placement training program at TAP Academy. With an engineering mindset and a passion for problem-solving, I'm building my skills in Python, SQL, HTML, CSS, and web development. I'm driven by curiosity, continuous learning, and the desire to turn ideas into practical solutions.",
  stats: [
    { value: 2, suffix: "+", label: "Engineering Projects" },
    { value: 5, suffix: "+", label: "Technologies Explored" },
    { value: 1, suffix: "", label: "Developer Internship" },
  ],
};

export const skillGroups = [
  { title: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
  { title: "Backend", items: ["Python", "SQL"] },
  { title: "Database", items: ["MySQL"] },
  { title: "Tools", items: ["VS Code", "Git", "GitHub"] },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Engineering Calculator",
    description:
      "A simple web application that helps users perform common engineering calculations, including force, pressure, power, and unit conversions.",
    tags: ["HTML", "CSS", "JavaScript"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/gangadharkonddajji",
    image: "/engineering-calculator.png",
  },
];

export const experience = [
  {
    period: "2026 — Present",
    role: "Python Full Stack Developer Intern",
    org: "TAP Academy",
    description:
      "Full-stack development, Python, SQL, web technologies, and software engineering principles.",
  },
  {
    period: "May — Aug 2026",
    role: "Intern",
    org: "Toyota Industries Engine India (TIEI)",
    description:
      "Industrial engineering experience analyzing automotive manufacturing and mechanical assembly processes.",
  },
  {
    period: "Feb — May 2026",
    role: "Candidate Manager Intern",
    org: "TEK Systems",
    description:
      "Managed talent workflows, candidate communication, and recruitment coordination.",
  },
  {
    period: "2023 — 2026",
    role: "B.E. Mechanical Engineering",
    org: "Bapuji Institute of Engineering and Technology (BIET), Davangere",
    description:
      "Analytical engineering fundamentals, mechanics, thermodynamics, and design problem solving.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's build something.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
