import React, { useState, useRef, useEffect } from 'react';
import { City, Sector, Stage } from '../types';
import { 
  Search, 
  MapPin, 
  LayoutGrid, 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HeroSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedSector: Sector;
  setSelectedSector: (sector: Sector) => void;
  selectedStage: Stage;
  setSelectedStage: (stage: Stage) => void;
  onlyHiring: boolean;
  setOnlyHiring: (only: boolean) => void;
  onSearch: () => void;
}

const CITIES: City[] = ['All', 'Gurugram', 'Noida', 'Delhi', 'Faridabad', 'Ghaziabad'];
const SECTORS: Sector[] = [
  'All',
  'FinTech',
  'AI & DeepTech',
  'SaaS & Enterprise',
  'E-Commerce & Quick Comm',
  'EdTech',
  'HealthTech',
  'Logistics & Mobility',
  'Consumer Tech',
  'CleanTech'
];
const STAGES: Stage[] = [
  'All',
  'Bootstrapped',
  'Pre-Seed / Seed',
  'Series A',
  'Series B+',
  'Unicorn',
  'Public'
];

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedSector,
  setSelectedSector,
  selectedStage,
  setSelectedStage,
  onlyHiring,
  setOnlyHiring,
  onSearch,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'city' | 'sector' | 'stage' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full max-w-4xl mt-6 ${openDropdown ? 'z-[100]' : 'z-30'}`}>
      {/* ── MAIN SEARCH CAPSULE ── */}
      <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center bg-zinc-950/90 dark:bg-[#070e1b]/95 hover:bg-zinc-950/95 backdrop-blur-2xl border border-white/20 hover:border-white/30 rounded-2xl lg:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all p-2 gap-2 lg:gap-0">
        
        {/* 1. SEARCH INPUT */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[180px] px-3 py-1.5 lg:py-0">
          <Search className="h-4 w-4 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Search startups, jobs, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-zinc-400 outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* DESKTOP DIVIDER */}
        <div className="hidden lg:block h-7 w-px bg-white/15 mx-1" />

        {/* 2. CITY DROPDOWN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
            className={`flex items-center justify-between lg:justify-start gap-1.5 w-full lg:w-auto px-3 py-2 rounded-xl lg:rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCity !== 'All' 
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm' 
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[110px]">{selectedCity === 'All' ? 'City' : selectedCity}</span>
            </div>
            <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${openDropdown === 'city' ? 'rotate-180' : ''}`} />
          </button>

          {/* City Popup Menu */}
          {openDropdown === 'city' && (
            <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-full mt-2 w-48 rounded-2xl bg-[#091120] dark:bg-[#070e1b] border border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-1.5 z-[999] animate-scale-in">
              <div className="text-[10px] font-mono text-zinc-400 px-2.5 py-1 uppercase tracking-wider">Select NCR City</div>
              <div className="space-y-0.5">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setOpenDropdown(null);
                    }}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCity === c
                        ? 'bg-amber-500 text-black font-bold shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{c === 'All' ? 'All NCR' : c}</span>
                    {selectedCity === c && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP DIVIDER */}
        <div className="hidden lg:block h-7 w-px bg-white/15 mx-1" />

        {/* 3. SECTOR DROPDOWN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'sector' ? null : 'sector')}
            className={`flex items-center justify-between lg:justify-start gap-1.5 w-full lg:w-auto px-3 py-2 rounded-xl lg:rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedSector !== 'All' 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span className="truncate max-w-[120px]">{selectedSector === 'All' ? 'Sector' : selectedSector}</span>
            </div>
            <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${openDropdown === 'sector' ? 'rotate-180' : ''}`} />
          </button>

          {/* Sector Popup Menu */}
          {openDropdown === 'sector' && (
            <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-full mt-2 w-56 max-h-64 overflow-y-auto rounded-2xl bg-[#091120] dark:bg-[#070e1b] border border-teal-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-1.5 z-[999] animate-scale-in [scrollbar-width:thin]">
              <div className="text-[10px] font-mono text-zinc-400 px-2.5 py-1 uppercase tracking-wider">Industry Sector</div>
              <div className="space-y-0.5">
                {SECTORS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSector(s);
                      setOpenDropdown(null);
                    }}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedSector === s
                        ? 'bg-teal-500 text-black font-bold shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{s === 'All' ? 'All Sectors' : s}</span>
                    {selectedSector === s && <Check className="h-3 w-3 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP DIVIDER */}
        <div className="hidden lg:block h-7 w-px bg-white/15 mx-1" />

        {/* 4. STAGE DROPDOWN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'stage' ? null : 'stage')}
            className={`flex items-center justify-between lg:justify-start gap-1.5 w-full lg:w-auto px-3 py-2 rounded-xl lg:rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedStage !== 'All' 
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm' 
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span className="truncate max-w-[110px]">{selectedStage === 'All' ? 'Stage' : selectedStage}</span>
            </div>
            <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${openDropdown === 'stage' ? 'rotate-180' : ''}`} />
          </button>

          {/* Stage Popup Menu */}
          {openDropdown === 'stage' && (
            <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-full mt-2 w-52 rounded-2xl bg-[#091120] dark:bg-[#070e1b] border border-purple-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-1.5 z-[999] animate-scale-in">
              <div className="text-[10px] font-mono text-zinc-400 px-2.5 py-1 uppercase tracking-wider">Funding Stage</div>
              <div className="space-y-0.5">
                {STAGES.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedStage(st);
                      setOpenDropdown(null);
                    }}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedStage === st
                        ? 'bg-purple-500 text-white font-bold shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{st === 'All' ? 'All Stages' : st}</span>
                    {selectedStage === st && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP DIVIDER */}
        <div className="hidden lg:block h-7 w-px bg-white/15 mx-1" />

        {/* 5. ONLY HIRING SWITCH */}
        <button
          type="button"
          onClick={() => setOnlyHiring(!onlyHiring)}
          className="flex items-center justify-between lg:justify-start gap-2.5 px-3 py-2 rounded-xl lg:rounded-full text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer select-none"
        >
          <span className="whitespace-nowrap text-xs font-semibold">Only Hiring</span>
          <span className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            onlyHiring ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-zinc-700'
          }`}>
            <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              onlyHiring ? 'translate-x-3' : 'translate-x-0'
            }`} />
          </span>
        </button>

        {/* 6. SEARCH ACTION BUTTON */}
        <button
          onClick={onSearch}
          className="flex items-center justify-center gap-1.5 h-10 px-6 rounded-xl lg:rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/30 shrink-0 cursor-pointer"
        >
          <span>Search</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

      </div>
    </div>
  );
};
