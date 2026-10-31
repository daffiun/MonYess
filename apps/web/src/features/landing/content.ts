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
    legalName: 'MonYess Creative & Digital Lab',
    tagline: 'All in or not at all.',
    eyebrow: '[ Creative Digital & Product Studio ]',
    location: 'Amsterdam & Jakarta',
    address: 'Keizersgracht 421, Amsterdam / Senopati 38, Jakarta',
    coordinates: '52.3676° N, 4.9041° E — 6.2088° S, 106.8456° E',
    email: 'hello@monyess.studio',
    phone: '+31 (0)20 894 3210',
    telegramBot: '@monyess_bot',
    stats: {
      team: '24+ digital makers',
      founded: '2022',
      showreelDuration: '1:03',
    },
  },

  hero: {
    eyebrow: '[ Creative Digital & Financial Product Lab ]',
    headline: 'WE SHAPE DIGITAL MOMENTUM.',
    meta: [
      { label: 'This is us', value: 'MonYess Lab' },
      { label: 'Craft', value: '24+ digital people' },
      { label: 'Base', value: 'Amsterdam & Jakarta' },
      { label: 'Status', value: 'Available Q1/Q2' },
    ],
    videoPlaceholder: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-ink-fluid-swirling-in-water-43330-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  },

  intro: {
    badge: '[ We are MONYESS ]',
    headline: 'A creative digital agency that goes all in or not at all.',
    description:
      'We blend editorial design, high-frequency engineering, and behavioral gamification to build digital products and financial experiences people actually obsess over. No corporate fluff. No bloated retainers. Just pure creative punch and measurable impact.',
  },

  featuredWork: [
    {
      id: 'apex-vault',
      title: 'Apex Global Wealth',
      client: 'Apex Financial Technologies',
      year: '2024',
      tags: ['FinTech', 'Web Platform', 'Design System'],
      description: 'Next-generation institutional portfolio terminal with sub-second execution and biometric visualization.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=800&q=80',
      award: 'Site of the Day — Awwwards',
      link: '#',
    },
    {
      id: 'veloce-motors',
      title: 'Veloce Hypercars',
      client: 'Veloce Automobili',
      year: '2024',
      tags: ['Branding', '3D Experience', 'E-commerce'],
      description: 'Ultra-luxury electric vehicle configurator with real-time WebGL aerodynamics and tactile sound design.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
      award: 'FWA of the Day',
      link: '#',
    },
    {
      id: 'orbit-sound',
      title: 'Orbit Spatial Audio',
      client: 'Orbit Acoustics',
      year: '2023',
      tags: ['Digital Product', 'Mobile App', 'Campaign'],
      description: 'Revolutionizing acoustic calibration through generative wave audio and spatial haptic feedback.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      award: 'CSSDA Best UI / UX',
      link: '#',
    },
    {
      id: 'solstice-energy',
      title: 'Solstice Clean Grid',
      client: 'Solstice Energy EU',
      year: '2024',
      tags: ['Websites', 'Corporate', 'Data Viz'],
      description: 'Interactive pan-European renewable energy telemetry dashboard mapped in high-density live vector contours.',
      image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
      award: 'Webby Nominee',
      link: '#',
    },
    {
      id: 'monyess-bot',
      title: 'MonYess Telegram Engine',
      client: 'MonYess Autonomous Core',
      year: '2024',
      tags: ['AI Bots', 'FinTech', 'Experience'],
      description: 'Zero-friction financial logging via natural language Telegram bots, synced live with real-time analytics.',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      award: 'Studio Feature Project',
      link: '#',
    },
    {
      id: 'kinfolk-fashion',
      title: 'Atelier Nueve',
      client: 'Nueve Paris',
      year: '2023',
      tags: ['Branding', 'E-commerce', 'Editorial'],
      description: 'Minimalist editorial runway showcase with seamless checkout and micro-interactions.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      award: 'Awwwards Developer Award',
      link: '#',
    },
  ] as Project[],

  pitchdeck: {
    badge: '[ Our Manifesto & Deck ]',
    title: 'THE MONYESS BLUEPRINT 2025/2026',
    subtitle: 'Everything about our methodology, velocity, tech stack, and financial engineering pedigree.',
    slides: [
      {
        number: '01',
        title: 'Radical Simplicity',
        desc: 'Cutting 80% of interface clutter so users hit flow state in under 3 seconds.',
        preview: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        number: '02',
        title: 'High-Frequency UX',
        desc: 'Optimistic UI, instant local persistence, and intelligent micro-animations.',
        preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      },
      {
        number: '03',
        title: 'Habit Gamification',
        desc: 'Turning mundane routines into dopamine-driven financial mastery.',
        preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },

  whatWeDo: [
    {
      id: 'branding',
      name: 'Branding',
      tagline: 'Distinctive identities that cut through the digital noise.',
      image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
      services: [
        'Brand Strategy & Positioning',
        'Visual Identity Systems',
        'Typography & Type Design',
        'Editorial Art Direction',
        'Tone of Voice & Copywriting',
        'Packaging & Merchandising',
        'Motion Design Guidelines',
        'Brand Collateral & Books',
      ],
    },
    {
      id: 'digital',
      name: 'Digital & FinTech',
      tagline: 'Award-winning platforms engineered for sub-second joy.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      services: [
        'UI/UX Architecture & Prototyping',
        'Front-end Engineering (React, GSAP)',
        'FinTech Platforms & Dashboards',
        'Telegram Bots & Conversational UX',
        'E-commerce & Headless Shopify',
        'Micro-interactions & Creative Code',
        'Design Systems at Scale',
        'Performance & Web Vitals Audit',
      ],
    },
    {
      id: 'growth',
      name: 'Marketing & Scale',
      tagline: 'High-impact launches and obsessive retention loops.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      services: [
        'Launch Strategy & Keynotes',
        'Creative Campaign Direction',
        'SEO & Performance Content',
        'Gamified Retention Engines',
        'Paid Media Creative Assets',
        'Community & Viral Mechanics',
        'Conversion Rate Optimization',
        'Data Analytics & Heatmapping',
      ],
    },
  ] as ServiceCategory[],

  clients: [
    { name: 'KINETIC CAPITAL', category: 'Venture Fund' },
    { name: 'VOLT ENERGY', category: 'CleanTech' },
    { name: 'HYPERION LABS', category: 'AI Robotics' },
    { name: 'AURA FINTECH', category: 'Wealth Tech' },
    { name: 'NUEVE PARIS', category: 'Haute Horlogerie' },
    { name: 'TELEGRAM ECO', category: 'Bot Systems' },
    { name: 'NEO BANKING CO', category: 'Digital Bank' },
    { name: 'SYNAPSE HEALTH', category: 'Biomedical' },
  ],

  culture: {
    city: 'Amsterdam & Jakarta',
    headline: 'Based in the beating heart of Amsterdam & Jakarta.',
    description:
      'Two creative capitals, eight time zones, one unified obsession. From the historic canal lofts of Amsterdam to the high-velocity creative energy of Jakarta, our cross-continental team moves fast, thinks bold, and operates with zero pretension.',
    photos: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    ],
  },

  whoWeAre: {
    headline: 'Small team. Big energy. No fluff.',
    body:
      'We deliberately keep our core unit tight: senior architects, visionary art directors, and obsessive full-stack builders. When you work with MonYess, you speak directly with the people crafting your code and designing your pixels. No account managers. No lost translations.',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    ],
  },

  ourVibe: {
    headline: "Rock 'n roll minds with warm hearts.",
    subtitle:
      'We take our craft deathly seriously, but never ourselves. We celebrate loud victories, obsess over micro-details, and always leave our clients smiling.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
  },

  coreValues: [
    {
      number: '01',
      title: 'Think wild, craft sharp.',
      subtitle: 'Uncompromising standard',
      description:
        'Ideas should be courageous, boundary-pushing, and slightly intimidating. But execution must be razor-sharp, pixel-perfect, and built on rock-solid engineering.',
      badge: '[ Core Value 01 ]',
    },
    {
      number: '02',
      title: 'Keep it human.',
      subtitle: 'Empathy first',
      description:
        'Software exists for living, breathing people. If an interface causes confusion, it failed. We design digital empathy into every click, notification, and animation.',
      badge: '[ Core Value 02 ]',
    },
    {
      number: '03',
      title: 'Impact with heart.',
      subtitle: 'Purpose over hype',
      description:
        'We measure triumph not in vanity impressions, but in meaningful shifts: money saved, habits built, businesses accelerated, and delightful memories sparked.',
      badge: '[ Core Value 03 ]',
    },
    {
      number: '04',
      title: 'Everything we got.',
      subtitle: 'Zero half-measures',
      description:
        'We don’t do half-hearted deliverables or lukewarm solutions. Every engagement gets our utmost creative fury, relentless focus, and authentic care.',
      badge: '[ Core Value 04 ]',
    },
  ] as ValueItem[],

  whatWeBelieve: {
    headline: 'All in or nothing.',
    paragraph:
      'In a digital universe saturated with sterile AI templates and formulaic sameness, craft is the ultimate differentiator. The human touch, the deliberate rhythm of a scroll, the bespoke personality of an interaction—that is what builds legendary brands. We commit 100% of our creative heart, or we respectfully pass.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  },

  theWork: {
    headline: 'We design brands people feel.',
    subtext: 'Not just look at. Feel in their gut.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    caption: 'Art Direction & Editorial Typography for MonYess Studio 2025/2026',
  },

  awards: [
    { organisation: 'Awwwards', award: 'Site of the Day (SOTD)', count: '06', year: '2023-2024' },
    { organisation: 'FWA', award: 'FWA of the Day', count: '04', year: '2023-2024' },
    { organisation: 'CSS Design Awards', award: 'Best UI / UX / Innovation', count: '12', year: '2022-2024' },
    { organisation: 'The Webby Awards', award: 'Financial Services Nominee', count: '02', year: '2024' },
    { organisation: 'Red Dot Award', award: 'Brands & Communication Design', count: '03', year: '2023' },
  ] as AwardItem[],

  impactPartners: [
    { name: 'NEXTGEN IMPACT', tag: 'Sustainability' },
    { name: 'OPEN SOURCE COLLECTIVE', tag: 'Public Good' },
    { name: 'AMSTERDAM ART CO.', tag: 'Cultural' },
    { name: 'INDONESIA FINTECH FORUM', tag: 'Ecosystem' },
    { name: 'PLANET POSITIVE', tag: 'Climate Tech' },
  ],

  contact: {
    badge: '[ Get in touch ]',
    headline: "Say no more. It's a match.",
    phone: '+31 (0)20 894 3210',
    phoneAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    email: 'hello@monyess.studio',
    hours: 'Mon-Fri 09:00 - 18:00 CET / WIB',
  },
};
