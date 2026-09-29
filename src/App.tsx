import React, { useState, useEffect, useMemo } from 'react';
import { initialStartups } from './data/startupsData';
import { initialJobs } from './data/jobsData';
import { Startup, Job, City, Sector, Stage, ViewMode } from './types';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { StartupList } from './components/StartupList';
import { StartupDetailDrawer } from './components/StartupDetailDrawer';
import { SearchModal } from './components/SearchModal';
import { JobsModal } from './components/JobsModal';
import { ApplyModal } from './components/ApplyModal';
import { PostJobModal } from './components/PostJobModal';
import { SubmitStartupModal } from './components/SubmitStartupModal';
import { AntiGravitySimulator } from './components/AntiGravitySimulator';
import { SkylineFooter } from './components/SkylineFooter';
import { isSoundEnabled, toggleSound } from './utils/audio';
import { runAtsSync } from './services/atsSyncService';
import { useBackendJobs } from './hooks/useBackendJobs';
import { AnimatedCounter } from './components/AnimatedCounter';
import { 
  MapPin, 
  Building2, 
  Sparkles, 
  Search, 
  ChevronDown, 
  Briefcase, 
  Plus, 
  Zap, 
  ArrowRight, 
  Train, 
  Star,
  LayoutGrid,
  SlidersHorizontal,
  Volume2,
  ExternalLink
} from 'lucide-react';
import { MetroTrack } from './components/MetroTrack';
import { HeroSearchBar } from './components/HeroSearchBar';

// City options
const cities: City[] = ['All', 'Gurugram', 'Noida', 'Delhi', 'Faridabad', 'Ghaziabad'];
const sectors: Sector[] = ['All', 'FinTech', 'AI & DeepTech', 'SaaS & Enterprise', 'E-Commerce & Quick Comm', 'EdTech', 'HealthTech', 'Logistics & Mobility', 'Consumer Tech', 'CleanTech'];
const stages: Stage[] = ['All', 'Bootstrapped', 'Pre-Seed / Seed', 'Series A', 'Series B+', 'Unicorn', 'Public'];

export const App: React.FC = () => {
  // Theme & Sound state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ncr_theme');
      if (stored) return stored === 'dark';
      return false; // Default clean light mode matching screenshot
    }
    return false;
  });

  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());

  // Dynamic Persistent Data states with versioned storage (v5: Greenhouse/Lever/Ashby ATS & coordinates)
  const [startups, setStartups] = useState<Startup[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ncr_startups_v5');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return initialStartups;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ncr_jobs_v5');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return initialJobs;
  });

  // Save changes to localStorage dynamically
  useEffect(() => {
    localStorage.setItem('ncr_startups_v5', JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem('ncr_jobs_v5', JSON.stringify(jobs));
  }, [jobs]);

  // Real ATS Auto-Sync State (Greenhouse, Lever, Ashby, Official Careers)
  const [isSyncingJobs, setIsSyncingJobs] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [heroBgLoaded, setHeroBgLoaded] = useState(false);

  const handleSyncJobs = async () => {
    setIsSyncingJobs(true);
    try {
      const { mergedJobs, report } = await runAtsSync(jobs);
      setJobs(mergedJobs);
      if (report.syncedJobsCount > 0) {
        showToast(`⚡ Synced ${report.syncedJobsCount} live jobs from official ATS boards!`);
      }
      setSyncStatus(`Synced at ${report.lastSyncedAt}`);
      // Also refresh from backend if online
      refetchBackendJobs();
    } catch (e) {
      console.error('ATS Job sync error:', e);
    } finally {
      setIsSyncingJobs(false);
    }
  };

  // Automatic background sync on app load & every 30 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSyncJobs();
    }, 2500);

    const interval = setInterval(() => {
      handleSyncJobs();
    }, 30 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City>('All');
  const [selectedSector, setSelectedSector] = useState<Sector>('All');
  const [selectedStage, setSelectedStage] = useState<Stage>('All');
  const [onlyHiring, setOnlyHiring] = useState<boolean>(false);
  const [onlyFounderHiring, setOnlyFounderHiring] = useState<boolean>(false);

  // ── Backend jobs (Express/MongoDB) with graceful static fallback ───────────
  const {
    jobs: backendJobs,
    hiringCompanies,
    backendOnline,
    loading: backendLoading,
    refetch: refetchBackendJobs,
  } = useBackendJobs({
    lat: 28.52,
    lng: 77.22,
    radius: 50,
    search: searchQuery || undefined,
    founder: onlyFounderHiring || undefined,
    limit: 200,
  });

  // Merge: backend jobs take priority; fall back to static jobs when backend is offline
  // We keep jobs state as local writeable copy so manual posts/ATSsync still work
  useEffect(() => {
    if (backendJobs.length > 0) {
      setJobs((prev) => {
        // Combine backend jobs with any manually posted jobs not in backend
        const backendIds = new Set(backendJobs.map((j) => j._id));
        const manualOnly = prev.filter((j) => !backendIds.has(j._id));
        return [...backendJobs, ...manualOnly];
      });
    }
  }, [backendJobs]);

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isSubmitStartupOpen, setIsSubmitStartupOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => { setToastMessage(null); }, 3800);
  };

  // Sync Dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('ncr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('ncr_theme', 'light');
    }
  }, [isDark]);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSoundToggle = (val?: boolean) => {
    const nextVal = typeof val === 'boolean' ? val : !soundOn;
    toggleSound();
    setSoundOn(nextVal);
  };

  // Filter startups
  const filteredStartups = useMemo(() => {
    return startups.filter((startup) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = startup.name.toLowerCase().includes(q);
        const matchArea = startup.area.toLowerCase().includes(q);
        const matchCity = startup.city.toLowerCase().includes(q);
        const matchSector = startup.sector.toLowerCase().includes(q);
        const matchTech = startup.techStack?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchArea && !matchCity && !matchSector && !matchTech) return false;
      }
      if (selectedCity !== 'All' && startup.city !== selectedCity) return false;
      if (selectedSector !== 'All' && startup.sector !== selectedSector) return false;
      if (selectedStage !== 'All' && startup.stage !== selectedStage) return false;
      if (onlyHiring && !startup.isHiring) return false;
      return true;
    });
  }, [startups, searchQuery, selectedCity, selectedSector, selectedStage, onlyHiring]);

  const handleJobCreated = (newJob: Job, updatedStartupId: string) => {
    setJobs((prev) => [newJob, ...prev]);
    setStartups((prev) => prev.map((s) => (s._id === updatedStartupId ? { ...s, isHiring: true } : s)));
    const affected = startups.find((s) => s._id === updatedStartupId);
    showToast(`⚡ Anti-Gravity triggered: ${affected?.name || 'Startup'} map pin transformed to glowing green!`);
  };

  const handleStartupAdded = (newStartup: Startup) => {
    setStartups((prev) => [newStartup, ...prev]);
    setSelectedStartup(newStartup);
    showToast(`🏢 ${newStartup.name} registered on Delhi NCR LaunchMap!`);
  };

  const handleToggleHiring = (startupId: string, isHiring: boolean) => {
    setStartups((prev) => prev.map((s) => (s._id === startupId ? { ...s, isHiring } : s)));
  };

  const handleRunAutoExpireCron = () => {
    const activeStartupIds = new Set(jobs.filter((j) => j.isActive).map((j) => j.startupId));
    setStartups((prev) => prev.map((s) => {
      if (!activeStartupIds.has(s._id) && s.isHiring) return { ...s, isHiring: false };
      return s;
    }));
    showToast('🔄 Auto-Expire Cron executed: Non-hiring pins reverted.');
  };

  const hiringCount = startups.filter((s) => s.isHiring).length;
  const activeJobsCount = jobs.filter((j) => j.isActive).length;
  const featuredStartups = startups.filter((s) => s.featured || s.isHiring).slice(0, 6);
  const latestJobs = jobs.filter((j) => j.isActive).slice(0, 5);
  const startupsMap = new Map(startups.map((s) => [s._id, s]));

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#06090e] font-sans antialiased text-zinc-900 dark:text-zinc-100">

      {/* ── HEADER ── */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        onlyHiring={onlyHiring}
        setOnlyHiring={setOnlyHiring}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDark={isDark}
        setIsDark={setIsDark}
        soundOn={soundOn}
        setSoundOn={handleSoundToggle}
        totalStartups={startups.length}
        hiringCount={hiringCount}
        totalJobs={activeJobsCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenJobs={() => setIsJobsModalOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenSubmitStartup={() => setIsSubmitStartupOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* ── MAIN SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:thin]">

        {/* ══════════════════════════════════
            HERO SECTION with Metro Animation
        ══════════════════════════════════ */}
        <section className="relative w-full min-h-[380px] flex flex-col justify-between">
          {/* Real NCR city / metro photo background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#060d1f]">
            <img
              src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80&auto=format&fit=crop"
              alt="Delhi NCR Metro city skyline"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            {/* Dark overlay — left heavy so text is readable, right lighter so photo shows */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060d1f]/92 via-[#0a1628]/75 to-[#0d1f3c]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060d1f]/80 via-transparent to-transparent" />
          </div>

          {/* City route map decoration - top right */}
          <div className="absolute top-5 right-5 hidden lg:block pointer-events-none">
            <div className="relative w-48 h-36">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 144" fill="none">
                <path d="M160 32 Q130 56 118 72 Q106 88 80 112" stroke="rgba(16,185,129,0.5)" strokeWidth="2.5" strokeDasharray="6 3" fill="none" />
                <circle cx="160" cy="32" r="5" fill="#10b981" opacity="0.85" />
                <circle cx="118" cy="72" r="5" fill="#10b981" opacity="0.85" />
                <circle cx="80" cy="112" r="5" fill="#10b981" opacity="0.85" />
              </svg>
              <div className="absolute" style={{ top: '16%', right: '8%' }}>
                <span className="text-[11px] font-semibold text-white/80 tracking-wide">Delhi</span>
              </div>
              <div className="absolute" style={{ top: '44%', right: '28%' }}>
                <span className="text-[11px] font-semibold text-white/80 tracking-wide">Noida</span>
              </div>
              <div className="absolute" style={{ top: '72%', right: '48%' }}>
                <span className="text-[11px] font-semibold text-white/80 tracking-wide">Gurugram</span>
              </div>
              <div className="absolute bottom-1 right-2 text-[8px] text-zinc-500 font-mono leading-tight text-right">
                Same City<br />Bigger Dreams<br />More Opportunities
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-30 px-6 sm:px-10 lg:px-14 pt-8 sm:pt-11 pb-16">
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white font-semibold bg-white/15 border border-white/30 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                NCR Launched — Delhi NCR's Startup &amp; Job Ecosystem
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>

            {/* Headline with H1 containing targeted SEO keyword */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-white" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
              NCR Launched:<br />
              Startups &amp; Jobs in{' '}
              <span style={{ color: '#fbbf24' }}>Noida</span>
              {' '}&amp;{' '}
              <span style={{ color: '#2dd4bf' }}>Gurugram</span>
            </h1>
            <p className="mt-3 text-sm text-white/90 max-w-md leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
              Explore innovative startups, find your next opportunity, and be a part of NCR's growing ecosystem.
            </p>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black font-mono" style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  <AnimatedCounter target={startups.length} />
                </span>
                <span className="text-xs text-white/80 font-medium">Startups</span>
              </div>
              <div className="w-px h-6 bg-white/30" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg sm:text-2xl font-black font-mono" style={{ color: '#34d399', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  <AnimatedCounter target={hiringCount} />
                </span>
                <span className="text-xs text-white/80 font-medium">Hiring Now</span>
              </div>
              <div className="w-px h-6 bg-white/30" />
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black font-mono" style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  <AnimatedCounter target={activeJobsCount} />
                </span>
                <span className="text-xs text-white/80 font-medium">Active Jobs</span>
              </div>
              {/* Backend status indicator */}
              <div className="w-px h-6 bg-white/30" />
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-blue-400 animate-pulse' : 'bg-zinc-500'}`} />
                <span className="text-xs text-white/70 font-mono">
                  {backendOnline ? 'Live DB' : 'Demo'}
                </span>
              </div>
            </div>

            {/* Founder Hiring filter toggle */}
            {backendOnline && (
              <div className="mt-3">
                <button
                  onClick={() => setOnlyFounderHiring((v) => !v)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    onlyFounderHiring
                      ? 'bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/30'
                      : 'bg-white/10 border-white/25 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Zap className="h-3 w-3" />
                  {onlyFounderHiring ? '✓ Founder Hiring Only' : 'Show Founder / Startup Hiring'}
                </button>
              </div>
            )}

            {/* Dark Glassmorphism Hero Search Bar matching NCR background */}
            <HeroSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              selectedStage={selectedStage}
              setSelectedStage={setSelectedStage}
              onlyHiring={onlyHiring}
              setOnlyHiring={setOnlyHiring}
              onSearch={() => {
                const el = document.getElementById('map-container-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          {/* ══ REAL DELHI METRO TRACK WITH REAL SOUND ══ */}
          <MetroTrack soundOn={soundOn} onToggleSound={handleSoundToggle} />
        </section>

        {/* ══════════════════════════════════
            MAP + STARTUPS SPLIT VIEW
        ══════════════════════════════════ */}
        <div id="map-container-section" className="relative flex-shrink-0 md:px-10 md:py-5">
          <div className="relative flex bg-white dark:bg-[#0c121c] border-0 md:border border-zinc-200 dark:border-white/[0.10] md:rounded-2xl overflow-hidden shadow-sm" style={{ height: 'min(70vh, 600px)' }}>

            {/* Left: Map */}
            <div className={`relative h-full transition-all duration-300 ${
              viewMode === 'map' ? 'w-full' :
              viewMode === 'list' ? 'hidden' :
              'hidden md:block md:w-[62%] lg:w-[67%]'
            } ${mobileTab === 'map' ? 'block w-full' : 'hidden md:block'}`}>
              <MapView
                startups={filteredStartups}
                selectedStartup={selectedStartup}
                onSelectStartup={(s) => setSelectedStartup(s)}
                isDark={isDark}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onlyHiring={onlyHiring}
                setOnlyHiring={setOnlyHiring}
              />
            </div>

            {/* Right: Startup list */}
            <div className={`relative h-full border-l border-zinc-100 dark:border-white/[0.07] transition-all duration-300 ${
              viewMode === 'list' ? 'w-full' :
              viewMode === 'map' ? 'hidden' :
              'w-full md:w-[38%] lg:w-[33%]'
            } ${mobileTab === 'list' ? 'block w-full' : 'hidden md:block'}`}>
              <StartupList
                startups={filteredStartups}
                selectedStartup={selectedStartup}
                onSelectStartup={(s) => setSelectedStartup(s)}
                jobs={jobs}
                onOpenJobsForStartup={() => setIsJobsModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            BOTTOM SECTION: 3 Cards (Featured + Jobs + Banner)
        ══════════════════════════════════════════════════ */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Card 1: Featured Startups (Matching Screenshot) */}
            <div className="rounded-2xl border border-zinc-200/90 dark:border-white/[0.10] bg-white dark:bg-[#0c121c] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-white">Featured Startups</h3>
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {featuredStartups.map((startup) => (
                    <button
                      key={startup._id}
                      onClick={() => {
                        setSelectedStartup(startup);
                        const el = document.getElementById('map-container-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-all group cursor-pointer text-center"
                    >
                      <div className="relative">
                        <div className="h-11 w-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform shadow-xs">
                          <img
                            src={startup.logo}
                            alt={startup.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                        {startup.isHiring && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-900 dark:text-white truncate max-w-[54px]">{startup.name}</span>
                      <span className="text-[9px] text-zinc-500 truncate max-w-[54px]">{startup.sector.split(' ')[0]}</span>
                      <span className="text-[8px] font-mono px-1 rounded-sm bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">{startup.stage.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Latest Jobs (Matching Screenshot) */}
            <div className="rounded-2xl border border-zinc-200/90 dark:border-white/[0.10] bg-white dark:bg-[#0c121c] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-white">Latest Jobs</h3>
                  </div>
                  <button
                    onClick={() => setIsJobsModalOpen(true)}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {latestJobs.map((job) => {
                    const startup = startupsMap.get(job.startupId);
                    return (
                      <div
                        key={job._id}
                        className="group flex items-center justify-between gap-2.5 p-2.5 rounded-xl border border-zinc-100 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.15] hover:bg-zinc-50/80 dark:hover:bg-white/[0.03] transition-all"
                      >
                        <div
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          onClick={() => setApplyingJob(job)}
                        >
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 shrink-0 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            {startup ? (
                              <img src={startup.logo} alt={startup.name} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
                            ) : job.title.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{job.title}</p>
                              {job.source && (
                                <span className="shrink-0 text-[8px] font-semibold px-1.5 py-0.2 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">{job.source}</span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                              {startup?.name || job.companyName || 'Startup'} · {job.city} · {job.workMode} {(job.coordinates || startup?.coordinates) ? `· 📍 ${(job.coordinates || startup!.coordinates)[0].toFixed(2)}, ${(job.coordinates || startup!.coordinates)[1].toFixed(2)}` : ''} {job.salaryDisplay ? `· ${job.salaryDisplay}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Direct Apply Button */}
                        <a
                          href={job.applyUrl || startup?.careersUrl || startup?.website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title={`Direct apply on ${startup?.name || 'company'} careers page`}
                        >
                          <span>Apply</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 3: NCR LaunchMap CTA Banner (Matching Screenshot) */}
            <div className="relative rounded-2xl border border-zinc-200/90 dark:border-white/[0.10] bg-gradient-to-br from-[#0c1a2f] via-[#0e2444] to-[#12315c] text-white p-6 shadow-sm overflow-hidden flex flex-col justify-between min-h-[220px]">
              
              {/* Skyline Background Graphic */}
              <div 
                className="absolute inset-0 opacity-25 bg-cover bg-right pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80')`
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>NCR LaunchMap</span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg leading-snug">
                  Be a part of NCR's Growing<br />Startup Ecosystem
                </h3>
                <p className="mt-1.5 text-xs text-zinc-300 max-w-xs leading-relaxed">
                  Find your next opportunity or post a job in just a few clicks.
                </p>
              </div>

              <div className="relative z-10 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setIsPostJobOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-md shadow-orange-500/30 cursor-pointer"
                >
                  <span>Post a Job</span>
                  <span>→</span>
                </button>

                {/* Metro illustration badge */}
                <div className="flex items-center gap-1 text-[10px] text-teal-300 font-mono">
                  <Train className="h-3.5 w-3.5" />
                  <span>Connecting NCR</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SKYLINE FOOTER (Matching Screenshot) ── */}
        <SkylineFooter
          onOpenMap={() => {
            const el = document.getElementById('map-container-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenJobs={() => setIsJobsModalOpen(true)}
          onOpenPostJob={() => setIsPostJobOpen(true)}
        />
      </div>

      {/* ── MOBILE FLOATING TAB SWITCHER ── */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-full border border-zinc-200/90 bg-white/95 p-1 shadow-2xl backdrop-blur-md dark:border-white/12 dark:bg-zinc-900/95">
        <button
          onClick={() => setMobileTab('map')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            mobileTab === 'map'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            mobileTab === 'list'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>List ({filteredStartups.length})</span>
        </button>
      </div>

      {/* ── TOAST ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-zinc-950/95 px-4 py-3 text-xs font-medium text-emerald-400 shadow-2xl backdrop-blur-md animate-fade-in">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MODALS ── */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} startups={startups} jobs={jobs} onSelectStartup={(s) => setSelectedStartup(s)} onSelectJob={(j) => setApplyingJob(j)} />
      <StartupDetailDrawer startup={selectedStartup} onClose={() => setSelectedStartup(null)} jobs={jobs} onApplyJob={(job) => setApplyingJob(job)} />
      <JobsModal 
        isOpen={isJobsModalOpen} 
        onClose={() => setIsJobsModalOpen(false)} 
        jobs={jobs} 
        startups={startups} 
        onApplyJob={(job) => setApplyingJob(job)} 
        onSelectStartup={(s) => setSelectedStartup(s)}
        onSyncJobs={handleSyncJobs}
        isSyncingJobs={isSyncingJobs}
      />
      <ApplyModal job={applyingJob} startup={applyingJob ? startups.find((s) => s._id === applyingJob.startupId) || null : null} onClose={() => setApplyingJob(null)} onSubmitApplication={(jobId, applicant) => { showToast(`Application submitted for ${applicant.name}!`); }} />
      <PostJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} startups={startups} onJobCreated={handleJobCreated} />
      <SubmitStartupModal isOpen={isSubmitStartupOpen} onClose={() => setIsSubmitStartupOpen(false)} onStartupAdded={handleStartupAdded} />
      <AntiGravitySimulator isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} startups={startups} onToggleHiring={handleToggleHiring} onRunAutoExpireCron={handleRunAutoExpireCron} />
    </div>
  );
};


