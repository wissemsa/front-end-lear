import heroPortraitImg from '../assets/images/hero_developer_portrait_1791190010652.jpg';
import projectFintechImg from '../assets/images/project_fintech_platform_1791190023669.jpg';
import projectSpatialImg from '../assets/images/project_spatial_studio_1791190032949.jpg';
import projectHealthImg from '../assets/images/project_health_telemetry_1791190051168.jpg';
import projectDesignImg from '../assets/images/project_design_system_1791190066480.jpg';

export interface HeroMetric {
  id: string;
  value: string;
  label: string;
  context: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Systems & FinTech' | 'Spatial & Audio' | 'Mobile & Biometrics' | 'Design Systems';
  year: string;
  clientOrContext: string;
  role: string;
  featuredWide: boolean;
  imageUrl: string;
  summary: string;
  challenge: string;
  architecture: string;
  outcomeMetric: string;
  technologies: string[];
  liveUrl: string;
  repoUrl: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  timeline: string;
  investmentRange: string;
  idealFor: string;
  proofHighlight: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  impactSummary: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  beforeState: string;
  outcomeMetric: string;
  authorName: string;
  authorRole: string;
  organization: string;
}

export interface SocialLinksConfig {
  github: string;
  linkedin: string;
  xTwitter: string;
  dribbble: string;
  whatsappNumber: string;
  resumeUrl: string;
}

export interface EmailJSConfigData {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string;
}

export interface PortfolioConfig {
  themeMode: 'warm-paper' | 'stark-black';
  accentColor: '#2563EB' | '#E11D48' | '#F2B705';
  userInfo: {
    wordmark: string;
    fullName: string;
    primaryTitle: string;
    rotatingRoles: string[];
    heroHeadline: string;
    heroEditorialAccent: string;
    heroSubheadline: string;
    signatureText: string;
    location: string;
    availabilityText: string;
    email: string;
    phone: string;
    heroImageUrl: string;
    heroImageCaption: string;
    aboutLead: string;
    aboutBody: string;
    coreDisciplines: string[];
    marqueeItems: string[];
  };
  metrics: HeroMetric[];
  projects: ProjectItem[];
  services: ServiceItem[];
  experiences: ExperienceItem[];
  testimonials: TestimonialItem[];
  socials: SocialLinksConfig;
  emailJs: EmailJSConfigData;
}

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  themeMode: 'warm-paper',
  accentColor: '#2563EB',
  userInfo: {
    wordmark: 'Kaelen Vance',
    fullName: 'Kaelen Vance',
    primaryTitle: 'Principal Product Architect & Cross-Platform Systems Engineer',
    rotatingRoles: [
      'Cross-Platform Flutter & Web Systems',
      'Zero-Latency Financial Interfaces',
      'Multi-Brand Design Compilers',
      'Native Mobile & Spatial Products'
    ],
    heroHeadline: 'Architecting resilient software with',
    heroEditorialAccent: 'editorial precision.',
    heroSubheadline:
      'I partner with engineering-led founders and product teams to design, build, and scale high-frequency web, Flutter, and native applications—combining rigorous distributed systems with tactile interface craft.',
    signatureText: 'K. Vance — Studio Practice',
    location: 'Zurich & San Francisco · Remote Worldwide',
    availabilityText: 'Booking Q4/Q1 Architecture & Product Sprints',
    email: 'egostore777@gmail.com',
    phone: '+1 (415) 890-4321',
    heroImageUrl: heroPortraitImg,
    heroImageCaption: 'Studio Session · Zurich Architectural Lab · 35mm Editorial',
    aboutLead:
      'Over the past nine years, I have bridged the gap between deep systems engineering and high-taste industrial interface design across 18 production launches.',
    aboutBody:
      'Whether leading a zero-to-one cross-platform Flutter flagship, re-architecting a real-time WebSocket trading terminal, or unifying a multi-platform design token compiler, my work treats performance latency and visual clarity as a single inseparable discipline. Every pixel and state transition is engineered for zero-latency human feedback.',
    coreDisciplines: [
      'Flutter & Dart Multi-Platform',
      'TypeScript & React 19 Architecture',
      'Rust & Go Edge Services',
      'WebGL & Custom Shaders',
      'Design Systems & Token Compilers',
      'High-Frequency State Management',
      'Mobile Performance Profiling',
      'CI/CD & Release Automation'
    ],
    marqueeItems: [
      'selected works',
      'case studies',
      'cross-platform architecture',
      'design systems',
      'realtime telemetry',
      'product engineering'
    ]
  },
  metrics: [
    {
      id: 'm1',
      value: '4.8M+',
      label: 'Active Monthly End-Users',
      context: 'Across 18 shipped web & mobile products (2019–2026)'
    },
    {
      id: 'm2',
      value: '99.98%',
      label: 'Crash-Free Production Sessions',
      context: 'Verified across iOS, Android, and Web targets'
    },
    {
      id: 'm3',
      value: '-64%',
      label: 'Median Frame Render Latency',
      context: 'Achieved via custom render pipelines & state isolation'
    }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Aurelia Institutional Treasury & Liquidity Terminal',
      subtitle: 'Unified desktop, web, and mobile execution platform for institutional asset desks',
      category: 'Systems & FinTech',
      year: '2026',
      clientOrContext: 'Aurelia Financial Technologies (Zurich)',
      role: 'Lead Cross-Platform Architect',
      featuredWide: true,
      imageUrl: projectFintechImg,
      summary:
        'A single-codebase institutional treasury terminal streaming 12,000+ order-book ticks per second at locked 120fps across macOS, WebAssembly, and iOS.',
      challenge:
        'Legacy multi-vendor desktop terminals suffered from 380ms state synchronization lag during high-volatility market opens and required three separate engineering teams to maintain.',
      architecture:
        'Engineered a custom isolate-backed streaming ingestion layer paired with a hardware-accelerated canvas grid and deterministic state snapshots, unifying Web, Desktop, and Mobile into one cohesive codebase.',
      outcomeMetric: '+142% institutional desk adoption in 6 months · Sub-8ms tick-to-pixel latency',
      technologies: ['Flutter Web & Desktop', 'Dart Isolates', 'TypeScript', 'WebSockets', 'Rust Gateway', 'WebGL'],
      liveUrl: 'https://aurelia-terminal.example.com',
      repoUrl: 'https://github.com/kaelenvance/aurelia-treasury-engine'
    },
    {
      id: 'p2',
      title: 'Klangwerk Spatial DAW & Hardware Bridge',
      subtitle: 'Tactile spatial audio workstation with zero-jitter MIDI/OSC hardware synchronization',
      category: 'Spatial & Audio',
      year: '2025',
      clientOrContext: 'Klangwerk Acoustics (Berlin)',
      role: 'Principal Interface & DSP Systems Engineer',
      featuredWide: false,
      imageUrl: projectSpatialImg,
      summary:
        'Real-time 3D binaural mixing console and companion rotary hardware controller interface built for film composers and sound designers.',
      challenge:
        'Translating complex 64-channel ambisonic spatialization parameters into an intuitive, glare-free studio surface capable of running at 120Hz alongside USB-C rotary hardware.',
      architecture:
        'Built custom GPU-accelerated vector metering shaders and a lock-free ring buffer bridge between the C++ audio engine and the reactive UI layer.',
      outcomeMetric: '85,000+ studio installations · 1.9ms hardware-to-screen response time',
      technologies: ['Flutter CustomPainter', 'C++ FFI', 'GLSL Shaders', 'WebAudio', 'OSC Protocol'],
      liveUrl: 'https://klangwerk-spatial.example.com',
      repoUrl: 'https://github.com/kaelenvance/klangwerk-spatial-ui'
    },
    {
      id: 'p3',
      title: 'Vitalsense Continuous Biometric & Recovery Companion',
      subtitle: 'Clinical-grade wearable telemetry, HRV recovery modeling, and offline-first mobile app',
      category: 'Mobile & Biometrics',
      year: '2025',
      clientOrContext: 'Vitalsense Health Labs (San Francisco)',
      role: 'Mobile Architecture Lead',
      featuredWide: false,
      imageUrl: projectHealthImg,
      summary:
        'BLE 5.3 continuous physiological telemetry application pairing a titanium ceramic ring sensor with real-time autonomic nervous system analytics.',
      challenge:
        'Continuous Bluetooth Low Energy packet ingestion was draining user batteries by 28% per day while failing to sync cleanly in low-connectivity environments.',
      architecture:
        'Designed a batched background BLE sync protocol with SQLite WAL compression and predictive circadian readiness charts using tabular telemetry visualization.',
      outcomeMetric: '-71% background battery consumption · 4.9★ rating across 62,000 reviews',
      technologies: ['Flutter iOS & Android', 'BLE CoreBluetooth', 'SQLite FTS5', 'Swift/Kotlin Channels'],
      liveUrl: 'https://vitalsense-biometrics.example.com',
      repoUrl: 'https://github.com/kaelenvance/vitalsense-ble-telemetry'
    },
    {
      id: 'p4',
      title: 'Monolith Multi-Brand Design Token & Component Compiler',
      subtitle: 'Automated Figma-to-React & Flutter design system engine powering 14 enterprise product lines',
      category: 'Design Systems',
      year: '2024',
      clientOrContext: 'Vanguard Digital Collective (London)',
      role: 'Design Systems Architect',
      featuredWide: false,
      imageUrl: projectDesignImg,
      summary:
        'A strict mathematical design system and AST compiler translating semantic tokens into WCAG AA verified React, Tailwind, and Flutter component libraries.',
      challenge:
        'Fourteen product squads maintained divergent UI kits, causing 6-week delays for brand refreshes and recurring accessibility regressions.',
      architecture:
        'Created a zero-runtime token compiler with automated contrast ratio enforcement, interactive visual regression sandboxes, and strict spatial math primitives.',
      outcomeMetric: '3.4x faster feature delivery across 14 squads · 100% WCAG AA compliance',
      technologies: ['TypeScript AST', 'React 19', 'Tailwind CSS', 'Flutter ThemeExtensions', 'Storybook'],
      liveUrl: 'https://monolith-ds.example.com',
      repoUrl: 'https://github.com/kaelenvance/monolith-token-compiler'
    }
  ],
  services: [
    {
      id: 's1',
      number: '01.',
      title: 'Cross-Platform Flutter & Web Application Architecture',
      tagline: 'Single-codebase flagship apps engineered for native 120fps feel across iOS, Android, Web & Desktop.',
      summary:
        'End-to-end architecture and hands-on implementation of production applications. Ideal for founders and product leaders who need native hardware access, offline-first persistence, and uncompromising visual polish without maintaining four separate engineering teams.',
      deliverables: [
        'Modular domain-driven codebase (Flutter or React/TypeScript) with strict CI/CD pipelines',
        'Offline-first local storage engine with deterministic conflict resolution',
        'Custom GPU shader & compositor-only motion system (<= 200ms interaction latency)',
        'App Store, Google Play, and Edge Web production deployment with telemetry'
      ],
      timeline: '6–10 Weeks (Full Flagship Build)',
      investmentRange: '$18,000 – $35,000 per sprint cycle',
      idealFor: 'Seed to Series B product teams launching or replatforming core apps',
      proofHighlight: 'Delivered 18 cross-platform launches maintaining 99.98% crash-free sessions.'
    },
    {
      id: 's2',
      number: '02.',
      title: 'Design Systems & Multi-Platform Component Engineering',
      tagline: 'Mathematical typography, accessible token compilers, and reusable UI primitives for scaling teams.',
      summary:
        'I transform fragmented UI codebases into a unified, high-craft component architecture. Every primitive is built with strict spatial math, keyboard accessibility, dark/light optical compensation, and zero-pill editorial restraint.',
      deliverables: [
        'Multi-platform design token pipeline (JSON to CSS Variables, Tailwind, and Flutter)',
        '35+ accessible, zero-dependency core UI components with interactive documentation',
        'WCAG AA contrast and touch-target automated verification suite',
        'Team onboarding workshops and migration codemods'
      ],
      timeline: '4–6 Weeks',
      investmentRange: '$14,000 – $24,000 fixed scope',
      idealFor: 'Engineering organizations scaling across multiple web and mobile surfaces',
      proofHighlight: 'Accelerated UI delivery by 3.4x across 14 product squads at Vanguard Collective.'
    },
    {
      id: 's3',
      number: '03.',
      title: 'Realtime Telemetry, FinTech & Hardware-Bridge Interfaces',
      tagline: 'High-frequency data visualization, WebSocket streaming terminals, and BLE/MIDI hardware companions.',
      summary:
        'Specialized interface engineering for products where every millisecond counts—financial order books, medical biometric sensors, spatial audio controllers, and industrial telemetry consoles.',
      deliverables: [
        'High-throughput WebSocket / gRPC / BLE ingestion layer with backpressure handling',
        'Tabular-numeral data grids and canvas charts capable of 10,000+ updates/sec',
        'Native C++/Rust FFI or Swift/Kotlin platform channels for hardware communication',
        'Memory leak and frame-time profiling report'
      ],
      timeline: '4–8 Weeks',
      investmentRange: '$16,000 – $30,000',
      idealFor: 'FinTech, HealthTech, Audio, and IoT hardware companies',
      proofHighlight: 'Reduced tick-to-pixel latency to sub-8ms for Aurelia Institutional Treasury.'
    },
    {
      id: 's4',
      number: '04.',
      title: 'Principal Technical Advisory & Performance Turnarounds',
      tagline: 'Surgical codebase audits, frame-drop eradication, and architectural rescue for mission-critical apps.',
      summary:
        'When an existing Flutter or React application suffers from jank, state spaghetti, battery drain, or slow release velocity, I embed directly with your senior engineers to diagnose bottlenecks and execute a high-impact turnaround.',
      deliverables: [
        'Comprehensive architectural & rendering flamegraph audit within 5 business days',
        'Hands-on refactoring of critical state management and network bottlenecks',
        'Automated integration testing and release pipeline hardening',
        'Ongoing weekly architecture review & principal mentorship'
      ],
      timeline: '2-Week Audit or Ongoing Monthly Retainer',
      investmentRange: '$6,500 / audit · $8,000 / month retainer',
      idealFor: 'CTOs and VPs of Engineering preparing for high-stakes product milestones',
      proofHighlight: 'Cut median frame render latency by 64% and BLE battery drain by 71%.'
    }
  ],
  experiences: [
    {
      id: 'e1',
      period: '2023 — PRESENT',
      role: 'Principal Systems & Product Architect',
      organization: 'Vance Studio Practice',
      location: 'Zurich & San Francisco',
      impactSummary:
        'Leading flagship cross-platform product architecture, design token compilers, and high-frequency interfaces for FinTech, spatial audio, and digital health ventures.'
    },
    {
      id: 'e2',
      period: '2020 — 2023',
      role: 'Staff Cross-Platform Engineer',
      organization: 'Helvetia Quantitative Systems',
      location: 'Zurich, Switzerland',
      impactSummary:
        'Architected the core multi-platform institutional execution suite in Flutter & Rust, scaling from initial prototype to $14B+ in monthly routed volume with 99.99% uptime.'
    },
    {
      id: 'e3',
      period: '2018 — 2020',
      role: 'Senior Frontend & Design Systems Engineer',
      organization: 'Atelier Kinetic Labs',
      location: 'Berlin, Germany',
      impactSummary:
        'Built WebGL/Canvas interactive instruments and cross-platform mobile companions for European audio hardware and mobility brands.'
    }
  ],
  testimonials: [
    {
      id: 't1',
      quote:
        'Before Kaelen joined, our desktop and web treasury terminals lagged by nearly 400ms during market opens and required two separate teams. He re-architected our entire streaming layer and unified the UI into a single cross-platform codebase that now renders 12,000 ticks/sec at sub-8ms latency.',
      beforeState: '380ms order-book lag across fragmented codebases',
      outcomeMetric: '+142% institutional desk adoption in 6 months',
      authorName: 'Dr. Lukas Reinhardt',
      authorRole: 'Chief Technology Officer',
      organization: 'Aurelia Financial Technologies'
    },
    {
      id: 't2',
      quote:
        'Our wearable companion app was losing users due to 28% daily background battery drain over Bluetooth. Kaelen redesigned our BLE sync protocol and rebuilt the telemetry views, cutting battery usage by 71% and lifting our App Store rating from 3.8 to 4.9 stars within 90 days.',
      beforeState: '28% daily BLE battery drain & sync dropouts',
      outcomeMetric: '-71% battery drain · 4.9★ across 62,000 reviews',
      authorName: 'Elena Rostova',
      authorRole: 'VP of Product Engineering',
      organization: 'Vitalsense Health Labs'
    }
  ],
  socials: {
    github: 'https://github.com/ahsxndev',
    linkedin: 'https://linkedin.com/in/ahxanzaman',
    xTwitter: 'https://x.com/ahsxndev',
    dribbble: 'https://dribbble.com',
    whatsappNumber: '+14158904321',
    resumeUrl: '#resume-download'
  },
  emailJs: {
    serviceId: 'service_portfolio_default',
    templateId: 'template_portfolio_contact',
    publicKey: 'user_public_key_demo',
    privateKey: ''
  }
};

export function generateFlutterConfigExport(config: PortfolioConfig): string {
  const projectsDart = config.projects
    .map(
      (p) => `  ProjectModel(
    title: ${JSON.stringify(p.title)},
    subtitle: ${JSON.stringify(p.subtitle)},
    category: ${JSON.stringify(p.category)},
    year: ${JSON.stringify(p.year)},
    description: ${JSON.stringify(p.summary)},
    technologies: ${JSON.stringify(p.technologies)},
    liveUrl: ${JSON.stringify(p.liveUrl)},
    githubUrl: ${JSON.stringify(p.repoUrl)},
  )`
    )
    .join(',\n');

  return `// ============================================================================
// GENERATED MYFOLIO CONFIGURATION BUNDLE
// Exported from Live Portfolio Customization Studio
// ============================================================================

// 1. lib/core/config/user_info_config.dart
class UserInfoConfig {
  static const String fullName = ${JSON.stringify(config.userInfo.fullName)};
  static const String primaryTitle = ${JSON.stringify(config.userInfo.primaryTitle)};
  static const String email = ${JSON.stringify(config.userInfo.email)};
  static const String phone = ${JSON.stringify(config.userInfo.phone)};
  static const String location = ${JSON.stringify(config.userInfo.location)};
  static const String availability = ${JSON.stringify(config.userInfo.availabilityText)};
  static const String aboutLead = ${JSON.stringify(config.userInfo.aboutLead)};
  static const String aboutBody = ${JSON.stringify(config.userInfo.aboutBody)};
  static const List<String> rotatingRoles = ${JSON.stringify(config.userInfo.rotatingRoles, null, 2)};
}

// 2. lib/core/config/social_links_config.dart
class SocialLinksConfig {
  static const String github = ${JSON.stringify(config.socials.github)};
  static const String linkedin = ${JSON.stringify(config.socials.linkedin)};
  static const String twitter = ${JSON.stringify(config.socials.xTwitter)};
  static const String whatsappNumber = ${JSON.stringify(config.socials.whatsappNumber)};
}

// 3. lib/core/config/emailjs_config.dart
class EmailJSConfig {
  static const String serviceId = ${JSON.stringify(config.emailJs.serviceId)};
  static const String templateId = ${JSON.stringify(config.emailJs.templateId)};
  static const String userId = ${JSON.stringify(config.emailJs.publicKey)};
}

// 4. lib/core/config/projects_config.dart
final List<ProjectModel> portfolioProjects = [
${projectsDart}
];
`;
}
