export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
  description: string;
  image: string;
  secondaryImage?: string;
  video?: string;
  award?: string;
  link: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  image: string;
  services: string[];
}

export interface ValueItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface AwardItem {
  organisation: string;
  award: string;
  count: string;
  year: string;
}

export const LANDING_CONTENT = {
  brand: {
    name: 'MONYESS',
    legalName: 'MonYess — Personal Finance Tracker',
    tagline: 'Your money, gamified.',
    eyebrow: '[ Personal Finance • Telegram Bot • Habit Engine ]',
    location: 'Indonesia',
    address: 'Crafted with precision from Indonesia 🇮🇩',
    coordinates: '6.2088° S, 106.8456° E (Jakarta / WIB)',
    email: 'daffiahmad.dev@gmail.com',
    phone: 'github.com/daffiahmad',
    githubUrl: 'https://github.com/daffiahmad',
    githubHandle: 'daffiahmad',
    telegramBot: '@monyess_bot',
    stats: {
      team: '1 solo builder',
      founded: '2024',
      showreelDuration: '1:03',
    },
  },

  hero: {
    eyebrow: '[ Personal Finance Tracker • Portfolio Edition ]',
    headline: 'TRACK SMARTER. SPEND WISER.',
    meta: [
      { label: 'Project', value: 'MonYess v1.0' },
      { label: 'Builder', value: 'Daffi Ahmad (Solo)' },
      { label: 'Stack', value: 'React + Supabase' },
      { label: 'Origin', value: 'Indonesia 🇮🇩' },
    ],
    videoPlaceholder: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-ink-fluid-swirling-in-water-43330-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  },

  intro: {
    badge: '[ What is MonYess ]',
    headline: 'A personal finance tracker that makes saving money actually feel good.',
    description:
      'MonYess is a modern full-stack web application designed for anyone tired of bloated spreadsheets and cold finance apps. Log your daily spending effortlessly via Telegram in seconds, set categorical budgets, track savings goals, and level up your financial habits with real-time gamification. Zero fluff. Zero subscriptions. Pure financial clarity.',
  },

  featuredWork: [
    {
      id: 'dashboard-analytics',
      title: 'Financial Health Dashboard',
      client: 'Core Analytics Engine',
      year: '2024',
      tags: ['React 18', 'Recharts', 'Financial Health'],
      description: 'A high-clarity command center that visualizes your net worth, income vs expense velocity, and spending distribution across custom time windows.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=800&q=80',
      award: 'Interactive Recharts Viz',
      link: '/login',
    },
    {
      id: 'telegram-logging',
      title: 'Zero-Friction Telegram Bot',
      client: 'Conversational Input',
      year: '2024',
      tags: ['Telegram Bot API', 'NLP Parsing', 'Instant Sync'],
      description: 'Type "kopi 25k" or "gaji 8jt" straight into Telegram. MonYess extracts amounts, dates, and categories automatically, syncing with your cloud database in milliseconds.',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      award: 'Natural Language Engine',
      link: 'https://t.me/monyess_bot',
    },
    {
      id: 'budgets-goals',
      title: 'Smart Budgets & Milestones',
      client: 'Financial Planning',
      year: '2024',
      tags: ['Progress Tracking', 'Category Limits', 'Overspend Alerts'],
      description: 'Set category spending limits that adapt to your monthly cycle. Create visual savings goals and watch animated progress rings advance as you stay disciplined.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
      award: 'Dynamic Progress Meters',
      link: '/login',
    },
    {
      id: 'gamification-streaks',
      title: 'Habit Engine & Gamification',
      client: 'Behavioral Psychology',
      year: '2024',
      tags: ['XP Levels', 'Daily Streaks', 'Achievement Badges'],
      description: 'Financial discipline is hard; gamification makes it sticky. Earn XP for continuous logging, maintain day streaks, and unlock milestone badges as your savings grow.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      award: 'Dopamine-Driven Habits',
      link: '/login',
    },
    {
      id: 'reports-export',
      title: 'Detailed Reports & Data Portability',
      client: 'Data Governance',
      year: '2024',
      tags: ['CSV / PDF Export', 'PapaParse', 'Zero Lock-In'],
      description: 'Your financial ledger belongs to you. Generate comprehensive monthly breakdown reports and export complete transaction histories with a single click.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      award: 'Full Data Sovereignty',
      link: '/login',
    },
    {
      id: 'debts-recurring',
      title: 'Debt Tracker & Recurring Bills',
      client: 'Cashflow Automation',
      year: '2024',
      tags: ['Accounts Payable', 'Reminders', 'Installments'],
      description: 'Track who owes you and what you owe with status tags and due dates. Automate recurring monthly commitments like subscriptions and rent without manual hassle.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      award: 'Automated Schedules',
      link: '/login',
    },
  ] as Project[],

  pitchdeck: {
    badge: '[ Under The Hood • Architecture ]',
    title: 'THE MONYESS ARCHITECTURE',
    subtitle: 'A clean, high-velocity full-stack system designed to let one developer ship fast, maintain strict types, and guarantee data security.',
    slides: [
      {
        number: '01',
        title: 'pnpm Workspace Monorepo',
        desc: 'Web dashboard, Telegram bot worker, and shared type definitions organized in a modular monorepo for maximum reusability and zero configuration drift.',
        preview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      },
      {
        number: '02',
        title: 'Supabase PostgreSQL & RLS',
        desc: 'PostgreSQL relational engine with strict Row Level Security (RLS) policies guaranteeing every user can only read and write their own encrypted financial records.',
        preview: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      },
      {
        number: '03',
        title: 'React 18 + Vite + GSAP',
        desc: 'Sub-second dev server HMR, route-level code splitting, 60fps Lenis smooth scrolling, and reactive micro-interactions that feel like native software.',
        preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },

  whatWeDo: [
    {
      id: 'finance-core',
      name: 'Financial Core',
      tagline: 'All your accounts, categories, and cash flows unified in one view.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      services: [
        'Multi-account balances (Cash, Bank, E-wallet)',
        'Custom categories & hierarchical tagging',
        'Visual cash flow & net worth telemetry',
        'Income & expense breakdown analytics',
        'Comprehensive transaction filtering & search',
        'Optimistic UI updates for instant feedback',
        'CSV batch import & one-click export',
        'Supabase Realtime cloud synchronization',
      ],
    },
    {
      id: 'telegram-bot',
      name: 'Telegram Bot',
      tagline: 'Conversational logging right where you already spend your day.',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
      services: [
        'Natural language amount & description extraction',
        'Instant transaction entry under 2 seconds',
        'Quick balance inquiry via slash commands',
        'Intelligent category auto-matching',
        'Real-time daily budget threshold alerts',
        'Interactive inline keyboard confirmation',
        'Webhooks secured with cryptographic tokens',
        'Zero app-switching needed to record expenses',
      ],
    },
    {
      id: 'gamification',
      name: 'Habit Engine',
      tagline: 'Turning financial mindfulness into a genuinely rewarding game.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      services: [
        'Experience Points (XP) reward system',
        'Consecutive daily logging streaks',
        'Custom collectible achievement badges',
        'Milestone level progression (Novice to Vaultmaster)',
        'Category budget survival challenges',
        'Gamified savings goals with dynamic progress',
        'Weekly financial health scores',
        'Gentle nudge notifications for consistency',
      ],
    },
  ] as ServiceCategory[],

  clients: [
    { name: 'REACT 18', category: 'Frontend' },
    { name: 'TYPESCRIPT', category: 'Type Safety' },
    { name: 'VITE', category: 'Build Tool' },
    { name: 'SUPABASE', category: 'Postgres & Auth' },
    { name: 'TAILWIND CSS', category: 'Styling' },
    { name: 'GSAP 3', category: 'Creative Motion' },
    { name: 'LENIS', category: 'Smooth Scroll' },
    { name: 'TELEGRAM API', category: 'Bot Platform' },
    { name: 'RECHARTS', category: 'Data Viz' },
    { name: 'ZOD & HOOK FORM', category: 'Form Validation' },
    { name: 'PAPAPARSE', category: 'CSV Engine' },
    { name: 'PNPM WORKSPACE', category: 'Monorepo' },
  ],

  culture: {
    city: 'Indonesia',
    headline: 'Built from scratch in Indonesia, for anyone who has ever asked "Where did my money go?"',
    description:
      'MonYess was born out of personal frustration. Spreadsheets felt like tedious homework, while commercial finance apps were filled with invasive ads, subscription paywalls, and bloated menus. I wanted a personal tracker that fit the way I actually lived: send a quick text in Telegram, glance at clean charts on the web, and get a gentle burst of dopamine when staying within budget. One solo builder, one clear vision.',
    photos: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    ],
  },

  whoWeAre: {
    headline: 'One developer. One obsession. No shortcuts.',
    body:
      'Hi, I’m Daffi Ahmad — a full-stack engineer and designer based in Indonesia. MonYess represents my commitment to building digital tools that bridge powerful system architecture with expressive, award-winning frontend design. Every database schema, Telegram webhook, and animated pixel was engineered by hand.',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    ],
  },

  ourVibe: {
    headline: 'Obsessed with details that make boring routines feel effortless.',
    subtitle:
      'Personal finance is traditionally seen as clinical and exhausting. MonYess aims to redefine that relationship — proving that a daily budgeting tool can possess tactile character, effortless velocity, and genuine craft.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  },

  coreValues: [
    {
      number: '01',
      title: 'Friction is the enemy.',
      subtitle: 'Zero Barrier to Entry',
      description:
        'The best financial tracker is the one you actually stick with. That is why the Telegram bot exists: so logging an expense takes fewer than three seconds without opening a heavyweight app.',
      badge: '[ Principle 01 ]',
    },
    {
      number: '02',
      title: 'Radical clarity.',
      subtitle: 'No Financial Obfuscation',
      description:
        'Dashboards should illuminate, not confuse. Complex balances are translated into intuitive visual contours and color-coded telemetry that anyone can understand in an instant.',
      badge: '[ Principle 02 ]',
    },
    {
      number: '03',
      title: 'Consistency over perfection.',
      subtitle: 'Behavioral Psychology',
      description:
        'Small daily actions compound into lifelong freedom. XP, badges, and streaks celebrate your dedication to showing up every day, turning financial tracking from a chore into a rewarding habit.',
      badge: '[ Principle 03 ]',
    },
    {
      number: '04',
      title: 'Your data, your sovereignty.',
      subtitle: 'Zero Lock-In',
      description:
        'Your financial history is private and sacred. MonYess stores data in your own isolated Supabase database with Row Level Security, and lets you export everything in open standard formats whenever you want.',
      badge: '[ Principle 04 ]',
    },
  ] as ValueItem[],

  whatWeBelieve: {
    headline: 'Build for yourself first.',
    paragraph:
      'The most enduring tools in software history were built by developers solving their own immediate struggles. MonYess wasn’t created to satisfy a boardroom pitch or inflate vanity metrics. It was built for real everyday utility, tested against real monthly expenses, and refined with obsessive care for craftsmanship.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  },

  theWork: {
    headline: 'We built a finance app people actually open.',
    subtext: 'Not just download and forget. Actually open and use every day.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    caption: 'MonYess Personal Finance Tracker • Portfolio Edition 2024 / 2025',
  },

  awards: [
    { organisation: 'Architecture', award: 'pnpm Workspace Monorepo — Web App + Telegram Bot + Shared Packages', count: 'MODULAR', year: '2024' },
    { organisation: 'Performance', award: 'Vite Route-level Code Splitting & Sub-second HMR Dev Environment', count: '<420KB', year: '2024' },
    { organisation: 'Security', award: 'PostgreSQL with Row Level Security (RLS) guaranteeing strict data isolation', count: 'RLS SECURED', year: '2024' },
    { organisation: 'Conversational', award: 'Telegram Natural Language Parser for instant expense logging & category tagging', count: '<2s LOG', year: '2024' },
    { organisation: 'Interaction', award: '60fps Lenis Smooth Scrolling paired with GSAP ScrollTrigger micro-animations', count: '60 FPS', year: '2024' },
  ] as AwardItem[],

  impactPartners: [
    { name: 'TRANSACTIONS', tag: 'Realtime Ledger' },
    { name: 'TELEGRAM BOT', tag: 'Natural Language' },
    { name: 'CATEGORICAL BUDGETS', tag: 'Adaptive Limits' },
    { name: 'SAVINGS GOALS', tag: 'Progress Rings' },
    { name: 'GAMIFICATION ENGINE', tag: 'XP & Streaks' },
    { name: 'DEBT TRACKER', tag: 'Payable & Receivable' },
    { name: 'RECURRING BILLS', tag: 'Automated Schedules' },
    { name: 'CSV / PDF EXPORT', tag: 'Zero Lock-In' },
    { name: 'RECHARTS ANALYTICS', tag: 'Cash Flow Telemetry' },
    { name: 'SUPABASE RLS', tag: 'Enterprise Security' },
  ],

  contact: {
    badge: '[ Open Source • Connect & Inquire ]',
    headline: "Like what you see? Let's connect.",
    phone: 'github.com/daffiahmad',
    githubUrl: 'https://github.com/daffiahmad',
    githubHandle: 'daffiahmad',
    phoneAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    email: 'daffiahmad.dev@gmail.com',
    hours: 'Open Source Portfolio • Available for Fullstack Opportunities',
  },
};
