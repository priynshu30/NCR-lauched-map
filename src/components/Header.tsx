import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Bell, 
  Send,
  Zap,
  Menu,
  X,
  Building2,
  Briefcase,
  Compass
} from 'lucide-react';
import { City, Sector, Stage, ViewMode } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: City;
  setSelectedCity: (c: City) => void;
  selectedSector: Sector;
  setSelectedSector: (s: Sector) => void;
  selectedStage: Stage;
  setSelectedStage: (st: Stage) => void;
  onlyHiring: boolean;
  setOnlyHiring: (oh: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  soundOn: boolean;
  setSoundOn: (s: boolean) => void;
  totalStartups: number;
  hiringCount: number;
  totalJobs: number;
  onOpenSearch: () => void;
  onOpenJobs: () => void;
  onOpenPostJob: () => void;
  onOpenSubmitStartup: () => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  setIsDark,
  soundOn,
  setSoundOn,
  totalJobs,
  hiringCount,
  onOpenSearch,
  onOpenJobs,
  onOpenPostJob,
  onOpenSubmitStartup,
  onOpenSimulator
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToMap = () => {
    const el = document.getElementById('map-container-section');
    el?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-40 flex shrink-0 flex-col border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#060b13]/95 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3">
        
        {/* Left: Bespoke Modern Vector Brand Logo */}
        <div
          onClick={scrollToTop}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 group select-none"
        >
          {/* Emblem Icon with Gradient Glow */}
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2744] via-[#12365e] to-[#0a192f] p-0.5 shadow-md shadow-teal-950/20 ring-1 ring-teal-400/25 group-hover:ring-teal-400/60 transition-all duration-300 group-hover:scale-105">
            <div className="relative flex h-full w-full items-center justify-center rounded-[10px] bg-[#071322] overflow-hidden">
              {/* Subtle ambient lighting */}
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-teal-400/25 blur-sm pointer-events-none" />
              <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-emerald-400/20 blur-sm pointer-events-none" />
              
              {/* Map beacon & Pin Motif */}
              <svg className="h-5 w-5 text-teal-400 group-hover:text-teal-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" fill="#10b981" stroke="#34d399" strokeWidth="1" />
              </svg>
              
              {/* Pulse status pip */}
              <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
            </div>
          </div>

          {/* Clean Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white leading-none">
                NCR<span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent ml-0.5">LaunchMap</span>
              </span>
              <span className="inline-flex items-center rounded-sm bg-teal-500/10 px-1 py-0.2 text-[8px] sm:text-[9px] font-mono font-bold text-teal-600 dark:text-teal-400 border border-teal-500/20">
                LIVE
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 dark:text-zinc-400 tracking-wider uppercase mt-0.5 flex items-center gap-1">
              <span>Delhi</span>
              <span className="text-teal-500 font-bold">•</span>
              <span>Gurugram</span>
              <span className="text-teal-500 font-bold">•</span>
              <span>Noida</span>
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <button
            onClick={scrollToTop}
            className="relative text-teal-600 dark:text-teal-400 py-1 transition-colors cursor-pointer font-bold flex items-center gap-1"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />
          </button>
          <button
            onClick={scrollToMap}
            className="hover:text-zinc-900 dark:hover:text-white py-1 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Compass className="h-3.5 w-3.5 text-zinc-400" />
            <span>Map</span>
          </button>
          <button
            onClick={onOpenJobs}
            className="hover:text-zinc-900 dark:hover:text-white py-1 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
            <span>Jobs</span>
            {totalJobs > 0 && (
              <span className="ml-0.5 text-[9px] font-mono bg-teal-500/15 text-teal-600 dark:text-teal-400 px-1 rounded-sm">
                {totalJobs}
              </span>
            )}
          </button>
          <button
            onClick={onOpenPostJob}
            className="hover:text-zinc-900 dark:hover:text-white py-1 transition-colors cursor-pointer"
          >
            Post a Job
          </button>
          <button
            onClick={onOpenSubmitStartup}
            className="hover:text-zinc-900 dark:hover:text-white py-1 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Add Startup</span>
          </button>
          <button
            onClick={onOpenSimulator}
            className="hover:text-zinc-900 dark:hover:text-white py-1 transition-colors cursor-pointer flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
          >
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>Hiring Radar</span>
          </button>
        </nav>

        {/* Right: Search, Notification, Sound, Theme, CTA & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search startups"
            title="Search (Cmd+K / Ctrl+K)"
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Notification Bell with Dynamic Active Jobs Count */}
          <div className="relative">
            <button
              onClick={onOpenJobs}
              title={`View ${totalJobs} open roles`}
              className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <Bell className="h-4 w-4" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
              {totalJobs > 99 ? '99+' : totalJobs}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundOn(!soundOn)}
            title={soundOn ? 'Metro sound enabled (click to mute)' : 'Sound muted (click to enable)'}
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4 text-zinc-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-700" />}
          </button>

          {/* Orange Post a Job CTA Button */}
          <button
            onClick={onOpenPostJob}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Post a Job</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex md:hidden h-8.5 w-8.5 items-center justify-center rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer ml-1"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-white/[0.08] bg-white/98 dark:bg-[#070d18]/98 px-4 py-3 flex flex-col gap-2 shadow-xl animate-fade-in backdrop-blur-2xl">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-left"
          >
            <MapPin className="h-4 w-4 text-teal-500" />
            <span>Home</span>
          </button>
          <button
            onClick={scrollToMap}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-left"
          >
            <Compass className="h-4 w-4 text-blue-500" />
            <span>Explore Map</span>
          </button>
          <button
            onClick={() => { onOpenJobs(); setMobileMenuOpen(false); }}
            className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-left"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-500" />
              <span>Browse Jobs</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
              {totalJobs} Active
            </span>
          </button>
          <button
            onClick={() => { onOpenPostJob(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-left"
          >
            <Send className="h-4 w-4" />
            <span>Post a Job Free</span>
          </button>
          <button
            onClick={() => { onOpenSubmitStartup(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-left"
          >
            <Building2 className="h-4 w-4 text-purple-500" />
            <span>Add Your Startup</span>
          </button>
          <button
            onClick={() => { onOpenSimulator(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-left"
          >
            <Zap className="h-4 w-4" />
            <span>Anti-Gravity Hiring Radar</span>
          </button>
        </div>
      )}
    </header>
  );
};
