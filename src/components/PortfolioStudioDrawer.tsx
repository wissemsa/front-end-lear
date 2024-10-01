import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Download
} from 'lucide-react';
import {
  PortfolioConfig,
  ProjectItem,
  ServiceItem,
  ExperienceItem,
  TestimonialItem,
  generateFlutterConfigExport
} from '../config/portfolioData';

export type StudioTab = 'identity' | 'projects' | 'services' | 'about' | 'config';

interface PortfolioStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onChange: (newConfig: PortfolioConfig) => void;
  onReset: () => void;
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  focusedItemId: string | null;
}

export const PortfolioStudioDrawer: React.FC<PortfolioStudioDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  onReset,
  activeTab,
  setActiveTab,
  focusedItemId
}) => {
  const [copiedType, setCopiedType] = useState<'dart' | 'json' | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    focusedItemId && config.projects.some((p) => p.id === focusedItemId)
      ? focusedItemId
      : config.projects[0]?.id || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    focusedItemId && config.services.some((s) => s.id === focusedItemId)
      ? focusedItemId
      : config.services[0]?.id || ''
  );

  React.useEffect(() => {
    if (focusedItemId) {
      if (config.projects.some((p) => p.id === focusedItemId)) {
        setSelectedProjectId(focusedItemId);
      } else if (config.services.some((s) => s.id === focusedItemId)) {
        setSelectedServiceId(focusedItemId);
      }
    }
  }, [focusedItemId, config.projects, config.services]);

  if (!isOpen) return null;

  const isDark = config.themeMode === 'stark-black';

  const updateUserInfo = (
    field: keyof PortfolioConfig['userInfo'],
    value: string | string[]
  ) => {
    onChange({
      ...config,
      userInfo: {
        ...config.userInfo,
        [field]: value
      }
    });
  };

  const updateProject = (id: string, patch: Partial<ProjectItem>) => {
    onChange({
      ...config,
      projects: config.projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
    });
  };

  const addNewProject = () => {
    const newId = `p_${Date.now()}`;
    const newProj: ProjectItem = {
      id: newId,
      title: 'New Flagship System Architecture',
      subtitle: 'High-frequency cross-platform application engineered for scale',
      category: 'Systems & FinTech',
      year: '2026',
      clientOrContext: 'Enterprise Client',
      role: 'Lead Architect',
      featuredWide: false,
      imageUrl: config.projects[0]?.imageUrl || '',
      summary: 'Concise overview of the product architecture and user impact.',
      challenge: 'Key technical bottleneck solved during this engagement.',
      architecture: 'System design, state isolation, and rendering pipeline details.',
      outcomeMetric: '+120% performance improvement in 90 days',
      technologies: ['Flutter', 'TypeScript', 'Rust'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com'
    };
    onChange({
      ...config,
      projects: [newProj, ...config.projects]
    });
    setSelectedProjectId(newId);
  };

  const deleteProject = (id: string) => {
    if (config.projects.length <= 1) return;
    const nextProjects = config.projects.filter((p) => p.id !== id);
    onChange({
      ...config,
      projects: nextProjects
    });
    setSelectedProjectId(nextProjects[0]?.id || '');
  };

  const updateService = (id: string, patch: Partial<ServiceItem>) => {
    onChange({
      ...config,
      services: config.services.map((s) => (s.id === id ? { ...s, ...patch } : s))
    });
  };

  const addNewService = () => {
    const newId = `s_${Date.now()}`;
    const num = `0${config.services.length + 1}.`;
    const newSvc: ServiceItem = {
      id: newId,
      number: num,
      title: 'Custom Product & Architecture Sprint',
      tagline: 'End-to-end engineering execution tailored to your product roadmap.',
      summary: 'Dedicated architectural design, implementation, and production deployment.',
      deliverables: [
        'Production-grade multi-platform codebase',
        'Automated CI/CD & test coverage',
        'Performance profiling & documentation'
      ],
      timeline: '4–6 Weeks',
      investmentRange: '$12,000 – $20,000',
      idealFor: 'Product teams launching critical initiatives',
      proofHighlight: 'Substantiated by 99.98% production session stability.'
    };
    onChange({
      ...config,
      services: [...config.services, newSvc]
    });
    setSelectedServiceId(newId);
  };

  const deleteService = (id: string) => {
    if (config.services.length <= 1) return;
    const nextServices = config.services.filter((s) => s.id !== id);
    onChange({
      ...config,
      services: nextServices
    });
    setSelectedServiceId(nextServices[0]?.id || '');
  };

  const handleCopyDart = () => {
    const dartCode = generateFlutterConfigExport(config);
    navigator.clipboard.writeText(dartCode);
    setCopiedType('dart');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myfolio-custom-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentProject =
    config.projects.find((p) => p.id === selectedProjectId) || config.projects[0];
  const currentService =
    config.services.find((s) => s.id === selectedServiceId) || config.services[0];

  const inputClass = `w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
    isDark
      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-blue-500/40'
      : 'bg-white border-zinc-300 text-zinc-900 focus:ring-blue-500/40'
  }`;

  const labelClass = `block text-xs font-medium mb-1 ${
    isDark ? 'text-zinc-400' : 'text-zinc-600'
  }`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Live Portfolio Studio Editor"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl h-full flex flex-col border-l shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#0C0C0E] border-zinc-800 text-zinc-100'
            : 'bg-[#F8F8F5] border-zinc-200 text-zinc-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}
        >
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight">
              Live Portfolio Customization Studio
            </h2>
            <p className="text-xs text-zinc-500">
              Edit every text, metric, project, service, social link, and theme setting in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              title="Reset all customizations to default"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200/70'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close customization studio"
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                isDark
                  ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Functional Segmented Tab Bar */}
        <div
          className={`px-6 py-2.5 border-b flex items-center gap-1.5 overflow-x-auto ${
            isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-200/50'
          }`}
        >
          {(
            [
              { id: 'identity', label: 'Identity & Hero' },
              { id: 'projects', label: `Projects (${config.projects.length})` },
              { id: 'services', label: `Services (${config.services.length})` },
              { id: 'about', label: 'About & Proof' },
              { id: 'config', label: 'Theme, EmailJS & Export' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={
                activeTab === tab.id
                  ? { backgroundColor: config.accentColor, color: '#FFFFFF' }
                  : undefined
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: IDENTITY & HERO */}
          {activeTab === 'identity' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Top Bar Wordmark</label>
                  <input
                    type="text"
                    value={config.userInfo.wordmark}
                    onChange={(e) => updateUserInfo('wordmark', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={config.userInfo.fullName}
                    onChange={(e) => updateUserInfo('fullName', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Primary Role Title</label>
                  <input
                    type="text"
                    value={config.userInfo.primaryTitle}
                    onChange={(e) => updateUserInfo('primaryTitle', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Main Headline</label>
                  <input
                    type="text"
                    value={config.userInfo.heroHeadline}
                    onChange={(e) => updateUserInfo('heroHeadline', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Editorial Italic Accent Phrase</label>
                  <input
                    type="text"
                    value={config.userInfo.heroEditorialAccent}
                    onChange={(e) => updateUserInfo('heroEditorialAccent', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Hero Subheadline</label>
                  <textarea
                    rows={3}
                    value={config.userInfo.heroSubheadline}
                    onChange={(e) => updateUserInfo('heroSubheadline', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    value={config.userInfo.location}
                    onChange={(e) => updateUserInfo('location', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Availability Status</label>
                  <input
                    type="text"
                    value={config.userInfo.availabilityText}
                    onChange={(e) => updateUserInfo('availabilityText', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Direct Email</label>
                  <input
                    type="email"
                    value={config.userInfo.email}
                    onChange={(e) => updateUserInfo('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone / Direct Line</label>
                  <input
                    type="text"
                    value={config.userInfo.phone}
                    onChange={(e) => updateUserInfo('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Rotating Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={config.userInfo.rotatingRoles.join(', ')}
                    onChange={(e) =>
                      updateUserInfo(
                        'rotatingRoles',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Portrait Image URL</label>
                  <input
                    type="text"
                    value={config.userInfo.heroImageUrl}
                    onChange={(e) => updateUserInfo('heroImageUrl', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Portrait Signature Overlay</label>
                  <input
                    type="text"
                    value={config.userInfo.signatureText}
                    onChange={(e) => updateUserInfo('signatureText', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Hero Quantitative Metrics Editor */}
              <div
                className={`pt-4 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <h3 className="text-xs font-semibold">
                  Hero Quantitative Proof Metrics (Tabular)
                </h3>
                {config.metrics.map((metric, idx) => (
                  <div
                    key={metric.id}
                    className={`p-3 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-3 ${
                      isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <div>
                      <label className={labelClass}>Metric Value</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const next = [...config.metrics];
                          next[idx] = { ...metric, value: e.target.value };
                          onChange({ ...config, metrics: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Label</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const next = [...config.metrics];
                          next[idx] = { ...metric, label: e.target.value };
                          onChange({ ...config, metrics: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Timeframe / Context</label>
                      <input
                        type="text"
                        value={metric.context}
                        onChange={(e) => {
                          const next = [...config.metrics];
                          next[idx] = { ...metric, context: e.target.value };
                          onChange({ ...config, metrics: next });
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS BENTO */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {config.projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        currentProject?.id === p.id
                          ? isDark
                            ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                            : 'bg-zinc-900 text-white border-zinc-900'
                          : isDark
                          ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                          : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200/60'
                      }`}
                    >
                      {p.title.slice(0, 22)}
                      {p.title.length > 22 ? '…' : ''}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addNewProject}
                  style={{ backgroundColor: config.accentColor }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Project
                </button>
              </div>

              {currentProject && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Project Title</label>
                      <input
                        type="text"
                        value={currentProject.title}
                        onChange={(e) =>
                          updateProject(currentProject.id, { title: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Subtitle / One-Line Pitch</label>
                      <input
                        type="text"
                        value={currentProject.subtitle}
                        onChange={(e) =>
                          updateProject(currentProject.id, { subtitle: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Category Filter</label>
                      <select
                        value={currentProject.category}
                        onChange={(e) =>
                          updateProject(currentProject.id, {
                            category: e.target.value as ProjectItem['category']
                          })
                        }
                        className={inputClass}
                      >
                        <option value="Systems & FinTech">Systems & FinTech</option>
                        <option value="Spatial & Audio">Spatial & Audio</option>
                        <option value="Mobile & Biometrics">Mobile & Biometrics</option>
                        <option value="Design Systems">Design Systems</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        type="text"
                        value={currentProject.year}
                        onChange={(e) =>
                          updateProject(currentProject.id, { year: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Client / Organization</label>
                      <input
                        type="text"
                        value={currentProject.clientOrContext}
                        onChange={(e) =>
                          updateProject(currentProject.id, {
                            clientOrContext: e.target.value
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Your Role</label>
                      <input
                        type="text"
                        value={currentProject.role}
                        onChange={(e) =>
                          updateProject(currentProject.id, { role: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg border border-zinc-500/20">
                      <div>
                        <p className="text-xs font-medium">
                          Wide Bento Showcase Span (2x2 Grid Feature)
                        </p>
                        <p className="text-xs text-zinc-500">
                          Feature this project as a wide 2-column showcase tile in the Bento grid
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={currentProject.featuredWide}
                        onChange={(e) =>
                          updateProject(currentProject.id, {
                            featuredWide: e.target.checked
                          })
                        }
                        className="w-4 h-4 accent-blue-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Verified Outcome Metric</label>
                      <input
                        type="text"
                        value={currentProject.outcomeMetric}
                        onChange={(e) =>
                          updateProject(currentProject.id, {
                            outcomeMetric: e.target.value
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Executive Summary</label>
                      <textarea
                        rows={2}
                        value={currentProject.summary}
                        onChange={(e) =>
                          updateProject(currentProject.id, { summary: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Technical Bottleneck / Challenge</label>
                      <textarea
                        rows={2}
                        value={currentProject.challenge}
                        onChange={(e) =>
                          updateProject(currentProject.id, { challenge: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>System Architecture Solution</label>
                      <textarea
                        rows={2}
                        value={currentProject.architecture}
                        onChange={(e) =>
                          updateProject(currentProject.id, {
                            architecture: e.target.value
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={currentProject.technologies.join(', ')}
                        onChange={(e) =>
                          updateProject(currentProject.id, {
                            technologies: e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean)
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Live Deployment URL</label>
                      <input
                        type="text"
                        value={currentProject.liveUrl}
                        onChange={(e) =>
                          updateProject(currentProject.id, { liveUrl: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>GitHub / Source Repository URL</label>
                      <input
                        type="text"
                        value={currentProject.repoUrl}
                        onChange={(e) =>
                          updateProject(currentProject.id, { repoUrl: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Showcase Image URL</label>
                      <input
                        type="text"
                        value={currentProject.imageUrl}
                        onChange={(e) =>
                          updateProject(currentProject.id, { imageUrl: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {config.projects.length > 1 && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteProject(currentProject.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 border border-rose-500/30 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete This Project
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {config.services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        currentService?.id === s.id
                          ? isDark
                            ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                            : 'bg-zinc-900 text-white border-zinc-900'
                          : isDark
                          ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                          : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200/60'
                      }`}
                    >
                      {s.number} {s.title.slice(0, 18)}…
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addNewService}
                  style={{ backgroundColor: config.accentColor }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Service
                </button>
              </div>

              {currentService && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClass}>Editorial Index</label>
                      <input
                        type="text"
                        value={currentService.number}
                        onChange={(e) =>
                          updateService(currentService.id, { number: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className={labelClass}>Service Title</label>
                      <input
                        type="text"
                        value={currentService.title}
                        onChange={(e) =>
                          updateService(currentService.id, { title: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className={labelClass}>Tagline</label>
                      <input
                        type="text"
                        value={currentService.tagline}
                        onChange={(e) =>
                          updateService(currentService.id, { tagline: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className={labelClass}>Detailed Blueprint Summary</label>
                      <textarea
                        rows={3}
                        value={currentService.summary}
                        onChange={(e) =>
                          updateService(currentService.id, { summary: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className={labelClass}>
                        Deliverables (one item per line)
                      </label>
                      <textarea
                        rows={4}
                        value={currentService.deliverables.join('\n')}
                        onChange={(e) =>
                          updateService(currentService.id, {
                            deliverables: e.target.value
                              .split('\n')
                              .map((d) => d.trim())
                              .filter(Boolean)
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Typical Timeline</label>
                      <input
                        type="text"
                        value={currentService.timeline}
                        onChange={(e) =>
                          updateService(currentService.id, { timeline: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Investment Range</label>
                      <input
                        type="text"
                        value={currentService.investmentRange}
                        onChange={(e) =>
                          updateService(currentService.id, {
                            investmentRange: e.target.value
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className={labelClass}>Substantiated Proof Highlight</label>
                      <input
                        type="text"
                        value={currentService.proofHighlight}
                        onChange={(e) =>
                          updateService(currentService.id, {
                            proofHighlight: e.target.value
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {config.services.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteService(currentService.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 border border-rose-500/30 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Service
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ABOUT, TIMELINE & PROOF */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>About Lead Statement</label>
                  <textarea
                    rows={2}
                    value={config.userInfo.aboutLead}
                    onChange={(e) => updateUserInfo('aboutLead', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Architectural Philosophy Body</label>
                  <textarea
                    rows={4}
                    value={config.userInfo.aboutBody}
                    onChange={(e) => updateUserInfo('aboutBody', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Core Engineering Disciplines (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={config.userInfo.coreDisciplines.join(', ')}
                    onChange={(e) =>
                      updateUserInfo(
                        'coreDisciplines',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Experience Timeline */}
              <div
                className={`pt-4 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold">Career Trajectory</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const nextExp: ExperienceItem = {
                        id: `e_${Date.now()}`,
                        period: '2024 — PRESENT',
                        role: 'Principal Engineer',
                        organization: 'New Venture',
                        location: 'Remote',
                        impactSummary: 'Key architectural achievements and quantified outcome.'
                      };
                      onChange({
                        ...config,
                        experiences: [nextExp, ...config.experiences]
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Role
                  </button>
                </div>
                {config.experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className={`p-3.5 rounded-xl border space-y-3 ${
                      isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const next = [...config.experiences];
                          next[idx] = { ...exp, period: e.target.value };
                          onChange({ ...config, experiences: next });
                        }}
                        placeholder="Period"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const next = [...config.experiences];
                          next[idx] = { ...exp, role: e.target.value };
                          onChange({ ...config, experiences: next });
                        }}
                        placeholder="Role"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => {
                          const next = [...config.experiences];
                          next[idx] = { ...exp, organization: e.target.value };
                          onChange({ ...config, experiences: next });
                        }}
                        placeholder="Organization"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <textarea
                        rows={2}
                        value={exp.impactSummary}
                        onChange={(e) => {
                          const next = [...config.experiences];
                          next[idx] = { ...exp, impactSummary: e.target.value };
                          onChange({ ...config, experiences: next });
                        }}
                        className={inputClass}
                      />
                      {config.experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            onChange({
                              ...config,
                              experiences: config.experiences.filter((x) => x.id !== exp.id)
                            })
                          }
                          aria-label="Remove experience item"
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Attributable Testimonials */}
              <div
                className={`pt-4 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold">
                    Attributable Client Testimonials
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const nextTest: TestimonialItem = {
                        id: `t_${Date.now()}`,
                        quote:
                          'Detailed client statement describing the before state, engineering intervention, and measurable business outcome.',
                        beforeState: 'Legacy bottleneck',
                        outcomeMetric: '+150% measurable velocity gain',
                        authorName: 'Alex Mercer',
                        authorRole: 'VP of Engineering',
                        organization: 'Acme Systems'
                      };
                      onChange({
                        ...config,
                        testimonials: [...config.testimonials, nextTest]
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Testimonial
                  </button>
                </div>
                {config.testimonials.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border space-y-3 ${
                      isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <textarea
                      rows={2}
                      value={t.quote}
                      onChange={(e) => {
                        const next = [...config.testimonials];
                        next[idx] = { ...t, quote: e.target.value };
                        onChange({ ...config, testimonials: next });
                      }}
                      className={inputClass}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={t.authorName}
                        onChange={(e) => {
                          const next = [...config.testimonials];
                          next[idx] = { ...t, authorName: e.target.value };
                          onChange({ ...config, testimonials: next });
                        }}
                        placeholder="Author Name"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={t.authorRole}
                        onChange={(e) => {
                          const next = [...config.testimonials];
                          next[idx] = { ...t, authorRole: e.target.value };
                          onChange({ ...config, testimonials: next });
                        }}
                        placeholder="Role"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={t.organization}
                        onChange={(e) => {
                          const next = [...config.testimonials];
                          next[idx] = { ...t, organization: e.target.value };
                          onChange({ ...config, testimonials: next });
                        }}
                        placeholder="Organization"
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: THEME, SOCIALS, EMAILJS & CONFIG EXPORT */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              {/* Surface & Accent Palette */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold">
                  60-30-10 Editorial Canvas & Focal Accent
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>60% Dominant Neutral Canvas</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, themeMode: 'warm-paper' })}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                          config.themeMode === 'warm-paper'
                            ? 'border-blue-600 bg-blue-600/10 font-semibold'
                            : isDark
                            ? 'border-zinc-800 text-zinc-400'
                            : 'border-zinc-300 text-zinc-700'
                        }`}
                      >
                        Warm Paper (#F4F4F0)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, themeMode: 'stark-black' })}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                          config.themeMode === 'stark-black'
                            ? 'border-blue-600 bg-blue-600/10 font-semibold'
                            : isDark
                            ? 'border-zinc-800 text-zinc-400'
                            : 'border-zinc-300 text-zinc-700'
                        }`}
                      >
                        Stark Black (#050505)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>10% High-Contrast Focal Accent</label>
                    <div className="flex items-center gap-2">
                      {(
                        [
                          { hex: '#2563EB', name: 'Cobalt' },
                          { hex: '#E11D48', name: 'Cinnabar' },
                          { hex: '#F2B705', name: 'Mustard' }
                        ] as const
                      ).map((acc) => (
                        <button
                          key={acc.hex}
                          type="button"
                          onClick={() => onChange({ ...config, accentColor: acc.hex })}
                          className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                            config.accentColor === acc.hex
                              ? isDark
                                ? 'border-white bg-zinc-800'
                                : 'border-zinc-900 bg-white'
                              : isDark
                              ? 'border-zinc-800 text-zinc-400'
                              : 'border-zinc-300 text-zinc-700'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: acc.hex }}
                          />
                          {acc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Config */}
              <div
                className={`pt-4 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <h3 className="text-xs font-semibold">
                  Social Profiles & Direct Channels (social_links_config.dart)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>GitHub URL</label>
                    <input
                      type="text"
                      value={config.socials.github}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          socials: { ...config.socials, github: e.target.value }
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn URL</label>
                    <input
                      type="text"
                      value={config.socials.linkedin}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          socials: { ...config.socials, linkedin: e.target.value }
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>X / Twitter URL</label>
                    <input
                      type="text"
                      value={config.socials.xTwitter}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          socials: { ...config.socials, xTwitter: e.target.value }
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp Number (with country code)</label>
                    <input
                      type="text"
                      value={config.socials.whatsappNumber}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          socials: { ...config.socials, whatsappNumber: e.target.value }
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* EmailJS Configuration */}
              <div
                className={`pt-4 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <h3 className="text-xs font-semibold">
                  EmailJS Live Contact Dispatch (emailjs_config.dart)
                </h3>
                <p className="text-xs text-zinc-500">
                  Enter your EmailJS Service ID, Template ID, and Public Key to dispatch real emails directly from the Contact section.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Service ID</label>
                    <input
                      type="text"
                      value={config.emailJs.serviceId}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          emailJs: { ...config.emailJs, serviceId: e.target.value }
                        })
                      }
                      placeholder="service_xxxxx"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Template ID</label>
                    <input
                      type="text"
                      value={config.emailJs.templateId}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          emailJs: { ...config.emailJs, templateId: e.target.value }
                        })
                      }
                      placeholder="template_xxxxx"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Public Key (User ID)</label>
                    <input
                      type="text"
                      value={config.emailJs.publicKey}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          emailJs: { ...config.emailJs, publicKey: e.target.value }
                        })
                      }
                      placeholder="YOUR_PUBLIC_KEY"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Export to Flutter Dart Config or JSON */}
              <div
                className={`pt-4 border-t space-y-3 ${
                  isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-semibold">
                      Export Customized Config Bundle
                    </h3>
                    <p className="text-xs text-zinc-500">
                      All edits auto-save in your browser. You can also export Dart config files or JSON.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyDart}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        isDark
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                          : 'border-zinc-300 text-zinc-800 hover:bg-zinc-200/70'
                      }`}
                    >
                      {copiedType === 'dart' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedType === 'dart' ? 'Copied Dart Configs' : 'Copy Flutter Dart Config'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        isDark
                          ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                          : 'border-zinc-300 text-zinc-800 hover:bg-zinc-200/70'
                      }`}
                    >
                      {copiedType === 'json' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedType === 'json' ? 'Copied JSON' : 'Copy JSON'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadJson}
                      style={{ backgroundColor: config.accentColor }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>

                <pre
                  className={`p-3.5 rounded-xl border text-[11px] font-mono-tabular overflow-x-auto max-h-48 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  }`}
                >
                  {generateFlutterConfigExport(config)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
