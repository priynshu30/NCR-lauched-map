import React from 'react';
import { Startup } from '../types';
import { MapPin, ArrowUpRight, Train, ChevronRight } from 'lucide-react';

interface StartupCardProps {
  startup: Startup;
  isSelected: boolean;
  onSelect: (startup: Startup) => void;
  openJobsForStartup?: (startupId: string) => void;
  jobsCount?: number;
}

// Map authentic metro line connections across NCR hubs
const getMetroLine = (area: string, city: string) => {
  const text = `${area} ${city}`.toLowerCase();
  if (text.includes('cyber city') || text.includes('dlf')) return 'Rapid Metro';
  if (text.includes('golf course')) return 'Sector 54 Chowk (Rapid Metro)';
  if (text.includes('sector 62')) return 'Sector 62 (Blue Line)';
  if (text.includes('sector 125') || text.includes('sector 126') || text.includes('expressway')) return 'Noida Expressway (Aqua Line)';
  if (text.includes('okhla')) return 'Okhla NSIC (Magenta Line)';
  if (text.includes('aerocity')) return 'Delhi Aerocity (Airport Express)';
  if (text.includes('connaught place')) return 'Rajiv Chowk (Blue/Yellow Line)';
  if (text.includes('saket')) return 'Saket (Yellow Line)';
  if (city === 'Gurugram') return 'Yellow / Rapid Metro';
  if (city === 'Noida') return 'Blue / Aqua Line';
  return 'Delhi Metro Network';
};

export const StartupCard: React.FC<StartupCardProps> = ({
  startup,
  isSelected,
  onSelect,
  jobsCount = 0
}) => {
  const metroLine = getMetroLine(startup.area, startup.city);

  return (
    <article
      onClick={() => onSelect(startup)}
      className={`group relative rounded-2xl border p-4 transition-all duration-150 cursor-pointer select-none ${
        isSelected
          ? 'border-zinc-950 bg-zinc-50/90 dark:border-white/40 dark:bg-white/[0.06] shadow-sm'
          : 'border-[#EBEBEB] bg-white hover:border-zinc-300 dark:border-white/[0.08] dark:bg-[#0c121c] dark:hover:border-white/[0.16]'
      }`}
    >
      {/* Header: Logo, Title, City */}
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/80 dark:bg-zinc-800/80 dark:border-white/10 flex items-center justify-center font-mono font-bold text-xs text-zinc-800 dark:text-zinc-200">
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
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-display font-bold text-sm tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
              {startup.name}
            </h3>

            {/* Anti-Gravity Live Indicator */}
            {startup.isHiring && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                HIRING
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{startup.city}</span>
            <span>·</span>
            <span className="truncate">{startup.area}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
        {startup.description}
      </p>

      {/* Transit Proximity */}
      <div className="mt-2.5 flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
        <Train className="h-3 w-3 shrink-0 text-zinc-400" />
        <span className="truncate">{metroLine}</span>
      </div>

      {/* Chips: Sector & Stage */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-zinc-100 dark:bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-white/[0.05]">
          {startup.sector}
        </span>
        <span className="rounded-md bg-zinc-100 dark:bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-white/[0.05]">
          {startup.stage}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono ml-auto">
          {startup.foundedYear}
        </span>
      </div>

      {/* Footer link */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
          {startup.isHiring ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span>●</span>
              {jobsCount > 0 ? `${jobsCount} active roles` : 'Open headcount'}
            </span>
          ) : (
            'Not actively hiring'
          )}
        </span>

        <div className="flex items-center gap-2.5">
          {startup.isHiring && startup.careersUrl && (
            <a
              href={startup.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline flex items-center gap-0.5 cursor-pointer"
              title={`Visit ${startup.name}'s official careers portal`}
            >
              <span>Careers ↗</span>
            </a>
          )}
          <span className="flex items-center gap-0.5 text-[11px] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
            <span>Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
