import React, { useState } from 'react';
import { Startup, Job, City, Sector, WorkMode, JobSource } from '../types';
import { 
  X, 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  SlidersHorizontal, 
  ArrowUpRight, 
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface JobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  startups: Startup[];
  onApplyJob: (job: Job) => void;
  onSelectStartup: (startup: Startup) => void;
  onSyncJobs?: () => void;
  isSyncingJobs?: boolean;
}

export const JobsModal: React.FC<JobsModalProps> = ({
  isOpen,
  onClose,
  jobs,
  startups,
  onApplyJob,
  onSelectStartup,
  onSyncJobs,
  isSyncingJobs = false
}) => {
  const [jobSearch, setJobSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<City>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');

  if (!isOpen) return null;

  const startupsMap = new Map(startups.map((s) => [s._id, s]));

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    if (!job.isActive) return false;
    
    // Search query
    if (jobSearch) {
      const q = jobSearch.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchSkills = job.skills.some((sk) => sk.toLowerCase().includes(q));
      const company = startupsMap.get(job.startupId);
      const matchCompany = company?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchSkills && !matchCompany) return false;
    }

    // City
    if (selectedCity !== 'All' && job.city !== selectedCity) return false;

    // Work Mode
    if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) return false;

    // Experience level
    if (selectedLevel !== 'All' && job.experienceLevel !== selectedLevel) return false;

    // ATS / Careers Source filter
    if (selectedSource !== 'All' && job.source !== selectedSource) return false;

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 animate-fade-in">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-[#0e1a2b] dark:text-slate-100 border border-slate-200/80 dark:border-white/[0.1] overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                NCR Startups Jobs Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official hiring from Greenhouse · Lever · Ashby · Careers Pages (Gurugram & Noida)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSyncJobs && (
              <button
                onClick={onSyncJobs}
                disabled={isSyncingJobs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
                title="Auto-sync live hiring data from Greenhouse, Lever, Ashby, and official careers pages"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncingJobs ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncingJobs ? 'Syncing...' : 'Sync Live ATS'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.08] dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3 dark:border-white/[0.05] dark:bg-black/20 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="Search role, company, skills (e.g. React, Python, Zomato)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-[#132238] dark:text-white"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-1">
            {(['All', 'Gurugram', 'Noida'] as City[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedCity === c
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-[#132238] dark:text-slate-300 dark:hover:bg-white/[0.1]'
                }`}
              >
                {c === 'All' ? 'All NCR' : c}
              </button>
            ))}
          </div>

          {/* ATS Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-slate-200"
          >
            <option value="All">All Sources</option>
            <option value="Greenhouse">Greenhouse</option>
            <option value="Lever">Lever</option>
            <option value="Ashby">Ashby</option>
            <option value="Careers Page">Official Careers</option>
          </select>

          {/* Work Mode */}
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value as WorkMode)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-slate-200"
          >
            <option value="All">All Modes</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Experience level */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-slate-200"
          >
            <option value="All">All Levels</option>
            <option value="Entry">Entry</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead / Principal</option>
          </select>
        </div>

        {/* Jobs List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Showing {filteredJobs.length} active opportunities</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Direct from NCR Startups
            </span>
          </div>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const startup = startupsMap.get(job.startupId);
              return (
                <div
                  key={job._id}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 transition-all hover:border-brand-500 hover:shadow-lg dark:border-white/[0.08] dark:bg-[#132238]/60 dark:hover:border-brand-400"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left info */}
                    <div className="flex items-start gap-3.5">
                      {/* Company Logo */}
                      <div
                        onClick={() => {
                          if (startup) {
                            onClose();
                            onSelectStartup(startup);
                          }
                        }}
                        className="cursor-pointer h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-white/10 flex items-center justify-center font-bold text-xs"
                      >
                        {startup?.logo ? (
                          <img
                            src={startup.logo}
                            alt={startup.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{startup?.name.slice(0, 2)}</span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {job.title}
                          </h3>
                          {job.source && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              job.source === 'Greenhouse'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : job.source === 'Lever'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                : job.source === 'Ashby'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            }`}>
                              {job.source}
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span
                            onClick={() => {
                              if (startup) {
                                onClose();
                                onSelectStartup(startup);
                              }
                            }}
                            className="cursor-pointer font-semibold text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                          >
                            {startup?.name || job.companyName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="h-3 w-3 text-red-500" />
                            {job.location}
                          </span>
                          {(job.coordinates || startup?.coordinates) && (
                            <>
                              <span>•</span>
                              <span 
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10"
                                title="Office Coordinates in NCR [Latitude, Longitude]"
                              >
                                📍 {(job.coordinates || startup!.coordinates)[0].toFixed(4)}, {(job.coordinates || startup!.coordinates)[1].toFixed(4)}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700 dark:bg-white/[0.06] dark:text-slate-300">
                            {job.workMode}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-3 w-3" />
                            {job.postedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Salary & Apply Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                      {job.salaryDisplay && (
                        <div className="font-display font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          {job.salaryDisplay}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <a
                          href={job.applyUrl || startup?.careersUrl || startup?.website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Direct Official Company Application Link"
                        >
                          <span>Direct Apply</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <button
                          onClick={() => onApplyJob(job)}
                          className="rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Quick Apply via NCR LaunchMap"
                        >
                          <span>Quick Apply</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-white/5 dark:bg-white/[0.04] dark:text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-slate-400">
              <Briefcase className="mx-auto h-10 w-10 text-slate-500 mb-2" />
              <p className="font-bold text-sm">No jobs matching your criteria</p>
              <p className="text-xs mt-1">Try changing the search query or selecting "All NCR".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
