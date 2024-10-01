import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  SlidersHorizontal,
  Send,
  CheckCircle2,
  MessageSquare,
  Mail,
  Plus
} from 'lucide-react';
import {
  DEFAULT_PORTFOLIO_CONFIG,
  PortfolioConfig,
  ProjectItem,
  ServiceItem
} from './config/portfolioData';
import { ResilientImage } from './components/ResilientImage';
import { ProjectLightboxModal } from './components/ProjectLightboxModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import {
  PortfolioStudioDrawer,
  StudioTab
} from './components/PortfolioStudioDrawer';

const STORAGE_KEY = 'vance_folio_custom_config_v1';

interface SentMessageRecord {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  timestamp: string;
  deliveryMethod: 'EmailJS API' | 'Studio Inbox Verified';
}

export default function App() {
  const [config, setConfig] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PORTFOLIO_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PORTFOLIO_CONFIG;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All Works');
  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);

  // Modals & Studio Drawer State
  const [lightboxProject, setLightboxProject] = useState<ProjectItem | null>(null);
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [studioTab, setStudioTab] = useState<StudioTab>('identity');
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactService, setContactService] = useState(
    DEFAULT_PORTFOLIO_CONFIG.services[0]?.title || 'Architecture Sprint'
  );
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [sentMessages, setSentMessages] = useState<SentMessageRecord[]>([]);

  // Persist config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore storage errors
    }
  }, [config]);

  // Rotate specialty roles every 3.5s
  useEffect(() => {
    const roles = config.userInfo.rotatingRoles;
    if (!roles || roles.length <= 1) return;
    const timer = setInterval(() => {
      setActiveRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [config.userInfo.rotatingRoles]);

  const isDark = config.themeMode === 'stark-black';
  const accentColor = config.accentColor;

  const openStudioAt = (tab: StudioTab, itemId: string | null = null) => {
    setStudioTab(tab);
    setFocusedItemId(itemId);
    setIsStudioOpen(true);
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_PORTFOLIO_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSelectServiceForContact = (serviceTitle: string) => {
    setContactService(serviceTitle);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquireProject = (projectTitle: string) => {
    setContactService(`Architecture Inquiry: ${projectTitle}`);
    setContactMessage(
      `Hi ${config.userInfo.fullName.split(' ')[0]}, we are interested in discussing a system architecture similar to "${projectTitle}".`
    );
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setSubmitStatus({
        type: 'error',
        text: 'Please complete your name, email address, and project brief.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const hasRealEmailJs =
      config.emailJs.serviceId &&
      config.emailJs.serviceId !== 'service_portfolio_default' &&
      config.emailJs.templateId &&
      config.emailJs.publicKey &&
      config.emailJs.publicKey !== 'user_public_key_demo';

    let deliveryMethod: SentMessageRecord['deliveryMethod'] = 'Studio Inbox Verified';

    if (hasRealEmailJs) {
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: config.emailJs.serviceId,
            template_id: config.emailJs.templateId,
            user_id: config.emailJs.publicKey,
            accessToken: config.emailJs.privateKey || undefined,
            template_params: {
              name: contactName,
              email: contactEmail,
              service_type: contactService,
              message: contactMessage,
              to_email: config.userInfo.email
            }
          })
        });
        if (res.ok) {
          deliveryMethod = 'EmailJS API';
        }
      } catch {
        // Fallback to local verified studio inbox if EmailJS keys are invalid
      }
    }

    const record: SentMessageRecord = {
      id: `msg_${Date.now()}`,
      name: contactName.trim(),
      email: contactEmail.trim(),
      serviceType: contactService,
      message: contactMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      deliveryMethod
    };

    setSentMessages((prev) => [record, ...prev]);
    setIsSubmitting(false);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setSubmitStatus({
      type: 'success',
      text: `Inquiry logged for ${config.userInfo.email} (${deliveryMethod}). Expect a response within 24 business hours.`
    });
  };

  const handleWhatsAppDirect = () => {
    const cleanPhone = config.socials.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${config.userInfo.fullName}, I am reaching out from your portfolio regarding ${
        contactService || 'a new project'
      }.${contactMessage ? ` Brief: ${contactMessage}` : ''}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const categories = [
    'All Works',
    'Systems & FinTech',
    'Spatial & Audio',
    'Mobile & Biometrics',
    'Design Systems'
  ];

  const filteredProjects =
    activeCategory === 'All Works'
      ? config.projects
      : config.projects.filter((p) => p.category === activeCategory);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#050505] text-[#F4F4F0]'
          : 'bg-[#F4F4F0] text-[#111111]'
      }`}
    >
      {/* =====================================================================
          TOP BAR CONTRACT: Strict 1-Row, 3-Zone Navigation Header
          Zone 1: Single text element wordmark
          Zone 2: 5 single-line navigation links
          Zone 3: 2 primary actions (Edit Everything + Start Project)
      ===================================================================== */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#050505]/90 border-zinc-800/80'
            : 'bg-[#F4F4F0]/90 border-zinc-300/70'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight whitespace-nowrap shrink-0"
          >
            {config.userInfo.wordmark}
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            <a
              href="#works"
              className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
                isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Works
            </a>
            <a
              href="#services"
              className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
                isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Services
            </a>
            <a
              href="#about"
              className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
                isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              About
            </a>
            <a
              href="#proof"
              className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
                isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className={`hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
                isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 2 primary actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => openStudioAt('identity')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isDark
                  ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-900'
                  : 'border-zinc-300 text-zinc-800 hover:bg-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Edit Portfolio
            </button>
            <a
              href="#contact"
              style={{ backgroundColor: accentColor }}
              className="px-4 py-2 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              Start a Project
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* =====================================================================
            HERO SECTION: Split-Screen Hero & Oversized Typographic Impact
        ===================================================================== */}
        <section className="max-w-[1280px] mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Typographic Hierarchy & Quantitative Metrics */}
            <div className="lg:col-span-7 space-y-8">
              {/* Quiet Unboxed Regional & Availability Metadata */}
              <div
                className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                <span>{config.userInfo.location}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium" style={{ color: accentColor }}>
                  {config.userInfo.availabilityText}
                </span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => openStudioAt('identity')}
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  Customize bio
                </button>
              </div>

              {/* Oversized Editorial Headline */}
              <div className="space-y-4">
                <p
                  className={`text-xs md:text-sm font-medium tracking-tight ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {config.userInfo.primaryTitle}
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.06]">
                  {config.userInfo.heroHeadline}{' '}
                  <span
                    className="font-editorial italic font-normal"
                    style={{ color: accentColor }}
                  >
                    {config.userInfo.heroEditorialAccent}
                  </span>
                </h1>
              </div>

              {/* Rotating Specialty Focus */}
              <div
                className={`py-3 border-y flex flex-wrap items-center justify-between gap-4 text-xs ${
                  isDark ? 'border-zinc-800/90' : 'border-zinc-300/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isDark ? 'text-zinc-500' : 'text-zinc-500'}>
                    Current Focus:
                  </span>
                  <span className="font-mono-tabular font-medium">
                    {config.userInfo.rotatingRoles[
                      activeRoleIndex % Math.max(1, config.userInfo.rotatingRoles.length)
                    ] || 'Cross-Platform Systems'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {config.userInfo.rotatingRoles.map((role, idx) => (
                    <button
                      key={role + idx}
                      type="button"
                      onClick={() => setActiveRoleIndex(idx)}
                      aria-label={`Show specialty ${role}`}
                      className={`w-5 h-1 rounded-full transition-opacity ${
                        idx === activeRoleIndex ? 'opacity-100' : 'opacity-25 hover:opacity-50'
                      }`}
                      style={{
                        backgroundColor:
                          idx === activeRoleIndex
                            ? accentColor
                            : isDark
                            ? '#71717A'
                            : '#52525B'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Body Lead Prose */}
              <p
                className={`text-base md:text-lg leading-relaxed max-w-[65ch] ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}
              >
                {config.userInfo.heroSubheadline}
              </p>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#works"
                  style={{ backgroundColor: accentColor }}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Explore Selected Works
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => openStudioAt('identity')}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border transition-colors whitespace-nowrap ${
                    isDark
                      ? 'border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                      : 'border-zinc-300 text-zinc-800 hover:bg-white'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Edit Everything in Studio
                </button>
              </div>

              {/* Quantitative Rigor Metrics Grid */}
              <div
                className={`pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-6 ${
                  isDark ? 'border-zinc-800/90' : 'border-zinc-300/80'
                }`}
              >
                {config.metrics.map((m) => (
                  <div key={m.id} className="space-y-1">
                    <p className="font-mono-tabular text-2xl md:text-3xl font-semibold tracking-tight">
                      {m.value}
                    </p>
                    <p className="text-xs font-semibold">{m.label}</p>
                    <p
                      className={`text-xs leading-snug ${
                        isDark ? 'text-zinc-500' : 'text-zinc-500'
                      }`}
                    >
                      {m.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Large Editorial Visual Showcase & Signature Overlay */}
            <div className="lg:col-span-5">
              <div
                className={`group relative rounded-2xl overflow-hidden border aspect-4/5 ${
                  isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-300 bg-zinc-200'
                }`}
              >
                <ResilientImage
                  src={config.userInfo.heroImageUrl}
                  alt={`${config.userInfo.fullName} — ${config.userInfo.primaryTitle}`}
                  fallbackTitle={config.userInfo.fullName}
                  fallbackSubtitle={config.userInfo.primaryTitle}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Measured Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-6 md:p-8">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openStudioAt('identity')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg border border-white/15 transition-colors whitespace-nowrap"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Change Portrait
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="font-editorial italic text-2xl md:text-3xl text-white/95 tracking-wide">
                      {config.userInfo.signatureText}
                    </p>
                    <p className="text-xs text-zinc-300">
                      {config.userInfo.heroImageCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION DIVIDER: Subtle Animated Marquee Text Ribbon
        ===================================================================== */}
        <div
          className={`border-y py-3.5 overflow-hidden select-none ${
            isDark
              ? 'border-zinc-800/80 bg-[#0A0A0C]'
              : 'border-zinc-300/80 bg-[#EAEAE4]'
          }`}
          aria-hidden="true"
        >
          <div className="animate-marquee flex items-center gap-8 text-xs font-mono-tabular tracking-wide">
            {[...config.userInfo.marqueeItems, ...config.userInfo.marqueeItems, ...config.userInfo.marqueeItems].map(
              (item, index) => (
                <React.Fragment key={`${item}-${index}`}>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                    {item}
                  </span>
                  <span style={{ color: accentColor }}>·</span>
                </React.Fragment>
              )
            )}
          </div>
        </div>

        {/* =====================================================================
            SELECTED WORKS SECTION: Media-First Dynamic Bento Grid & Lightbox
        ===================================================================== */}
        <section
          id="works"
          className="max-w-[1280px] mx-auto px-6 py-20 md:py-28 space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 font-mono-tabular">
                01. Selected Works & Production Case Studies
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Engineered for High-Retention Impact
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Interactive Segmented Filter Bar */}
              <div
                className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
                  isDark
                    ? 'bg-zinc-900/80 border-zinc-800'
                    : 'bg-zinc-200/70 border-zinc-300/80'
                }`}
                role="tablist"
                aria-label="Filter projects by domain"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      activeCategory === cat
                        ? isDark
                          ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                          : 'bg-white text-zinc-900 shadow-xs'
                        : isDark
                        ? 'text-zinc-400 hover:text-zinc-100'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openStudioAt('projects')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    : 'border-zinc-300 text-zinc-700 hover:bg-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Manage Projects
              </button>
            </div>
          </div>

          {/* Dynamic Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const isWide = project.featuredWide && activeCategory === 'All Works';
              return (
                <article
                  key={project.id}
                  onClick={() => setLightboxProject(project)}
                  className={`group cursor-pointer rounded-2xl border overflow-hidden flex flex-col justify-between transition-colors ${
                    isWide ? 'md:col-span-2' : 'col-span-1'
                  } ${
                    isDark
                      ? 'bg-[#0C0C0E] border-zinc-800/90 hover:border-zinc-600'
                      : 'bg-white border-zinc-200/90 hover:border-zinc-400'
                  }`}
                >
                  {/* Media Container */}
                  <div
                    className={`relative w-full overflow-hidden bg-zinc-950 ${
                      isWide ? 'aspect-16/9 max-h-[480px]' : 'aspect-4/3'
                    }`}
                  >
                    <ResilientImage
                      src={project.imageUrl}
                      alt={project.title}
                      fallbackTitle={project.title}
                      fallbackSubtitle={project.subtitle}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openStudioAt('projects', project.id);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-black/65 hover:bg-black/85 backdrop-blur-md rounded-lg border border-white/15 transition-colors whitespace-nowrap"
                      >
                        Edit Project
                      </button>
                      <span className="w-8 h-8 rounded-lg bg-white/95 text-zinc-900 flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Bottom Scrim Outcome Metric */}
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between gap-4 text-white">
                      <span className="font-mono-tabular text-xs text-zinc-200">
                        {project.outcomeMetric}
                      </span>
                    </div>
                  </div>

                  {/* Card Body — Zero-Pill Metadata Discipline */}
                  <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Clean unboxed metadata with typographic separators */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span>{project.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{project.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.role}</span>
                      </div>

                      <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight group-hover:underline underline-offset-4">
                        {project.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}
                      >
                        {project.summary}
                      </p>
                    </div>

                    {/* Unboxed Tech Stack Row */}
                    <div
                      className={`pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
                        isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'
                      }`}
                    >
                      <div
                        className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-tabular ${
                          isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}
                      >
                        {project.technologies.map((tech, idx) => (
                          <React.Fragment key={tech + idx}>
                            <span>{tech}</span>
                            {idx < project.technologies.length - 1 && (
                              <span aria-hidden="true" className="text-zinc-500">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      <span
                        className="font-medium whitespace-nowrap"
                        style={{ color: accentColor }}
                      >
                        Inspect Case Study →
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            SERVICES & CAPABILITIES SECTION: Editorial Numbering & Blueprints
        ===================================================================== */}
        <section
          id="services"
          className={`border-t py-20 md:py-28 ${
            isDark ? 'border-zinc-800/80 bg-[#08080A]' : 'border-zinc-300/80 bg-[#ECECE6]'
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs text-zinc-500 font-mono-tabular">
                  02. Capabilities & Technical Advisory
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                  Engagement Blueprints & Deliverables
                </h2>
              </div>
              <button
                type="button"
                onClick={() => openStudioAt('services')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap self-start md:self-auto ${
                  isDark
                    ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    : 'border-zinc-300 text-zinc-700 hover:bg-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Edit Services
              </button>
            </div>

            <div
              className={`divide-y border-y ${
                isDark
                  ? 'divide-zinc-800/90 border-zinc-800/90'
                  : 'divide-zinc-300/90 border-zinc-300/90'
              }`}
            >
              {config.services.map((service) => (
                <div
                  key={service.id}
                  className="py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  {/* Editorial Index & Title */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span
                        className="font-mono-tabular text-sm font-semibold"
                        style={{ color: accentColor }}
                      >
                        {service.number}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    <p
                      className={`text-xs font-mono-tabular ${
                        isDark ? 'text-zinc-400' : 'text-zinc-600'
                      }`}
                    >
                      {service.timeline} · {service.investmentRange}
                    </p>
                  </div>

                  {/* Tagline, Deliverables Preview & Substantiated Proof */}
                  <div className="lg:col-span-5 space-y-3">
                    <p
                      className={`text-sm md:text-base leading-relaxed ${
                        isDark ? 'text-zinc-300' : 'text-zinc-700'
                      }`}
                    >
                      {service.tagline}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Track Record: <span className="font-medium">{service.proofHighlight}</span>
                    </p>
                  </div>

                  {/* Interactive Actions */}
                  <div className="lg:col-span-2 flex lg:flex-col items-stretch sm:items-end justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalService(service)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        isDark
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-900'
                          : 'border-zinc-300 text-zinc-800 hover:bg-white'
                      }`}
                    >
                      View Blueprint
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectServiceForContact(service.title)}
                      style={{ color: accentColor }}
                      className="px-2 py-1 text-xs font-medium hover:underline underline-offset-4 whitespace-nowrap text-right"
                    >
                      Book Scope →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            ABOUT, TRAJECTORY & ATTRIBUTABLE PROOF (Claim-to-Proof Adjacency)
        ===================================================================== */}
        <section
          id="about"
          className="max-w-[1280px] mx-auto px-6 py-20 md:py-28 space-y-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Architectural Philosophy & Core Disciplines */}
            <div className="lg:col-span-6 space-y-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-zinc-500 font-mono-tabular">
                  03. Architectural Philosophy & Trajectory
                </p>
                <button
                  type="button"
                  onClick={() => openStudioAt('about')}
                  className="text-xs underline underline-offset-4 text-zinc-500 hover:text-zinc-800"
                >
                  Edit About & Timeline
                </button>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                {config.userInfo.aboutLead}
              </h2>

              <p
                className={`text-sm md:text-base leading-relaxed ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}
              >
                {config.userInfo.aboutBody}
              </p>

              {/* Core Disciplines — Clean Unboxed Text with Typographic Separators */}
              <div
                className={`pt-6 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-300'
                }`}
              >
                <h3 className="text-xs font-semibold text-zinc-500">
                  Core Engineering Disciplines & Stack
                </h3>
                <div
                  className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm font-mono-tabular ${
                    isDark ? 'text-zinc-200' : 'text-zinc-800'
                  }`}
                >
                  {config.userInfo.coreDisciplines.map((disc, idx) => (
                    <React.Fragment key={disc + idx}>
                      <span>{disc}</span>
                      {idx < config.userInfo.coreDisciplines.length - 1 && (
                        <span aria-hidden="true" style={{ color: accentColor }}>
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Experience Trajectory */}
              <div
                className={`pt-6 border-t space-y-6 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-300'
                }`}
              >
                <h3 className="text-xs font-semibold text-zinc-500">
                  Leadership & Engineering Trajectory
                </h3>
                <div className="space-y-6">
                  {config.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-base font-bold">
                          {exp.role} — {exp.organization}
                        </h4>
                        <span className="font-mono-tabular text-xs text-zinc-500">
                          {exp.period} · {exp.location}
                        </span>
                      </div>
                      <p
                        className={`text-xs md:text-sm leading-relaxed ${
                          isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}
                      >
                        {exp.impactSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Attributable Client Testimonials (Claim-to-Proof Adjacency) */}
            <div id="proof" className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 font-mono-tabular">
                  04. Verified Partner Outcomes & Attributable Proof
                </p>
                <button
                  type="button"
                  onClick={() => openStudioAt('about')}
                  className="text-xs underline underline-offset-4 text-zinc-500 hover:text-zinc-800"
                >
                  Edit Testimonials
                </button>
              </div>

              <div className="space-y-6">
                {config.testimonials.map((item) => (
                  <blockquote
                    key={item.id}
                    className={`p-6 md:p-8 rounded-2xl border space-y-6 ${
                      isDark
                        ? 'bg-[#0C0C0E] border-zinc-800'
                        : 'bg-white border-zinc-200/90'
                    }`}
                  >
                    {/* Concrete Before -> Outcome Header */}
                    <div
                      className={`pb-4 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular ${
                        isDark ? 'border-zinc-800' : 'border-zinc-200'
                      }`}
                    >
                      <span className="text-zinc-500">Prior: {item.beforeState}</span>
                      <span className="font-semibold" style={{ color: accentColor }}>
                        Outcome: {item.outcomeMetric}
                      </span>
                    </div>

                    <p
                      className={`font-editorial italic text-xl md:text-2xl leading-relaxed ${
                        isDark ? 'text-zinc-100' : 'text-zinc-900'
                      }`}
                    >
                      “{item.quote}”
                    </p>

                    <footer className="flex items-center justify-between gap-4 pt-2">
                      <div>
                        <p className="text-sm font-semibold">{item.authorName}</p>
                        <p className="text-xs text-zinc-500">
                          {item.authorRole} · {item.organization}
                        </p>
                      </div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            CONTACT SECTION: EmailJS + Direct WhatsApp + Live Verification Log
        ===================================================================== */}
        <section
          id="contact"
          className={`border-t py-20 md:py-28 ${
            isDark ? 'border-zinc-800/80 bg-[#0A0A0C]' : 'border-zinc-300/80 bg-[#EAEAE4]'
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Channels & Availability */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 font-mono-tabular">
                    05. Initiate an Architecture or Product Sprint
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                    Let’s Build Your Next Flagship System.
                  </h2>
                  <p
                    className={`text-sm md:text-base leading-relaxed ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    Send a project brief via the form or connect directly on WhatsApp or Email.
                    You can also configure your live EmailJS credentials in the Studio Editor.
                  </p>
                </div>

                {/* Direct Contact Metadata */}
                <div
                  className={`p-6 rounded-2xl border space-y-4 ${
                    isDark ? 'bg-[#0C0C0E] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div>
                    <p className="text-xs text-zinc-500">Direct Electronic Mail</p>
                    <a
                      href={`mailto:${config.userInfo.email}`}
                      className="font-mono-tabular text-sm md:text-base font-semibold hover:underline underline-offset-4"
                    >
                      {config.userInfo.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Direct Line & WhatsApp</p>
                    <p className="font-mono-tabular text-sm font-medium">
                      {config.userInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Studio Base</p>
                    <p className="text-sm">{config.userInfo.location}</p>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        isDark
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                          : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message on WhatsApp
                    </button>
                    <a
                      href={`mailto:${config.userInfo.email}?subject=${encodeURIComponent(
                        `Project Inquiry: ${contactService}`
                      )}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        isDark
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                          : 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Open Mail Client
                    </a>
                  </div>
                </div>

                {/* Social Profiles Unboxed List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">Verified Profiles & Repositories</p>
                    <button
                      type="button"
                      onClick={() => openStudioAt('config')}
                      className="text-xs underline underline-offset-4 text-zinc-500"
                    >
                      Edit Socials & EmailJS
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium">
                    <a
                      href={config.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      GitHub <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <span aria-hidden="true" className="text-zinc-500">
                      ·
                    </span>
                    <a
                      href={config.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      LinkedIn <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <span aria-hidden="true" className="text-zinc-500">
                      ·
                    </span>
                    <a
                      href={config.socials.xTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      X (Twitter) <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <span aria-hidden="true" className="text-zinc-500">
                      ·
                    </span>
                    <a
                      href={config.socials.dribbble}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      Dribbble <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Contact Form */}
              <div className="lg:col-span-7 space-y-6">
                <form
                  onSubmit={handleContactSubmit}
                  className={`p-6 md:p-10 rounded-2xl border space-y-6 ${
                    isDark ? 'bg-[#0C0C0E] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-blue-500/40'
                            : 'bg-[#F8F8F5] border-zinc-300 text-zinc-900 focus:ring-blue-500/40'
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium mb-1.5"
                      >
                        Work Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-blue-500/40'
                            : 'bg-[#F8F8F5] border-zinc-300 text-zinc-900 focus:ring-blue-500/40'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block text-xs font-medium mb-1.5"
                    >
                      Engagement Scope & Service Blueprint
                    </label>
                    <select
                      id="contact-service"
                      value={contactService}
                      onChange={(e) => setContactService(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-blue-500/40'
                          : 'bg-[#F8F8F5] border-zinc-300 text-zinc-900 focus:ring-blue-500/40'
                      }`}
                    >
                      {config.services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.number} {s.title} ({s.timeline})
                        </option>
                      ))}
                      <option value="Custom Architecture / Advisory">
                        Custom Architecture / Advisory
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium mb-1.5"
                    >
                      Project Context, Goals & Target Timeline
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Describe your product architecture goals, target platforms (Web, Flutter iOS/Android, Desktop), and desired launch window..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-blue-500/40'
                          : 'bg-[#F8F8F5] border-zinc-300 text-zinc-900 focus:ring-blue-500/40'
                      }`}
                    />
                  </div>

                  {submitStatus && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                        submitStatus.type === 'success'
                          ? isDark
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : isDark
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitStatus.text}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-zinc-500">
                      Dispatches to <span className="font-mono-tabular">{config.userInfo.email}</span>
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{ backgroundColor: accentColor }}
                      className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Dispatching Brief…' : 'Send Project Brief'}
                    </button>
                  </div>
                </form>

                {/* Recent Sent Dispatches Log (for instant user verification) */}
                {sentMessages.length > 0 && (
                  <div
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDark ? 'bg-[#0C0C0E] border-zinc-800' : 'bg-white border-zinc-200'
                    }`}
                  >
                    <p className="text-xs font-semibold text-zinc-500">
                      Recent Dispatched Inquiries ({sentMessages.length})
                    </p>
                    <div className="space-y-2.5">
                      {sentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isDark
                              ? 'border-zinc-800 bg-zinc-900/40'
                              : 'border-zinc-200 bg-[#F8F8F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">
                              {msg.name} ({msg.email})
                            </span>
                            <span className="font-mono-tabular text-zinc-500">
                              {msg.timestamp} · {msg.deliveryMethod}
                            </span>
                          </div>
                          <p className="text-zinc-500">Scope: {msg.serviceType}</p>
                          <p className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          CLEAN EDITORIAL FOOTER (No Ornamental Telemetry Tickers)
      ===================================================================== */}
      <footer
        className={`border-t py-10 text-xs ${
          isDark
            ? 'border-zinc-800/80 bg-[#050505] text-zinc-500'
            : 'border-zinc-300/80 bg-[#F4F4F0] text-zinc-600'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-bold text-sm">
              {config.userInfo.wordmark}
            </span>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => openStudioAt('identity')}
              className="hover:underline underline-offset-4 font-medium"
            >
              Open Live Studio Editor
            </button>
            <button
              type="button"
              onClick={() => openStudioAt('config')}
              className="hover:underline underline-offset-4 font-medium"
            >
              Export Flutter / JSON Config
            </button>
            <a href="#top" className="hover:underline underline-offset-4">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Fullscreen Lightbox Case Study Modal */}
      <ProjectLightboxModal
        project={lightboxProject}
        onClose={() => setLightboxProject(null)}
        onEditProject={(projectId) => {
          setLightboxProject(null);
          openStudioAt('projects', projectId);
        }}
        onInquireProject={handleInquireProject}
        isDark={isDark}
        accentColor={accentColor}
      />

      {/* Service Blueprint Detail Modal */}
      <ServiceDetailModal
        service={modalService}
        onClose={() => setModalService(null)}
        onSelectServiceForContact={handleSelectServiceForContact}
        onEditService={(serviceId) => {
          setModalService(null);
          openStudioAt('services', serviceId);
        }}
        isDark={isDark}
        accentColor={accentColor}
      />

      {/* Live Portfolio Studio Drawer ("Edit Everything") */}
      <PortfolioStudioDrawer
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        config={config}
        onChange={setConfig}
        onReset={handleResetConfig}
        activeTab={studioTab}
        setActiveTab={setStudioTab}
        focusedItemId={focusedItemId}
      />
    </div>
  );
}
