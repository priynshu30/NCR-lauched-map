import React, { useState } from 'react';
import { Startup, Job, Sector, WorkMode } from '../types';
import { X, PlusCircle, Sparkles, Building2, Briefcase, Zap } from 'lucide-react';
import { playHiringToggleSound } from '../utils/audio';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  startups: Startup[];
  onJobCreated: (newJob: Job, updatedStartupId: string) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  startups,
  onJobCreated
}) => {
  const [selectedStartupId, setSelectedStartupId] = useState(startups[0]?._id || '');
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState<Sector>('AI & DeepTech');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Mid' | 'Senior' | 'Lead'>('Senior');
  const [salaryDisplay, setSalaryDisplay] = useState('₹25 - ₹40 LPA');
  const [skills, setSkills] = useState('React, TypeScript, Node.js');
  const [applyUrl, setApplyUrl] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const currentStartup = startups.find((s) => s._id === selectedStartupId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStartupId || !title) return;

    const newJob: Job = {
      _id: `job-${Date.now()}`,
      startupId: selectedStartupId,
      title,
      type: 'Full-time',
      workMode: workMode === 'All' ? 'Hybrid' : workMode,
      location: `${currentStartup?.area || 'NCR'}, ${currentStartup?.city || 'Noida'}`,
      city: currentStartup?.city === 'Delhi' ? 'Delhi' : currentStartup?.city === 'Gurugram' ? 'Gurugram' : 'Noida',
      sector,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      salaryDisplay,
      currency: 'INR',
      applyUrl: applyUrl || currentStartup?.careersUrl || currentStartup?.website || 'https://www.linkedin.com/jobs/',
      description: description || `Join ${currentStartup?.name} in scaling cutting-edge engineering systems.`,
      isActive: true,
      postedAt: 'Just now',
      experienceLevel
    };

    playHiringToggleSound(true);
    onJobCreated(newJob, selectedStartupId);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0e1a2b] dark:text-slate-100 border border-slate-200 dark:border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {showSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 animate-bounce">
              <Zap className="h-8 w-8 fill-emerald-500" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Anti-Gravity Effect Triggered!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              <strong>{currentStartup?.name}</strong> has been promoted to <span className="text-emerald-500 font-bold">Actively Hiring</span>. Its map marker is now glowing green with live pulse animation!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-emerald-400 dark:bg-white dark:text-slate-900">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Post a Job at an NCR Startup
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instantly activates green hiring pulse on the interactive LaunchMap
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select NCR Startup *
                </label>
                <select
                  value={selectedStartupId}
                  onChange={(e) => setSelectedStartupId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-[#132238] dark:text-white"
                >
                  {startups.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.area}, {s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Job Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer, Founding Product Designer"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as Sector)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  >
                    <option value="AI & DeepTech">AI & DeepTech</option>
                    <option value="FinTech">FinTech</option>
                    <option value="SaaS & Enterprise">SaaS & Enterprise</option>
                    <option value="Consumer Tech">Consumer Tech</option>
                    <option value="E-Commerce & Quick Comm">E-Commerce</option>
                    <option value="EdTech">EdTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="Logistics & Mobility">Logistics</option>
                    <option value="CleanTech">CleanTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Work Mode
                  </label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as 'Entry' | 'Mid' | 'Senior' | 'Lead')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  >
                    <option value="Entry">Entry (0-2 yrs)</option>
                    <option value="Mid">Mid (2-5 yrs)</option>
                    <option value="Senior">Senior (5-8 yrs)</option>
                    <option value="Lead">Lead (8+ yrs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={salaryDisplay}
                    onChange={(e) => setSalaryDisplay(e.target.value)}
                    placeholder="e.g. ₹20 - ₹35 LPA"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Application / Careers Link
                  </label>
                  <input
                    type="url"
                    value={applyUrl}
                    onChange={(e) => setApplyUrl(e.target.value)}
                    placeholder="https://company.com/jobs/..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, PyTorch, LangChain, Distributed Systems"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Job Description & Impact
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key responsibilities and impact..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-all shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span>Publish & Activate Hiring Pin</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
