// ==================== TAXONOMY ====================

export const INDUSTRY_CLUSTERS = [
  { id: 'digital-technology', name: 'Digital Technology', desc: 'Software, AI, data, cybersecurity, and IT infrastructure.', status: 'active' },
  { id: 'financial-services', name: 'Financial Services', desc: 'Banking, insurance, investment, and fintech.', status: 'active' },
  { id: 'management-entrepreneurship', name: 'Management & Entrepreneurship', desc: 'Business leadership, strategy, and startup operations.', status: 'active' },
  { id: 'advanced-manufacturing', name: 'Advanced Manufacturing', desc: 'Smart manufacturing, robotics, and Industry 4.0.', status: 'coming-soon' },
  { id: 'construction', name: 'Construction', desc: 'Building, civil engineering, and infrastructure.', status: 'coming-soon' },
  { id: 'supply-chain', name: 'Supply Chain & Transportation', desc: 'Logistics, warehousing, and fleet management.', status: 'coming-soon' },
  { id: 'arts-entertainment', name: 'Arts, Entertainment & Design', desc: 'Creative industries, media, and design.', status: 'coming-soon' },
  { id: 'hospitality', name: 'Hospitality, Events & Tourism', desc: 'Hotels, restaurants, events, and travel.', status: 'coming-soon' },
  { id: 'education', name: 'Education', desc: 'K-12, higher education, and EdTech.', status: 'coming-soon' },
  { id: 'healthcare', name: 'Healthcare & Human Services', desc: 'Clinical care, public health, and social services.', status: 'coming-soon' },
  { id: 'public-service', name: 'Public Service & Safety', desc: 'Government, law enforcement, and emergency services.', status: 'coming-soon' },
  { id: 'agriculture', name: 'Agriculture', desc: 'Farming, agtech, and food production.', status: 'coming-soon' },
  { id: 'energy', name: 'Energy & Natural Resources', desc: 'Oil, gas, renewables, and mining.', status: 'coming-soon' },
  { id: 'marketing-sales', name: 'Marketing & Sales', desc: 'Brand, demand gen, sales ops, and martech.', status: 'coming-soon' },
];

export const TAXONOMY = {
  'digital-technology': {
    pathways: [
      {
        id: 'business-info-mgmt',
        name: 'Business Information Management',
        roles: [
          {
            id: 'decision-science-analyst',
            name: 'AI-Augmented Decision Science Analyst',
            oneLiner: 'Combines AI modeling tools and statistical analysis to translate datasets into actionable recommendations.',
            sourceOccupations: [
              { title: 'Operations Research Analysts', contribution: 'Optimization modeling → AI-assisted modeling + output review' },
              { title: 'Statisticians', contribution: 'Statistical inference → hypothesis design and AI output validation' },
              { title: 'Economists', contribution: 'Economic frameworks → retains intuition; econometric work AI-assisted' },
            ],
            taskCategories: [
              {
                id: 'cat-j', code: 'J', name: 'AI Transformation Strategy',
                tasks: [
                  { id: 'n-j01', code: 'N-J01', name: 'AI Transformation Strategy & Roadmap', aiDoes: 'Models transformation scenarios and dependency chains', humanDoes: 'Defines strategic vision, designs governance framework', produces: 'AI transformation roadmap' },
                  { id: 'n-j02', code: 'N-J02', name: 'AI Investment ROI & Business Case Modeling', aiDoes: 'Aggregates industry ROI data, runs financial models', humanDoes: 'Designs modeling assumptions, validates benchmarks', produces: 'ROI models and business cases' },
                ],
              },
              {
                id: 'cat-k', code: 'K', name: 'Human-AI Collaboration Design',
                tasks: [
                  { id: 'n-k01', code: 'N-K01', name: 'Design Human-AI Collaboration Workflows', aiDoes: 'Models transformation scenarios and dependency chains', humanDoes: 'Defines strategic vision, designs governance framework, aligns AI ambition with business strategy', produces: 'Human-AI operating model' },
                  { id: 'n-k02', code: 'N-K02', name: 'AI Governance Framework Development', aiDoes: 'Scans regulatory requirements and best practices', humanDoes: 'Defines governance policies, risk appetite, ethical guidelines', produces: 'AI governance framework document' },
                ],
              },
              {
                id: 'cat-l', code: 'L', name: 'Organizational Change',
                tasks: [
                  { id: 'n-l01', code: 'N-L01', name: 'Change Management for AI Adoption', aiDoes: 'Analyzes organizational readiness data and sentiment', humanDoes: 'Designs change strategy, stakeholder engagement plan', produces: 'Change management roadmap' },
                ],
              },
            ],
          },
          {
            id: 'biz-strategy-consultant',
            name: 'AI-Augmented Business Strategy & Transformation Consultant',
            oneLiner: 'Leads digital transformation by combining AI tools with strategic business acumen.',
            sourceOccupations: [
              { title: 'Management Consultants', contribution: 'Strategy frameworks → AI-augmented scenario analysis' },
              { title: 'Business Analysts', contribution: 'Process mapping → AI-assisted workflow optimization' },
            ],
            taskCategories: [
              {
                id: 'cat-j', code: 'J', name: 'AI Transformation Strategy',
                tasks: [
                  { id: 'n-j01', code: 'N-J01', name: 'AI Transformation Strategy & Roadmap', aiDoes: 'Models transformation scenarios and dependency chains', humanDoes: 'Defines strategic vision, designs governance framework', produces: 'AI transformation roadmap' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'software-development',
        name: 'Software Development',
        roles: [
          {
            id: 'ai-software-engineer',
            name: 'AI-Augmented Software Engineer',
            oneLiner: 'Builds and maintains software systems with AI-powered development tools.',
            sourceOccupations: [
              { title: 'Software Developers', contribution: 'Code implementation → AI-assisted coding + code review' },
              { title: 'Web Developers', contribution: 'Frontend/backend → AI-generated components + testing' },
            ],
            taskCategories: [
              {
                id: 'cat-a', code: 'A', name: 'Software Architecture & Design',
                tasks: [
                  { id: 'n-a01', code: 'N-A01', name: 'System Architecture Design', aiDoes: 'Generates architecture diagrams and suggests patterns', humanDoes: 'Makes trade-off decisions, defines constraints', produces: 'Architecture design document' },
                  { id: 'n-a02', code: 'N-A02', name: 'API Design & Documentation', aiDoes: 'Generates API specs and documentation', humanDoes: 'Defines API contracts, versioning strategy', produces: 'API specification' },
                ],
              },
              {
                id: 'cat-b', code: 'B', name: 'Implementation & Testing',
                tasks: [
                  { id: 'n-b01', code: 'N-B01', name: 'Feature Implementation', aiDoes: 'Generates code, suggests implementations', humanDoes: 'Reviews code quality, makes design decisions', produces: 'Working feature implementation' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        roles: [
          {
            id: 'ai-security-analyst',
            name: 'AI-Augmented Security Analyst',
            oneLiner: 'Detects and responds to security threats using AI-powered analysis tools.',
            sourceOccupations: [
              { title: 'Information Security Analysts', contribution: 'Threat detection → AI-assisted anomaly analysis' },
            ],
            taskCategories: [
              {
                id: 'cat-c', code: 'C', name: 'Threat Analysis',
                tasks: [
                  { id: 'n-c01', code: 'N-C01', name: 'Threat Assessment & Response', aiDoes: 'Scans logs, detects anomalies, correlates events', humanDoes: 'Validates threats, prioritizes response, designs mitigation', produces: 'Threat assessment report' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'data-science',
        name: 'Data Science & Analytics',
        roles: [
          {
            id: 'ai-data-scientist',
            name: 'AI-Augmented Data Scientist',
            oneLiner: 'Builds predictive models and extracts insights using AI-enhanced analytical tools.',
            sourceOccupations: [
              { title: 'Data Scientists', contribution: 'Model building → AI-assisted feature engineering + hyperparameter tuning' },
              { title: 'Data Analysts', contribution: 'Data analysis → AI-powered insight generation' },
            ],
            taskCategories: [
              {
                id: 'cat-d', code: 'D', name: 'Predictive Modeling',
                tasks: [
                  { id: 'n-d01', code: 'N-D01', name: 'Predictive Model Development', aiDoes: 'Generates feature candidates, runs AutoML experiments', humanDoes: 'Defines business problem, selects approach, validates results', produces: 'Trained predictive model' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'it-infrastructure',
        name: 'IT Infrastructure & Cloud',
        roles: [
          {
            id: 'ai-cloud-engineer',
            name: 'AI-Augmented Cloud Engineer',
            oneLiner: 'Designs and manages cloud infrastructure with AI-powered optimization.',
            sourceOccupations: [
              { title: 'Cloud Engineers', contribution: 'Infrastructure management → AI-optimized resource allocation' },
            ],
            taskCategories: [
              {
                id: 'cat-e', code: 'E', name: 'Cloud Architecture',
                tasks: [
                  { id: 'n-e01', code: 'N-E01', name: 'Cloud Infrastructure Design', aiDoes: 'Recommends architectures, estimates costs', humanDoes: 'Defines requirements, makes vendor decisions', produces: 'Cloud architecture plan' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'financial-services': {
    pathways: [
      {
        id: 'fintech',
        name: 'Financial Technology',
        roles: [
          {
            id: 'ai-fintech-analyst',
            name: 'AI-Augmented FinTech Analyst',
            oneLiner: 'Analyzes financial data and builds models using AI-powered tools.',
            sourceOccupations: [
              { title: 'Financial Analysts', contribution: 'Financial modeling → AI-assisted forecasting' },
            ],
            taskCategories: [
              {
                id: 'cat-f', code: 'F', name: 'Financial Analysis',
                tasks: [
                  { id: 'n-f01', code: 'N-F01', name: 'Financial Modeling & Forecasting', aiDoes: 'Processes market data, generates forecasts', humanDoes: 'Validates assumptions, interprets results', produces: 'Financial forecast model' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'management-entrepreneurship': {
    pathways: [
      {
        id: 'startup-ops',
        name: 'Startup Operations',
        roles: [
          {
            id: 'ai-ops-manager',
            name: 'AI-Augmented Operations Manager',
            oneLiner: 'Manages operations using AI-powered workflow and resource optimization.',
            sourceOccupations: [
              { title: 'Operations Managers', contribution: 'Process management → AI-assisted optimization' },
            ],
            taskCategories: [
              {
                id: 'cat-g', code: 'G', name: 'Operations Design',
                tasks: [
                  { id: 'n-g01', code: 'N-G01', name: 'Operational Workflow Design', aiDoes: 'Maps current processes, identifies bottlenecks', humanDoes: 'Designs new workflows, assigns responsibilities', produces: 'Operational workflow document' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const DEFAULT_RESOURCES = {
  'n-k01': [
    { name: 'NASA Task Load Index Documentation', type: 'url', usage: 'Reference' },
    { name: 'BPMN Extension for Human-Agentic Workflows', type: 'url', usage: 'Reference' },
    { name: 'EU AI Act Article 14 Human Oversight', type: 'url', usage: 'Reference' },
  ],
};

export const RUBRIC_FRAMEWORKS = {
  'n-k01': {
    dimensions: [
      { id: 'deliverable-quality', name: 'Deliverable Quality', description: 'Did you produce all required artifacts in working condition?' },
      { id: 'analytical-rigor', name: 'Analytical Rigor', description: 'Are the analyses correct, consistent, and well-reasoned?' },
      { id: 'framework-design', name: 'Framework Design', description: 'Is the operating model comprehensive and configurable?' },
      { id: 'communication', name: 'Communication', description: 'Can the VP walk through it? Is it executive-ready?' },
      { id: 'ai-collaboration', name: 'AI Collaboration', description: 'Did you use AI tools effectively and critically?' },
      { id: 'prioritization', name: 'Prioritization', description: 'Did you focus on what matters?' },
    ],
  },
};

// ==================== STATUS MAPS ====================

export const STATUS_MAP = {
  draft: { label: 'Draft', color: 'brown-light' },
  pending: { label: 'Pending', color: 'orange' },
  published: { label: 'Published', color: 'accent-green' },
  active: { label: 'Active', color: 'accent-green' },
  completed: { label: 'Completed', color: 'accent-green' },
  submitted: { label: 'Submitted', color: 'blue' },
  idle: { label: 'Idle', color: 'brown-light' },
  expired: { label: 'Expired', color: 'red' },
  disqualified: { label: 'Disqualified', color: 'red' },
};

export const GRADE_SCALE = {
  A: { min: 93, max: 100, color: '#27825b' },
  B: { min: 85, max: 92, color: '#2e86c1' },
  C: { min: 75, max: 84, color: '#8b6914' },
  D: { min: 65, max: 74, color: '#d4880f' },
  F: { min: 0, max: 64, color: '#c0392b' },
};

// ==================== MOCK DATA ====================

export const MOCK_ROLES = [
  { id: 1, title: 'AI Research Engineer', dept: 'Research', status: 'active', salary: '$180k-$250k' },
  { id: 2, title: 'ML Platform Engineer', dept: 'Infrastructure', status: 'active', salary: '$160k-$220k' },
  { id: 3, title: 'AI Product Manager', dept: 'Product', status: 'draft', salary: '$150k-$200k' },
];

export const MOCK_CANDIDATES = [
  { id: 1, name: 'Alex Chen', email: 'alex@gmail.com', status: 'active', tz: 'PST', joined: 'Dec 2', avatar: 'AC', trials: 3, lastActive: '2 hours ago' },
  { id: 2, name: 'Sarah Kim', email: 'sarah@outlook.com', status: 'completed', tz: 'EST', joined: 'Dec 5', avatar: 'SK', trials: 2, lastActive: '1 day ago' },
  { id: 3, name: 'James Liu', email: 'jliu@pm.me', status: 'idle', tz: 'CST', joined: 'Dec 10', avatar: 'JL', trials: 1, lastActive: '5 days ago' },
  { id: 4, name: 'Priya Patel', email: 'priya@co.com', status: 'active', tz: 'IST', joined: 'Dec 12', avatar: 'PP', trials: 4, lastActive: '3 hours ago' },
];

export const MOCK_CHALLENGES = [
  {
    id: 'c1', name: 'LLM Fine-tuning', roleId: 1, roleTitle: 'AI Research Engineer',
    status: 'published', skill: 'Fine-tuning & RLHF', task: 'Implementation task',
    candIds: [1, 2],
    results: [
      { candId: 1, score: 91, grade: 'A', feedback: 'Strong approach.' },
      { candId: 2, score: 78, grade: 'C', feedback: 'Solid baseline.' },
    ],
  },
  {
    id: 'c2', name: 'Architecture Design', roleId: 1, roleTitle: 'AI Research Engineer',
    status: 'submitted', skill: 'Model Architecture', task: 'Design task',
    candIds: [1],
    results: [
      { candId: 1, score: 85, grade: 'B', feedback: 'Excellent design.' },
    ],
  },
  {
    id: 'c3', name: 'MLOps Pipeline', roleId: 2, roleTitle: 'ML Platform Engineer',
    status: 'published', skill: 'CI/CD for ML', task: 'Build task',
    candIds: [3, 4],
    results: [
      { candId: 3, score: 72, grade: 'D', feedback: 'Basic pipeline.' },
      { candId: 4, score: 95, grade: 'A', feedback: 'Outstanding.' },
    ],
  },
];

// ==================== ROLE DB ====================

export var ROLE_DB = [
  {
    id: 'ai-research-engineer',
    title: 'AI Research Engineer',
    oneLiner: 'Design and build frontier AI systems for large-scale ML experiments.',
    sources: ['Machine Learning Engineers', 'Research Scientists'],
    skills: [
      { name: 'Model Architecture', subs: ['Transformer design', 'Attention variants', 'Architecture search', 'Model compression', 'Multi-modal fusion', 'Efficiency optimization', 'Scaling laws'] },
      { name: 'Training at Scale', subs: ['Distributed training', 'Mixed precision', 'Gradient accumulation', 'Data parallelism', 'Pipeline parallelism', 'Checkpoint management', 'Training monitoring'] },
      { name: 'Fine-tuning & RLHF', subs: ['LoRA/QLoRA', 'RLHF pipeline', 'DPO implementation', 'Reward modeling', 'Instruction tuning', 'Alignment evaluation', 'Preference learning'] },
      { name: 'Evaluation Design', subs: ['Benchmark creation', 'Human evaluation', 'Automated metrics', 'A/B testing', 'Statistical significance', 'Bias detection', 'Safety evaluation'] },
    ],
  },
  {
    id: 'ml-platform-engineer',
    title: 'ML Platform Engineer',
    oneLiner: 'Build and maintain ML infrastructure for model training and serving at scale.',
    sources: ['Software Engineers', 'DevOps Engineers', 'Site Reliability Engineers'],
    skills: [
      { name: 'ML Infrastructure', subs: ['Training pipelines', 'Feature stores', 'Model registry', 'Experiment tracking', 'GPU cluster management'] },
      { name: 'Model Serving', subs: ['Inference optimization', 'Batch prediction', 'Real-time serving', 'A/B testing infrastructure', 'Canary deployments'] },
    ],
  },
  {
    id: 'ai-product-manager',
    title: 'AI Product Manager',
    oneLiner: 'Bridge technical AI capabilities with business outcomes and user needs.',
    sources: ['Product Managers', 'Technical Program Managers'],
    skills: [
      { name: 'AI Product Strategy', subs: ['Roadmap planning', 'Feasibility assessment', 'Build vs buy', 'Market analysis', 'Competitive positioning'] },
    ],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    oneLiner: 'Apply statistical analysis and ML to extract insights and drive decisions.',
    sources: ['Statisticians', 'Data Analysts', 'Research Scientists'],
    skills: [
      { name: 'Statistical Modeling', subs: ['Regression', 'Classification', 'Bayesian methods', 'Causal inference', 'Time series'] },
    ],
  },
  {
    id: 'nlp-engineer',
    title: 'NLP Engineer',
    oneLiner: 'Build natural language processing systems for text understanding and generation.',
    sources: ['Software Engineers', 'Computational Linguists'],
    skills: [
      { name: 'Language Models', subs: ['Fine-tuning', 'Prompt engineering', 'RAG systems', 'Embeddings', 'Tokenization'] },
    ],
  },
];

export function matchRole(inputText) {
  var text = inputText.toLowerCase();
  var bestMatch = ROLE_DB[0];
  var bestScore = 0;

  ROLE_DB.forEach(function (role) {
    var score = 0;
    role.title.toLowerCase().split(/\s+/).forEach(function (word) {
      if (text.indexOf(word) >= 0) score += 2;
    });
    role.oneLiner.toLowerCase().split(/\s+/).forEach(function (word) {
      if (word.length > 4 && text.indexOf(word) >= 0) score += 1;
    });
    role.sources.forEach(function (src) {
      src.toLowerCase().split(/\s+/).forEach(function (word) {
        if (word.length > 4 && text.indexOf(word) >= 0) score += 1;
      });
    });
    if (score > bestScore) { bestMatch = role; bestScore = score; }
  });

  return { role: bestMatch, score: bestScore };
}

// ==================== AI CHAT ====================

export var AI_ACKS = [
  'Got it.',
  'Great choice.',
  'Perfect.',
  'Noted.',
  'Makes sense.',
];

export const ROLE_CREATION_QUESTIONS = [
  { id: 'title', question: 'What is the title of this role?', chips: ['AI Research Engineer', 'ML Engineer', 'Data Scientist', 'AI Product Manager', 'NLP Engineer'] },
  { id: 'own', question: 'What will this person mainly own?', chips: ['Model training', 'ML infrastructure', 'Research', 'Product features', 'Safety'] },
  { id: 'skills', question: 'What are the most important skills?', chips: ['Python/PyTorch', 'Research papers', 'System design', 'Product sense', '5+ years ML'] },
  { id: 'level', question: 'What experience level are you looking for?', chips: ['Junior (1-3 yr)', 'Mid (3-5 yr)', 'Senior (5+ yr)', 'Staff+'] },
  { id: 'extra', question: 'Remote policy and compensation range?', chips: ['Remote', 'Hybrid', 'On-site', '$150-250k', '$250k+'] },
];

export const SEARCH_CATEGORIES = [
  { label: 'Role', icon: 'Briefcase', emoji: '\uD83C\uDFE2', opts: [
    { label: 'AI Research Engineer', prompt: 'AI Research Engineer for large-scale ML experiments' },
    { label: 'ML Platform Engineer', prompt: 'ML Platform Engineer for model training and serving infra' },
    { label: 'AI Product Manager', prompt: 'AI Product Manager bridging technical and business' },
    { label: 'Data Scientist', prompt: 'Senior Data Scientist for experiment design and causal inference' },
    { label: 'NLP Engineer', prompt: 'NLP Engineer for large language model development' },
  ]},
  { label: 'Level', icon: 'BarChart3', emoji: '\uD83D\uDCCA', opts: [
    { label: 'Junior', prompt: 'Junior, 1-3 years experience' },
    { label: 'Mid', prompt: 'Mid-level, 3-5 years experience' },
    { label: 'Senior', prompt: 'Senior, 5+ years experience' },
    { label: 'Staff+', prompt: 'Staff/Principal level, 8+ years' },
  ]},
  { label: 'Skills', icon: 'Target', emoji: '\uD83C\uDFAF', opts: [
    { label: 'PyTorch', prompt: 'Strong PyTorch and deep learning skills' },
    { label: 'LLM', prompt: 'LLM fine-tuning, RLHF, and prompt engineering' },
    { label: 'System Design', prompt: 'Distributed systems for ML at scale' },
    { label: 'Data Engineering', prompt: 'Data pipeline design and optimization' },
    { label: 'MLOps', prompt: 'ML deployment, monitoring, and CI/CD' },
  ]},
  { label: 'Location', icon: 'MapPin', emoji: '\uD83D\uDCCD', opts: [
    { label: 'Remote', prompt: 'Fully remote' },
    { label: 'SF Bay Area', prompt: 'San Francisco Bay Area, hybrid' },
    { label: 'NYC', prompt: 'New York City' },
    { label: 'London', prompt: 'London, UK' },
  ]},
];

export const SEMANTIC_PILLS = [
  { key: 'role', label: 'Role', keywords: ['engineer', 'scientist', 'manager', 'developer', 'researcher', 'analyst', 'consultant', 'architect'] },
  { key: 'skills', label: 'Skills', keywords: ['python', 'pytorch', 'ml', 'nlp', 'llm', 'kubernetes', 'react', 'sql', 'tensorflow'] },
  { key: 'exp', label: 'Experience', keywords: ['junior', 'senior', 'staff', 'years', 'mid', 'principal', 'lead', 'entry'] },
  { key: 'loc', label: 'Location', keywords: ['remote', 'hybrid', 'sf', 'nyc', 'london', 'onsite', 'distributed'] },
  { key: 'comp', label: 'Compensation', keywords: ['salary', '$', 'equity', '150k', '250k', '200k', 'comp', 'bonus'] },
];

// ==================== SIDEBAR NAV ====================

export const SIDEBAR_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'roles', label: 'Roles', icon: 'Briefcase', href: '/roles' },
  { id: 'challenges', label: 'Challenges', icon: 'Trophy', href: '/assessment' },
  { id: 'candidates', label: 'Candidates', icon: 'Users', href: '/candidates' },
  { id: 'evaluation', label: 'Evaluation', icon: 'BarChart3', href: '/evaluation' },
];

// ==================== WIZARD STEPS ====================

export const WIZARD_STEPS = [
  { id: 'role', label: 'Role', index: 0 },
  { id: 'cluster', label: 'Cluster', index: 1 },
  { id: 'pathway', label: 'Pathway', index: 2 },
  { id: 'task', label: 'Task', index: 3 },
  { id: 'context', label: 'Context', index: 4 },
  { id: 'environment', label: 'Environment', index: 5 },
  { id: 'candidates', label: 'Candidates', index: 6 },
  { id: 'review', label: 'Review', index: 7 },
];

// ==================== TIMEZONES ====================

export const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST)', flag: '🇺🇸', short: 'PST' },
  { value: 'America/Denver', label: 'Mountain Time (MST)', flag: '🇺🇸', short: 'MST' },
  { value: 'America/Chicago', label: 'Central Time (CST)', flag: '🇺🇸', short: 'CST' },
  { value: 'America/New_York', label: 'Eastern Time (EST)', flag: '🇺🇸', short: 'EST' },
  { value: 'Europe/London', label: 'GMT (London)', flag: '🇬🇧', short: 'GMT' },
  { value: 'Europe/Berlin', label: 'CET (Berlin)', flag: '🇩🇪', short: 'CET' },
  { value: 'Asia/Kolkata', label: 'IST (India)', flag: '🇮🇳', short: 'IST' },
  { value: 'Asia/Shanghai', label: 'CST (China)', flag: '🇨🇳', short: 'CST' },
  { value: 'Asia/Tokyo', label: 'JST (Japan)', flag: '🇯🇵', short: 'JST' },
  { value: 'Australia/Sydney', label: 'AEST (Sydney)', flag: '🇦🇺', short: 'AEST' },
];
