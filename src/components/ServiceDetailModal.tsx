import React, { useEffect } from 'react';
import { X, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { ServiceItem } from '../config/portfolioData';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectServiceForContact: (serviceTitle: string) => void;
  onEditService: (serviceId: string) => void;
  isDark: boolean;
  accentColor: string;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectServiceForContact,
  onEditService,
  isDark,
  accentColor
}) => {
  useEffect(() => {
    if (!service) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 md:p-10 ${
          isDark
            ? 'bg-[#0C0C0E] border-zinc-800 text-zinc-100'
            : 'bg-[#F8F8F5] border-zinc-200 text-zinc-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="font-mono-tabular text-xs text-zinc-500 mb-1">
              {service.number} Service Blueprint & Engagement Scope
            </p>
            <h2
              id="service-modal-title"
              className="font-display text-2xl md:text-3xl font-bold tracking-tight"
            >
              {service.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEditService(service.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200/70'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close service blueprint modal"
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

        <p
          className={`text-sm md:text-base leading-relaxed mb-6 ${
            isDark ? 'text-zinc-300' : 'text-zinc-700'
          }`}
        >
          {service.summary}
        </p>

        {/* Deliverables */}
        <div
          className={`py-6 border-y space-y-3 ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}
        >
          <h3 className="text-xs font-semibold text-zinc-500">
            Concrete Engineering Deliverables
          </h3>
          <ul className="space-y-2.5">
            {service.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-baseline gap-3 text-sm">
                <span className="font-mono-tabular text-xs text-zinc-500 shrink-0">
                  0{idx + 1}.
                </span>
                <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quantitative Terms & Proof */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Typical Engagement Horizon</p>
            <p className="font-mono-tabular text-sm font-semibold">{service.timeline}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Typical Sprint Investment</p>
            <p className="font-mono-tabular text-sm font-semibold">
              {service.investmentRange}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-zinc-500 mb-1">Substantiated Track Record</p>
            <p className="text-sm font-medium">{service.proofHighlight}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isDark
                ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                : 'border-zinc-300 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectServiceForContact(service.title);
            }}
            style={{ backgroundColor: accentColor }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Book This Engagement Scope
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
