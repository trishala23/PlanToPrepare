import { ExperienceLevel } from "@/lib/resumeParser";

type LevelQuestions = Record<ExperienceLevel, string[]>;

const COMMON_BEHAVIORAL: LevelQuestions = {
  entry: [
    "Tell me about yourself and why you're interested in this role.",
    "Describe a time you had to learn something new quickly. How did you approach it?",
    "Tell me about a time you worked on a team project. What was your contribution?",
    "Describe a mistake you made and what you learned from it.",
    "Why are you switching into this field?",
  ],
  mid: [
    "Tell me about a project you're most proud of and the impact it had.",
    "Describe a time you disagreed with a teammate or manager. How did you handle it?",
    "Tell me about a time you had to manage competing priorities under a deadline.",
    "Describe a situation where you had to influence others without formal authority.",
    "What's a piece of feedback you received that changed how you work?",
  ],
  senior: [
    "Tell me about a time you drove a significant technical or strategic decision. What was the outcome?",
    "Describe how you've mentored or grown other people on your team.",
    "Tell me about a time a project failed or fell short. What did you change afterward?",
    "How do you decide what to prioritize when everything feels urgent?",
    "Describe a time you had to make a difficult tradeoff with limited information.",
  ],
};

const ROLE_TECHNICAL_QUESTIONS: Record<string, LevelQuestions> = {
  "software-engineer": {
    entry: [
      "Explain the difference between an array and a linked list.",
      "What is Big-O notation and why does it matter?",
      "Walk me through how you would debug a function that's returning the wrong result.",
      "What is version control and why do teams use it?",
    ],
    mid: [
      "Design a simple rate limiter. What data structures would you use?",
      "How would you approach optimizing a slow database query?",
      "Explain REST vs. GraphQL and when you'd choose one over the other.",
      "Walk through how you'd design a URL shortening service.",
    ],
    senior: [
      "Design a distributed system that needs to handle millions of requests per day. What are the key tradeoffs?",
      "How do you approach breaking a monolith into services?",
      "Tell me about a time you had to make an architectural decision with long-term consequences.",
      "How do you think about reliability, observability, and on-call ownership for systems you build?",
    ],
  },
  "frontend-developer": {
    entry: [
      "What's the difference between `let`, `const`, and `var`?",
      "Explain the CSS box model.",
      "What is the virtual DOM and why is it useful?",
      "How do you make a website accessible?",
    ],
    mid: [
      "How would you optimize a React app that's re-rendering too often?",
      "Explain how you'd manage global state in a large frontend application.",
      "Walk through how you'd debug a memory leak in a single-page app.",
      "How do you approach responsive design for a complex layout?",
    ],
    senior: [
      "How would you design a component library used across multiple product teams?",
      "Discuss the tradeoffs between client-side rendering, server-side rendering, and static generation.",
      "How do you think about frontend performance budgets at scale?",
      "Describe how you've driven frontend architecture decisions across teams.",
    ],
  },
  "backend-developer": {
    entry: [
      "What is an API and how does a client communicate with a server?",
      "Explain the difference between SQL and NoSQL databases.",
      "What is a race condition?",
      "How does HTTP status code communicate success or failure?",
    ],
    mid: [
      "How would you design a database schema for an e-commerce order system?",
      "Explain caching strategies you've used and when to apply them.",
      "How do you handle idempotency in an API that can be retried?",
      "Walk through how you'd secure an internal API.",
    ],
    senior: [
      "Design a payments system that must guarantee exactly-once processing.",
      "How do you approach data consistency across multiple services?",
      "Tell me about a time you scaled a backend system under heavy load.",
      "How do you evaluate build-vs-buy decisions for infrastructure?",
    ],
  },
  "full-stack-developer": {
    entry: [
      "Walk through what happens when a user loads a web page, from URL to rendered content.",
      "Explain the difference between frontend and backend state.",
      "What is CORS and why does it exist?",
      "How would you structure a simple full-stack CRUD app?",
    ],
    mid: [
      "How do you decide what logic belongs on the client vs. the server?",
      "Design the data flow for a real-time chat feature.",
      "How do you approach testing across the full stack?",
      "Walk through deploying a full-stack app to production.",
    ],
    senior: [
      "How do you balance ownership across frontend, backend, and infra as a full-stack lead?",
      "Design a multi-tenant SaaS application end to end.",
      "How do you make architecture decisions that affect both client and server teams?",
      "Tell me about a time you owned a feature from design through production incident response.",
    ],
  },
  "devops-engineer": {
    entry: [
      "What is the difference between a container and a virtual machine?",
      "Explain what a CI/CD pipeline does.",
      "What is Infrastructure as Code?",
      "How would you check why a server is running out of disk space?",
    ],
    mid: [
      "Design a CI/CD pipeline for a multi-service application.",
      "How do you approach zero-downtime deployments?",
      "Explain how you'd set up monitoring and alerting for a production system.",
      "Walk through troubleshooting a Kubernetes pod that keeps crashing.",
    ],
    senior: [
      "How do you design for disaster recovery and business continuity?",
      "Tell me about a major incident you led the response for.",
      "How do you think about cost optimization at cloud infrastructure scale?",
      "Design a multi-region, highly available deployment architecture.",
    ],
  },
  "data-analyst": {
    entry: [
      "Write a SQL query to find the second-highest salary in a table.",
      "What's the difference between INNER JOIN and LEFT JOIN?",
      "How would you handle missing data in a dataset?",
      "Explain the difference between correlation and causation.",
    ],
    mid: [
      "Walk through how you'd design a dashboard for a stakeholder who wants to track weekly active users.",
      "How would you detect and explain an anomaly in a metric?",
      "Design an A/B test to measure the impact of a new feature.",
      "How do you validate that a dataset is reliable before drawing conclusions?",
    ],
    senior: [
      "How do you influence business strategy through data storytelling?",
      "Tell me about a time your analysis changed a major business decision.",
      "How do you build a culture of data-informed decision making on a team?",
      "Design a metrics framework for a new product line.",
    ],
  },
  "data-scientist": {
    entry: [
      "Explain the difference between supervised and unsupervised learning.",
      "What is overfitting and how do you prevent it?",
      "Walk through how you'd clean a messy dataset before modeling.",
      "Explain precision vs. recall.",
    ],
    mid: [
      "How would you choose between a few candidate models for a classification problem?",
      "Design an experiment to test whether a new recommendation model improves engagement.",
      "How do you handle class imbalance in a dataset?",
      "Walk through how you'd deploy a model into production and monitor it.",
    ],
    senior: [
      "How do you decide when a problem needs machine learning versus simpler heuristics?",
      "Tell me about a time a model you shipped had unexpected real-world impact.",
      "How do you think about fairness and bias in models you build?",
      "Design an end-to-end ML system for fraud detection.",
    ],
  },
  "ml-engineer": {
    entry: [
      "What's the difference between a parameter and a hyperparameter?",
      "Explain gradient descent at a high level.",
      "What is a training/validation/test split and why do we use it?",
      "What tools have you used to train and evaluate a model?",
    ],
    mid: [
      "How would you design a feature store for a machine learning platform?",
      "Explain how you'd monitor a model for drift in production.",
      "Walk through the tradeoffs between batch and real-time inference.",
      "How do you optimize a slow-to-train model?",
    ],
    senior: [
      "Design an ML platform that supports multiple teams training and deploying models.",
      "How do you think about reproducibility and versioning for models and data?",
      "Tell me about a time you had to debug a subtle model performance regression in production.",
      "How do you evaluate build-vs-buy for ML infrastructure?",
    ],
  },
  "product-manager": {
    entry: [
      "Walk me through how you'd prioritize a backlog with limited engineering resources.",
      "How would you write a one-page spec for a new feature?",
      "What metrics would you track for a new mobile app?",
      "How do you gather and incorporate user feedback?",
    ],
    mid: [
      "Design a product improvement for an app you use daily. What metrics would define success?",
      "How do you say no to a stakeholder who wants a feature that's not on the roadmap?",
      "Walk through how you'd run a product launch end to end.",
      "How do you balance user needs, business goals, and technical constraints?",
    ],
    senior: [
      "How do you set product strategy and vision for a multi-quarter roadmap?",
      "Tell me about a time you had to sunset a product or feature. How did you handle it?",
      "How do you align multiple stakeholder teams around a shared roadmap?",
      "Describe how you've mentored other PMs or built product processes.",
    ],
  },
  "ux-designer": {
    entry: [
      "Walk me through your design process from problem to solution.",
      "How do you conduct a usability test?",
      "What's the difference between UX and UI?",
      "Show me a project in your portfolio and explain your design decisions.",
    ],
    mid: [
      "How do you balance user needs against business or technical constraints?",
      "Walk through how you'd redesign a checkout flow with a high drop-off rate.",
      "How do you incorporate feedback from engineering and product into your designs?",
      "How do you validate a design decision with data?",
    ],
    senior: [
      "How do you build and maintain a design system across multiple product teams?",
      "Tell me about a time you advocated for a user need against business pressure.",
      "How do you mentor other designers and elevate design quality on a team?",
      "How do you set design strategy and vision for a product area?",
    ],
  },
  "qa-engineer": {
    entry: [
      "What's the difference between manual and automated testing?",
      "How would you write test cases for a login form?",
      "What is regression testing?",
      "Explain the difference between unit, integration, and end-to-end tests.",
    ],
    mid: [
      "How would you design a test automation strategy for a new product?",
      "Walk through how you'd prioritize what to test with limited time before a release.",
      "How do you integrate automated tests into a CI/CD pipeline?",
      "How do you approach testing an API versus a UI?",
    ],
    senior: [
      "How do you build a quality culture across an engineering organization?",
      "Tell me about a time a critical bug slipped into production. What changed afterward?",
      "How do you decide what to automate versus test manually at scale?",
      "How do you measure and report on product quality to leadership?",
    ],
  },
  "cybersecurity-analyst": {
    entry: [
      "What's the difference between symmetric and asymmetric encryption?",
      "Explain what a firewall does.",
      "What is phishing and how would you help prevent it?",
      "What steps would you take if you discovered a suspicious login?",
    ],
    mid: [
      "Walk through how you'd respond to a detected malware infection on an employee laptop.",
      "How do you perform a vulnerability assessment on a web application?",
      "Explain the principle of least privilege and how you'd apply it.",
      "How do you stay current on emerging threats?",
    ],
    senior: [
      "How do you design an incident response plan for an organization?",
      "Tell me about a security incident you led the response for.",
      "How do you balance security requirements against product/business velocity?",
      "How do you build a security-aware culture across engineering teams?",
    ],
  },
  "project-manager": {
    entry: [
      "How would you create a project plan for a new initiative?",
      "What's the difference between Agile and Waterfall?",
      "How do you track and report project status to stakeholders?",
      "How do you handle a task that's falling behind schedule?",
    ],
    mid: [
      "Walk through how you'd manage a project with dependencies across three teams.",
      "How do you handle scope creep from a stakeholder?",
      "Describe how you run a retrospective and act on its findings.",
      "How do you manage risk on a complex project?",
    ],
    senior: [
      "How do you manage a portfolio of projects with competing priorities?",
      "Tell me about a time you had to recover a project that was significantly behind.",
      "How do you build project management processes that scale across an organization?",
      "How do you influence executive stakeholders on tradeoffs?",
    ],
  },
  "digital-marketing": {
    entry: [
      "What channels would you use to launch a new product with a limited budget?",
      "Explain the difference between SEO and SEM.",
      "How do you measure the success of a marketing campaign?",
      "What is a conversion funnel?",
    ],
    mid: [
      "Walk through how you'd design an A/B test for an email campaign.",
      "How do you allocate budget across channels based on performance data?",
      "Describe a campaign you ran and how you measured ROI.",
      "How do you build and grow an audience organically?",
    ],
    senior: [
      "How do you build a marketing strategy aligned with overall business goals?",
      "Tell me about a time you had to pivot a marketing strategy based on data.",
      "How do you manage and mentor a marketing team?",
      "How do you think about brand versus performance marketing tradeoffs?",
    ],
  },
};

export interface InterviewQuestionSet {
  behavioral: string[];
  technical: string[];
  skillBased: string[];
}

export function getInterviewQuestions(
  roleId: string,
  level: ExperienceLevel,
  matchedSkills: string[]
): InterviewQuestionSet {
  const technicalBank = ROLE_TECHNICAL_QUESTIONS[roleId];
  const technical = technicalBank ? technicalBank[level] : [];
  const behavioral = COMMON_BEHAVIORAL[level];

  const skillBased = matchedSkills
    .slice(0, 5)
    .map(
      (skill) =>
        `Tell me about a project where you used ${skill}. What problem did it solve and what would you do differently?`
    );

  return { behavioral, technical, skillBased };
}
