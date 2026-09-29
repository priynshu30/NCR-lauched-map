import React, { useState } from 'react';
import { Startup, Job } from '../types';
import { 
  X, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Code, 
  Train,
  ArrowRight,
  Share2
} from 'lucide-react';

interface StartupDetailDrawerProps {
  startup: Startup | null;
  onClose: () => void;
  jobs: Job[];
  onApplyJob: (job: Job) => void;
}

const getMetroStation = (area: string, city: string) => {
  const text = `${area} ${city}`.toLowerCase();
  if (text.includes('cyber city') || text.includes('dlf')) return 'IndusInd Bank Cyber City (Rapid Metro)';
  if (text.includes('golf course')) return 'Sector 54 Chowk (Rapid Metro)';
  if (text.includes('sector 62')) return 'Noida Electronic City / Sector 62 (Blue Line)';
  if (text.includes('sector 125') || text.includes('sector 126') || text.includes('expressway')) return 'Noida Sector 137 / 142 (Aqua Line)';
  if (text.includes('sector 16')) return 'Noida Sector 16 (Blue Line)';
  if (text.includes('okhla')) return 'Okhla NSIC / Harkesh Nagar (Magenta Line)';
  if (text.includes('aerocity')) return 'Delhi Aerocity (Airport Express)';
  if (text.includes('saket')) return 'Saket / Malviya Nagar (Yellow Line)';
  if (text.includes('connaught place')) return 'Rajiv Chowk (Blue/Yellow Line)';
  if (city === 'Gurugram') return 'Millennium City Centre (Yellow Line)';
  if (city === 'Noida') return 'Botanical Garden (Blue/Magenta Line)';
  return 'Delhi Metro Network';
};

export const StartupDetailDrawer: React.FC<StartupDetailDrawerProps> = ({
  startup,
  onClose,
  jobs,
  onApplyJob
}) => {
  const [copied, setCopied] = useState(false);

  if (!startup) return null;

  const activeJobs = jobs.filter((j) => j.startupId === startup._id && j.isActive);
  const metroStation = getMetroStation(startup.area, startup.city);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-[#0c121c] dark:text-zinc-100 border-l border-[#EBEBEB] dark:border-white/[0.08] overflow-hidden animate-scale-in">
        
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-4 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              Registry Record
            </span>
            {startup.isHiring && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Anti-Gravity Hiring Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyLink}
              title="Copy share link"
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:thin]">
          
          {/* Company Profile Header */}
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:border-white/10 flex items-center justify-center font-mono font-bold text-base text-zinc-800 dark:text-zinc-200">
              <img
                src={startup.logo}
                alt={startup.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute -z-10">{startup.name.slice(0, 2).toUpperCase()}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white truncate">
                  {startup.name}
                </h2>
                <CheckCircle2 className="h-4 w-4 text-zinc-400 shrink-0" />
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{startup.area}, <strong className="text-zinc-800 dark:text-zinc-200">{startup.city}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl border border-[#EBEBEB] dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.02] p-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400">Sector</span>
              <p className="mt-0.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{startup.sector}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400">Stage</span>
              <p className="mt-0.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{startup.stage}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400">Headcount</span>
              <p className="mt-0.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">{startup.teamSize}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400">Founded</span>
              <p className="mt-0.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">{startup.foundedYear}</p>
            </div>
          </div>

          {/* Metro Transit Connectivity */}
          <div className="flex items-center gap-2.5 rounded-xl border border-[#EBEBEB] dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-xs">
            <Train className="h-4 w-4 text-zinc-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Nearest Metro Connectivity</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate block">{metroStation}</span>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Overview
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {startup.description}
            </p>
          </div>

          {/* Tech Stack */}
          {startup.techStack && startup.techStack.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Engineering Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {startup.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono text-zinc-700 dark:border-white/10 dark:bg-[#132238] dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Founders */}
          {startup.founders && startup.founders.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Founding Team
              </h3>
              <div className="flex flex-wrap gap-2">
                {startup.founders.map((f) => (
                  <span
                    key={f}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Headcount / Open Roles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Open Headcount ({activeJobs.length})
              </h3>
              {startup.careersUrl && (
                <a
                  href={startup.careersUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <span>Careers site</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {activeJobs.length > 0 ? (
              <div className="space-y-2.5">
                {activeJobs.map((job) => (
                  <div
                    key={job._id}
                    className="group rounded-xl border border-[#EBEBEB] bg-white p-3.5 transition-all hover:border-zinc-400 dark:border-white/[0.08] dark:bg-[#132238]/40 dark:hover:border-white/25"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                            {job.title}
                          </h4>
                          {job.source && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                              {job.source}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap">
                          <span>{job.workMode}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          {(job.coordinates || startup.coordinates) && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-zinc-400">
                                📍 {(job.coordinates || startup.coordinates)[0].toFixed(4)}, {(job.coordinates || startup.coordinates)[1].toFixed(4)}
                              </span>
                            </>
                          )}
                          {job.salaryDisplay && (
                            <>
                              <span>•</span>
                              <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">{job.salaryDisplay}</strong>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={job.applyUrl || startup.careersUrl || startup.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors flex items-center gap-1 cursor-pointer"
                          title="Direct application on company official career portal"
                        >
                          <span>Direct Apply</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <button
                          onClick={() => onApplyJob(job)}
                          className="rounded-lg border border-zinc-200 dark:border-white/10 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                          title="Quick apply through NCR LaunchMap"
                        >
                          Quick Form
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#EBEBEB] dark:border-white/[0.08] p-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                No active positions logged right now. Check their official careers portal directly.
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#EBEBEB] p-4 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-black/20 flex items-center justify-between gap-3">
          <a
            href={startup.website}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2 text-center text-xs font-medium rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
          >
            Visit Website ↗
          </a>
          {startup.careersUrl && (
            <a
              href={startup.careersUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 shadow-xs"
            >
              Careers Portal ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
