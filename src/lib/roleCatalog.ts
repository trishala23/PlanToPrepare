export interface RoleDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

export const ROLE_CATALOG: RoleDefinition[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "Engineering",
    description: "General-purpose backend/full-stack software development.",
    requiredSkills: [
      "Data Structures & Algorithms",
      "Git",
      "SQL",
      "REST APIs",
      "Node.js",
      "System Design",
    ],
    niceToHaveSkills: ["Docker", "AWS", "CI/CD", "TypeScript"],
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Engineering",
    description: "Building user-facing web interfaces and client-side applications.",
    requiredSkills: ["HTML/CSS", "JavaScript", "React", "Git", "REST APIs"],
    niceToHaveSkills: ["TypeScript", "Data Structures & Algorithms", "System Design"],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Engineering",
    description: "Server-side logic, APIs, and data persistence.",
    requiredSkills: ["SQL", "REST APIs", "Node.js", "Git", "System Design", "Data Structures & Algorithms"],
    niceToHaveSkills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    category: "Engineering",
    description: "End-to-end ownership of both frontend and backend systems.",
    requiredSkills: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"],
    niceToHaveSkills: ["TypeScript", "Docker", "AWS", "System Design"],
  },
  {
    id: "devops-engineer",
    title: "DevOps / Site Reliability Engineer",
    category: "Engineering",
    description: "Infrastructure automation, deployment pipelines, and system reliability.",
    requiredSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"],
    niceToHaveSkills: ["Python", "System Design", "Networking"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data",
    description: "Turning raw data into actionable business insights.",
    requiredSkills: ["SQL", "Excel", "Data Analysis", "Data Visualization", "Statistics"],
    niceToHaveSkills: ["Python", "R", "Communication"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data",
    description: "Applying statistics and machine learning to solve business problems.",
    requiredSkills: ["Python", "SQL", "Statistics", "Machine Learning", "Data Analysis", "Data Visualization"],
    niceToHaveSkills: ["Deep Learning", "Spark", "R"],
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "Data",
    description: "Building and deploying production machine learning systems.",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "Data Structures & Algorithms", "SQL"],
    niceToHaveSkills: ["NLP", "Docker", "AWS", "System Design"],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Product",
    description: "Defining product strategy and coordinating cross-functional delivery.",
    requiredSkills: ["Product Management", "Agile/Scrum", "Stakeholder Management", "Communication", "Data Analysis"],
    niceToHaveSkills: ["UX Research", "SQL", "Leadership"],
  },
  {
    id: "ux-designer",
    title: "UX/UI Designer",
    category: "Design",
    description: "Researching and designing usable, delightful product experiences.",
    requiredSkills: ["UI/UX Design", "Figma", "UX Research", "Communication"],
    niceToHaveSkills: ["HTML/CSS", "Data Visualization"],
  },
  {
    id: "qa-engineer",
    title: "QA / Test Engineer",
    category: "Engineering",
    description: "Ensuring software quality through manual and automated testing.",
    requiredSkills: ["QA/Testing", "Git", "SQL", "REST APIs"],
    niceToHaveSkills: ["Python", "CI/CD", "Data Structures & Algorithms"],
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Security",
    description: "Protecting systems and data from security threats.",
    requiredSkills: ["Cybersecurity Fundamentals", "Networking", "Linux", "SQL"],
    niceToHaveSkills: ["Python", "System Design"],
  },
  {
    id: "project-manager",
    title: "Project Manager",
    category: "Operations",
    description: "Planning and delivering projects on time and within scope.",
    requiredSkills: ["Project Management", "Agile/Scrum", "Stakeholder Management", "Communication", "Leadership"],
    niceToHaveSkills: ["Data Analysis", "Product Management"],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Specialist",
    category: "Marketing",
    description: "Driving growth through digital channels and campaigns.",
    requiredSkills: ["Marketing", "Data Analysis", "Communication"],
    niceToHaveSkills: ["Data Visualization", "Excel"],
  },
];

export function getRoleById(id: string): RoleDefinition | undefined {
  return ROLE_CATALOG.find((r) => r.id === id);
}
