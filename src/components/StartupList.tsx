import React, { useState } from 'react';
import { Startup, Job } from '../types';
import { StartupCard } from './StartupCard';
import { SearchX } from 'lucide-react';

interface StartupListProps {
  startups: Startup[];
  selectedStartup: Startup | null;
  onSelectStartup: (startup: Startup) => void;
  jobs: Job[];
  onOpenJobsForStartup: (startupId: string) => void;
}

export const StartupList: React.FC<StartupListProps> = ({
  startups,
  selectedStartup,
  onSelectStartup,
  jobs,
  onOpenJobsForStartup
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'hiring' | 'name' | 'stage'>('recent');

  const sortedStartups = [...startups].sort((a, b) => {
    if (sortBy === 'recent') {
      return 0; // preserve original data order (recently added first)
    }
    if (sortBy === 'hiring') {
      if (a.isHiring && !b.isHiring) return -1;
      if (!a.isHiring && b.isHiring) return 1;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'stage') {
      return a.stage.localeCompare(b.stage);
    }
    return 0;
  });

  const hiringCount = startups.filter((s) => s.isHiring).length;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#090d14]">
      {/* Top list header (Matching Screenshot) */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.08] px-4 py-3 bg-white dark:bg-[#0c121c]">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-white font-display">
            {startups.length} Startups Found
          </h3>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
            {hiringCount} hiring now
          </p>
        </div>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="text-[11px] text-zinc-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'hiring' | 'name' | 'stage')}
            className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer hover:text-zinc-900 dark:hover:text-white"
          >
            <option value="recent" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Recently Added</option>
            <option value="hiring" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Hiring First</option>
            <option value="name" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Name (A-Z)</option>
            <option value="stage" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Stage</option>
          </select>
        </div>
      </div>

      {/* Cards Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 [scrollbar-width:thin]">
        {sortedStartups.length > 0 ? (
          sortedStartups.map((startup) => {
            const startupJobs = jobs.filter((j) => j.startupId === startup._id && j.isActive);
            return (
              <StartupCard
                key={startup._id}
                startup={startup}
                isSelected={selectedStartup?._id === startup._id}
                onSelect={onSelectStartup}
                jobsCount={startupJobs.length}
                openJobsForStartup={onOpenJobsForStartup}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
              <SearchX className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              No matching startups found
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              Clear your search or adjust city filters to view more companies across NCR.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
