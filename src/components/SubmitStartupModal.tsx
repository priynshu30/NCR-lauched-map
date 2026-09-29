import React, { useState } from 'react';
import { Startup, Sector, Stage } from '../types';
import { X, Building2, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { playHiringToggleSound } from '../utils/audio';

interface SubmitStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartupAdded: (startup: Startup) => void;
}

export const SubmitStartupModal: React.FC<SubmitStartupModalProps> = ({
  isOpen,
  onClose,
  onStartupAdded
}) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState<Sector>('AI & DeepTech');
  const [stage, setStage] = useState<Stage>('Pre-Seed / Seed');
  const [city, setCity] = useState<'Gurugram' | 'Noida' | 'Delhi'>('Noida');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [founders, setFounders] = useState('');
  const [isHiring, setIsHiring] = useState(true);
  const [careersUrl, setCareersUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Approximate default coordinates based on city and area
  const getCoordinates = (): [number, number] => {
    if (city === 'Gurugram') {
      return [28.45 + (Math.random() * 0.05), 77.06 + (Math.random() * 0.04)];
    }
    if (city === 'Noida') {
      return [28.58 + (Math.random() * 0.05), 77.34 + (Math.random() * 0.04)];
    }
    return [28.53 + (Math.random() * 0.05), 77.22 + (Math.random() * 0.04)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !area) return;

    const newStartup: Startup = {
      _id: `startup-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      website: website || 'https://ncrstartups.in',
      logo: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&crop=faces`,
      description: description || `Emerging ${sector} startup based in ${area}, ${city}.`,
      sector,
      stage,
      city,
      area,
      coordinates: getCoordinates(),
      isHiring,
      careersUrl: careersUrl || `${website}/careers`,
      founders: founders.split(',').map((f) => f.trim()).filter(Boolean),
      foundedYear: 2024,
      teamSize: '15-50',
      techStack: ['React', 'TypeScript', 'Node.js', 'Python'],
      socials: {},
      isApproved: true
    };

    playHiringToggleSound(isHiring);
    onStartupAdded(newStartup);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0e1a2b] dark:text-slate-100 border border-slate-200 dark:border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Startup Added to LaunchMap!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              <strong>{name}</strong> is now mapped in {city}. Its custom pin is live on the interactive map view!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.08]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Submit an NCR Startup
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Feature your company or a favorite venture on NCR LaunchMap
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Startup / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Omnicor AI"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    City Hub *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as 'Gurugram' | 'Noida' | 'Delhi')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  >
                    <option value="Noida">Noida</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Area / Corridor *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Sector 62, Candor TechSpace or Cyber City"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as Sector)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white"
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
                    Funding Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as Stage)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white"
                  >
                    <option value="Bootstrapped">Bootstrapped</option>
                    <option value="Pre-Seed / Seed">Pre-Seed / Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B+">Series B+</option>
                    <option value="Unicorn">Unicorn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brief Pitch / Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What product does this startup build?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-[#132238] dark:text-white resize-none"
                />
              </div>

              {/* Is Hiring Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hiring-toggle-new"
                  checked={isHiring}
                  onChange={(e) => setIsHiring(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="hiring-toggle-new" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1">
                  <span>Currently Actively Hiring</span>
                  <span className="text-[10px] text-emerald-500 font-bold">(Renders Anti-Gravity Pulse Pin)</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-500 transition-all shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Submit & Place on Map</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
