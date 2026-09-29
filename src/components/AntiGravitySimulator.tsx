import React, { useState } from 'react';
import { Startup } from '../types';
import { X, Zap, RefreshCw, Check, Flame, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { playHiringToggleSound } from '../utils/audio';

interface AntiGravitySimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  startups: Startup[];
  onToggleHiring: (startupId: string, isHiring: boolean) => void;
  onRunAutoExpireCron: () => void;
}

export const AntiGravitySimulator: React.FC<AntiGravitySimulatorProps> = ({
  isOpen,
  onClose,
  startups,
  onToggleHiring,
  onRunAutoExpireCron
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [logs, setLogs] = useState<string[]>([
    'Anti-Gravity Engine v1.0 initialized.',
    'Listening for real-time hiring state transitions across NCR...'
  ]);

  if (!isOpen) return null;

  const handleToggle = (startup: Startup) => {
    const nextState = !startup.isHiring;
    playHiringToggleSound(nextState);
    onToggleHiring(startup._id, nextState);

    const logEntry = nextState
      ? `[ANTI-GRAVITY ACTIVATED] ${startup.name} (${startup.city}) marked HIRING: Pin transformed to Pulsing Emerald, elevated in ranking.`
      : `[ANTI-GRAVITY EXPIRED] ${startup.name} (${startup.city}) hiring closed: Pin reverted to Standard Indigo.`;

    setLogs((prev) => [logEntry, ...prev.slice(0, 8)]);
  };

  const handleCron = () => {
    onRunAutoExpireCron();
    setLogs((prev) => [
      `[CRON TRIGGERED] Daily Anti-Gravity audit ran: Scanned all NCR startups, verified active job postings.`,
      ...prev.slice(0, 8)
    ]);
  };

  const filteredStartups = startups.filter((s) =>
    s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.area.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-[#0e1a2b] dark:text-slate-100 border border-slate-200 dark:border-white/10 animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/[0.08] bg-slate-50/50 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-xs">
              <Zap className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Anti-Gravity Hiring Engine Simulator
                </h2>
                <span className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly toggle hiring states to watch map pins transform in real time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action toolbar & Cron simulator */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-3 dark:border-white/[0.06] bg-slate-50/30 dark:bg-black/10">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search startup to toggle..."
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none dark:border-white/10 dark:bg-[#132238] dark:text-white flex-1 min-w-[180px]"
          />

          <button
            onClick={handleCron}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-400/20 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Trigger Daily Auto-Expire Cron</span>
          </button>
        </div>

        {/* Live Terminal Log */}
        <div className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-900 text-slate-200 px-4 py-2.5 font-mono text-[11px] flex items-start gap-2 max-h-24 overflow-y-auto">
          <Terminal className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-slate-300">
                <span className="text-slate-500 mr-1.5">&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Startups Toggle List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {filteredStartups.map((startup) => (
            <div
              key={startup._id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#132238]/60"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-white/10 flex items-center justify-center font-bold text-xs">
                  {startup.logo ? (
                    <img src={startup.logo} alt={startup.name} className="h-full w-full object-cover" />
                  ) : (
                    startup.name.slice(0, 2)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {startup.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">({startup.city})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {startup.area} · {startup.sector}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[11px] font-semibold ${startup.isHiring ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {startup.isHiring ? 'Hiring (Green Pin)' : 'Normal Pin'}
                </span>

                <button
                  onClick={() => handleToggle(startup)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    startup.isHiring ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      startup.isHiring ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 dark:border-white/[0.08] bg-slate-50/60 dark:bg-black/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Anti-Gravity Rule: Job Creation = Instant Green Pin Pulse</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
