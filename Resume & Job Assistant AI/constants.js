/**
 * CONFIGURATION & CONSTANTS
 * 
 * This file centralizes all constants used throughout the application.
 * Benefits:
 * - Easy to maintain and update values
 * - Single source of truth
 * - Better code organization
 */

// ===== TECH SKILLS DATABASE =====
// Curated list of 50+ technology keywords used for matching
export const TECH_KEYWORDS = [
  // Languages
  'python', 'javascript', 'typescript', 'java', 'golang', 'go', 'rust', 'c++',
  'scala', 'kotlin', 'swift', 'php', 'ruby', 'sql',
  
  // Frontend Frameworks
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nextjs',
  
  // Backend Frameworks
  'node', 'nodejs', 'fastapi', 'django', 'flask', 'express', 'rails',
  
  // Databases
  'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'cassandra',
  'elasticsearch', 'dynamodb', 'nosql',
  
  // Cloud & DevOps
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'k8s', 'terraform',
  'ansible', 'jenkins', 'github actions', 'ci/cd', 'lambda', 's3', 'ec2', 'rds',
  
  // APIs & Architecture
  'rest', 'graphql', 'grpc', 'microservices', 'kafka', 'rabbitmq',
  
  // Data Science & ML
  'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch',
  'scikit', 'pandas', 'numpy',
  
  // Frontend Technologies
  'html', 'css', 'tailwind', 'linux', 'nginx',
  
  // Security & Auth
  'jwt', 'oauth',
  
  // Tools & Practices
  'git', 'agile', 'scrum', 'jira', 'system design', 'algorithms',
  'data structures', 'communication', 'leadership', 'problem solving'
];

// ===== SCORING WEIGHTS =====
// Components of the overall ATS score
export const SCORE_WEIGHTS = {
  keywordMatch: 0.45,      // 45% - How many skills match
  experienceRelevance: 0.25, // 25% - Years and seniority indicators
  formatQuality: 0.15,      // 15% - Resume structure and formatting
  educationMatch: 0.15      // 15% - Education level detection
};

// ===== GRADING SCALE =====
// Score ranges and corresponding grades
export const GRADE_SCALE = [
  { min: 80, grade: 'Excellent match', color: '#22d3a0', ring: '#22d3a0' },
  { min: 65, grade: 'Strong match', color: '#9d77ff', ring: '#6c63ff' },
  { min: 50, grade: 'Good match', color: '#f59e0b', ring: '#f59e0b' },
  { min: 35, grade: 'Fair match', color: '#f97316', ring: '#f97316' },
  { min: 0, grade: 'Weak match', color: '#f43f5e', ring: '#f43f5e' }
];

// ===== FEEDBACK TEMPLATES =====
// Actionable feedback messages based on analysis
export const FEEDBACK_TEMPLATES = {
  missingSkills: {
    type: 'err',
    icon: '✕',
    title: 'Missing key skills',
    messageTemplate: (skills) => `Add to resume if you have them: ${skills.join(', ')}.`
  },
  lowKeywordMatch: {
    type: 'warn',
    icon: '!',
    title: 'Low keyword match',
    message: 'Mirror exact language from the JD — ATS scans for exact keyword matches.'
  },
  poorFormat: {
    type: 'warn',
    icon: '!',
    title: 'Improve resume format',
    message: 'Use clear section headers, bullet points, and include GitHub/LinkedIn links.'
  },
  lowExperience: {
    type: 'warn',
    icon: '!',
    title: 'Quantify your impact',
    message: 'Add numbers: "increased performance by 40%", "led team of 5", "reduced deploy time by 60%".'
  },
  strongSkills: {
    type: 'ok',
    icon: '✓',
    title: 'Good skill coverage',
    messageTemplate: (count) => `You match ${count} key skills. Highlight these prominently.`
  },
  atsTip: {
    type: 'info',
    icon: 'i',
    title: 'ATS tip',
    message: 'Use standard section names. Avoid tables or graphics — plain structured text scans best.'
  }
};

// ===== SCORE SUMMARIES =====
// Contextual messages based on overall score
export const SCORE_SUMMARIES = [
  'Strong alignment with this role. Apply with confidence.',
  'Solid match — a few keyword additions could push you higher.',
  'Decent overlap but missing several key skills the JD emphasizes.',
  'Significant gaps between your resume and the job requirements.',
  'Resume needs substantial work before applying for this role.'
];

// ===== THRESHOLDS =====
// Minimum values for various checks
export const THRESHOLDS = {
  minResumeLength: 40,
  minJDLength: 20,
  minMissingSkillsThreshold: 3,
  minMatchedSkillsThreshold: 5,
  maxMissingSkillsDisplay: 10,
  fileSizeLimitMB: 10,
  minKeywordMatchScore: 50,
  minFormatScore: 50,
  minExperienceScore: 60
};

// ===== JOB SEARCH PORTALS =====
// Configuration for job search links
export const JOB_PORTALS = [
  {
    name: 'LinkedIn',
    logo: 'in',
    color: '#0A66C2',
    searchType: 'keyword',
    region: 'worldwide'
  },
  {
    name: 'Naukri',
    logo: 'N',
    color: '#FF7555',
    searchType: 'location',
    region: 'india'
  },
  {
    name: 'Google for Jobs',
    logo: 'G',
    color: '#4285F4',
    searchType: 'aggregated',
    region: 'worldwide'
  },
  {
    name: 'Indeed',
    logo: 'id',
    color: '#003A9B',
    searchType: 'role',
    region: 'india'
  },
  {
    name: 'Internshala',
    logo: 'IS',
    color: '#00AEEF',
    searchType: 'internship',
    region: 'india'
  },
  {
    name: 'Wellfound',
    logo: 'AL',
    color: '#7F77DD',
    searchType: 'startup',
    region: 'global'
  }
];

// ===== ANIMATION TIMINGS =====
// Durations for various animations (in milliseconds)
export const ANIMATION_TIMINGS = {
  fileUploadDelay: 300,
  analysisProcessingTime: 700,
  scoreAnimationDuration: 1300,
  barAnimationDelay: 120,
  ringAnimationDelay: 80,
  transitionDuration: 200
};

// ===== COLOR THEME =====
// CSS variables mapped to JavaScript
export const THEME_COLORS = {
  bg: '#0a0a0f',
  bg2: '#12121a',
  bg3: '#1a1a26',
  border: 'rgba(255, 255, 255, 0.08)',
  border2: 'rgba(255, 255, 255, 0.14)',
  text: '#f0eff8',
  text2: '#9896b0',
  text3: '#5a5870',
  accent: '#6c63ff',
  accent2: '#9d77ff',
  success: '#22d3a0',
  warning: '#f59e0b',
  danger: '#f43f5e'
};

// ===== SAMPLE DATA =====
// Default sample resume and job description
export const SAMPLE_RESUME = `Vishesh Vishwakarma
Software Engineer| Mumbai, India
vishesh8828@gmail.com | github.com/visheshvishh

SKILLS
Languages: Python, JavaScript, TypeScript, SQL
Frameworks: React.js, Node.js, FastAPI, Django
Databases: PostgreSQL, MySQL, Redis
Cloud: AWS (EC2, S3, RDS), Docker
Tools: Git, Jira, Linux, Postman

EXPERIENCE
Software Developer — TechCorp India, Pune (2021–2024)
• Built REST APIs in Python/FastAPI serving 100k daily requests
• Developed React.js dashboards with real-time analytics
• Managed PostgreSQL databases and complex SQL queries
• Deployed microservices with Docker on AWS EC2
• Worked in Agile sprints with daily standups

Junior Developer — StartupXYZ (2020–2021)
• Developed CRUD apps in Django and MySQL
• Created responsive UIs with React and Tailwind CSS

EDUCATION
Thakur Institute — Mumbai University, 2026`;

export const SAMPLE_JD = `Senior Full Stack Engineer — FinTech Platform

Requirements:
• 3+ years Python (FastAPI, Django)
• React.js, TypeScript, Next.js
• PostgreSQL, Redis, MongoDB
• AWS (EC2, S3, Lambda, RDS)
• Docker, Kubernetes
• REST API and GraphQL
• Agile / Scrum
• Strong communication skills

Nice to have: Machine learning, Kafka, Terraform, CI/CD`;

// ===== REGEX PATTERNS =====
// Regular expressions for text extraction
export const REGEX_PATTERNS = {
  experience: /(\d{4})\s*[–\-—]\s*(\d{4}|present|current)/gi,
  education: /(b\.?e\.?|b\.?tech|b\.?sc|m\.?tech|m\.?sc|mba|phd|bachelor|master|degree)[^\n,]*/i,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  jobRole: /engineer|developer|analyst|designer|manager|lead|architect|scientist/i,
  wordCount: /\s+/
};

// ===== EXPORT =====
// Make all constants available for import
export default {
  TECH_KEYWORDS,
  SCORE_WEIGHTS,
  GRADE_SCALE,
  FEEDBACK_TEMPLATES,
  SCORE_SUMMARIES,
  THRESHOLDS,
  JOB_PORTALS,
  ANIMATION_TIMINGS,
  THEME_COLORS,
  SAMPLE_RESUME,
  SAMPLE_JD,
  REGEX_PATTERNS
};
