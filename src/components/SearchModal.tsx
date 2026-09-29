import React, { useEffect, useRef } from 'react';
import { Startup, Job } from '../types';
import { Search, MapPin, Briefcase, ExternalLink, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  startups: Startup[];
  jobs: Job[];
  onSelectStartup: (startup: Startup) => void;
  onSelectJob: (job: Job) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  startups,
  jobs,
  onSelectStartup,
  onSelectJob
}) => {
  const [query, setQuery] = React.useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle will be handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStartups = query.trim()
    ? startups.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.sector.toLowerCase().includes(query.toLowerCase()) ||
        s.area.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase()) ||
        s.techStack?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : startups.slice(0, 5);

  const filteredJobs = query.trim()
    ? jobs.filter((j) =>
        j.title.toLowerCase().includes(query.toLowerCase()) ||
        j.skills.some((sk) => sk.toLowerCase().includes(query.toLowerCase())) ||
        j.location.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xl dark:border-white/[0.12] dark:bg-[#0c121c] dark:text-zinc-100">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-200 dark:border-white/[0.08] px-4 py-3">
          <Search className="h-4 w-4 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NCR startups, sectors, roles, or areas (e.g. Zomato, AI, Sector 62)..."
            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-white dark:placeholder-zinc-500 font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Startups section */}
          <div>
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Startups & Companies
            </div>
            <div className="mt-1 space-y-1">
              {filteredStartups.map((s) => (
                <div
                  key={s._id}
                  onClick={() => {
                    onSelectStartup(s);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.06] cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center font-bold text-[11px] text-zinc-700 dark:text-zinc-300 shrink-0">
                      {s.logo ? (
                        <img src={s.logo} alt={s.name} className="h-full w-full object-cover" />
                      ) : (
                        s.name.slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                          {s.name}
                        </span>
                        {s.isHiring && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            HIRING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {s.area}, {s.city} · {s.sector}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Roles section */}
          {filteredJobs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Active Job Openings
              </div>
              <div className="mt-1 space-y-1">
                {filteredJobs.map((j) => (
                  <div
                    key={j._id}
                    onClick={() => {
                      onSelectJob(j);
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.06] cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                        {j.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {j.location} · {j.salaryDisplay || 'Competitive'} · {j.workMode}
                      </div>
                    </div>
                    <span className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold shrink-0">
                      Apply
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-zinc-200 dark:border-white/[0.08] px-4 py-2 text-[11px] text-zinc-400 flex items-center justify-between bg-zinc-50/50 dark:bg-black/20">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono">Delhi NCR Startup Registry</span>
        </div>
      </div>
    </div>
  );
};
