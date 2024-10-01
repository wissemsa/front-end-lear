import React, { useEffect } from 'react';
import { X, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { ProjectItem } from '../config/portfolioData';
import { ResilientImage } from './ResilientImage';

interface ProjectLightboxModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onEditProject: (projectId: string) => void;
  onInquireProject: (projectTitle: string) => void;
  isDark: boolean;
  accentColor: string;
}

export const ProjectLightboxModal: React.FC<ProjectLightboxModalProps> = ({
  project,
  onClose,
  onEditProject,
  onInquireProject,
  isDark,
  accentColor
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-project-title"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#0C0C0E] border-zinc-800 text-zinc-100'
            : 'bg-[#F8F8F5] border-zinc-200 text-zinc-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Bar */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md ${
            isDark
              ? 'bg-[#0C0C0E]/90 border-zinc-800'
              : 'bg-[#F8F8F5]/90 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{project.clientOrContext}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onEditProject(project.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200/70'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Edit Project
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study viewer"
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

        {/* High-Resolution Media Frame */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/20">
          <ResilientImage
            src={project.imageUrl}
            alt={project.title}
            fallbackTitle={project.title}
            fallbackSubtitle={project.subtitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
            <p className="text-xs text-zinc-300 mb-2">
              {project.role} · {project.clientOrContext}
            </p>
            <h2
              id="lightbox-project-title"
              className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight max-w-3xl"
            >
              {project.title}
            </h2>
            <p className="text-sm md:text-base text-zinc-200 mt-2 max-w-2xl">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Case Study Breakdown */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Verified Outcome Metric Banner */}
          <div
            className={`p-5 rounded-xl border ${
              isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200/80'
            }`}
          >
            <p className="text-xs text-zinc-500 mb-1">Verified Production Outcome</p>
            <p className="font-mono-tabular text-base md:text-lg font-semibold">
              {project.outcomeMetric}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">01. Executive Summary</h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                {project.summary}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">02. Technical Bottleneck</h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                {project.challenge}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">03. System Architecture</h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                {project.architecture}
              </p>
            </div>
          </div>

          {/* Unboxed Technology Specification */}
          <div
            className={`pt-6 border-t flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            }`}
          >
            <div>
              <p className="text-xs text-zinc-500 mb-1.5"> Core Technology Stack</p>
              <div
                className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono-tabular ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
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
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                      : 'border-zinc-300 text-zinc-800 hover:bg-zinc-200/70'
                  }`}
                >
                  Source Architecture
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                      : 'border-zinc-300 text-zinc-800 hover:bg-zinc-200/70'
                  }`}
                >
                  Live Deployment
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInquireProject(project.title);
                }}
                style={{ backgroundColor: accentColor }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                Request Similar Architecture
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
