import React, { useState } from 'react';
import { Job, Startup } from '../types';
import { X, Send, CheckCircle2, FileText, Upload, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  startup: Startup | null;
  onClose: () => void;
  onSubmitApplication: (jobId: string, applicant: { name: string; email: string; linkedin: string; note: string }) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  startup,
  onClose,
  onSubmitApplication
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job || !startup) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onSubmitApplication(job._id, { name, email, linkedin, note });
    
    // Automatically redirect/open the official company careers portal
    if (directLink) {
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const directLink = job.applyUrl || startup.careersUrl || startup.website;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0e1a2b] dark:text-slate-100 border border-slate-200 dark:border-white/10 animate-scale-in">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Application Dispatched!
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Your profile has been forwarded directly to {startup.name}'s talent acquisition team.
            </p>
          </div>
        ) : (
          <div>
            {/* Header info */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-white/[0.08]">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-white/10 flex items-center justify-center font-bold text-xs">
                {startup.logo ? (
                  <img src={startup.logo} alt={startup.name} className="h-full w-full object-cover" />
                ) : (
                  startup.name.slice(0, 2)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm truncate">
                  Apply for {job.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {startup.name} · {job.location} · <strong className="text-emerald-500">{job.salaryDisplay || 'Competitive'}</strong>
                </p>
              </div>
            </div>

            {/* Direct Official Apply Banner (Direct Link to Company Careers) */}
            <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Direct Official Application</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 truncate">
                  Apply directly on {startup.name}'s verified career portal
                </p>
              </div>
              <a
                href={directLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>Direct Apply</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-white/10"></div></div>
              <span className="relative bg-white dark:bg-[#0e1a2b] px-3 text-[10px] uppercase font-mono text-zinc-400">Or quick-apply below</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    GitHub / Portfolio
                  </label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://github.com/..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Note / Cover Pitch
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tell why you're a great fit for this NCR role..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={job.applyUrl || startup.careersUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:underline dark:text-brand-400 font-medium"
                >
                  Or apply on official site ↗
                </a>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-500 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
