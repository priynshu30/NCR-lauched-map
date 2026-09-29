import React, { useState, useEffect } from 'react';
import { 
  playDelhiMetroFullExperience, 
  playDelhiMetroHorn, 
  playDelhiMetroChime,
  playMetroRunningSound,
  isSoundEnabled,
  HINDI_DMRC_ANNOUNCEMENTS
} from '../utils/audio';
import { Volume2, VolumeX, Train, Radio } from 'lucide-react';

interface MetroTrackProps {
  soundOn?: boolean;
  onToggleSound?: () => void;
}

export const MetroTrack: React.FC<MetroTrackProps> = ({ soundOn, onToggleSound }) => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isPlayingRunning, setIsPlayingRunning] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Trigger running train sound (VVVF motor whine + dhadak-dhadak wheel clatter)
  const handlePlayRunningSound = () => {
    setIsPlayingRunning(true);
    playMetroRunningSound(6.5);
    setTimeout(() => {
      setIsPlayingRunning(false);
    }, 6500);
  };

  // Trigger Hindi announcement & chime directly from the real train
  const handlePlayMetroSound = (idx?: number) => {
    setIsPlayingSound(true);
    playMetroRunningSound(4.5);
    const targetIdx = typeof idx === 'number' ? idx : announcementIndex;
    const displayText = playDelhiMetroFullExperience(targetIdx);
    setActiveAnnouncement(displayText || HINDI_DMRC_ANNOUNCEMENTS[targetIdx % HINDI_DMRC_ANNOUNCEMENTS.length].display);
    setAnnouncementIndex((prev) => (prev + 1) % HINDI_DMRC_ANNOUNCEMENTS.length);

    setTimeout(() => {
      setIsPlayingSound(false);
    }, 4500);

    setTimeout(() => {
      setActiveAnnouncement(null);
    }, 7000);
  };

  // Periodic authentic DMRC train passing sound as trains cross the elevated viaduct
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSoundEnabled() && !isPlayingSound && !isPlayingRunning) {
        playMetroRunningSound(5.0);
      }
    }, 18000);
    return () => clearInterval(interval);
  }, [isPlayingSound, isPlayingRunning]);

  return (
    <div className="metro-track-container relative w-full h-24 select-none overflow-hidden z-0">
      
      {/* ── OVERHEAD CATENARY WIRE & OHE ELECTRIC MASTS ── */}
      <div className="absolute top-2 left-0 right-0 h-4 pointer-events-none z-0">
        {/* Continuous 25kV Overhead High-Voltage Contact Wire */}
        <div className="absolute top-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-zinc-500/30 via-zinc-400/80 to-zinc-500/30 shadow-[0_0_4px_rgba(56,189,248,0.4)]" />
        <div className="absolute top-2.5 left-0 right-0 h-[1px] bg-gradient-to-r from-zinc-600/20 via-zinc-500/60 to-zinc-600/20" />

        {/* OHE Steel Cantilever Masts across the viaduct */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`ohe-${i}`}
            className="absolute top-0 flex flex-col items-center pointer-events-none"
            style={{ left: `${i * 12.5 + 2}%` }}
          >
            {/* Insulator & Cantilever Arm */}
            <div className="w-6 h-0.5 bg-zinc-400 dark:bg-zinc-300 -ml-4" />
            <div className="w-1.5 h-2 bg-amber-600/80 rounded-xs -mt-1 -ml-4 shadow-xs" />
            {/* Vertical Steel H-Beam Mast */}
            <div className="w-1.5 h-16 bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-600 dark:from-zinc-700 dark:via-zinc-500 dark:to-zinc-800 rounded-xs shadow-md" />
          </div>
        ))}
      </div>

      {/* ── CONCRETE ELEVATED VIADUCT (DMRC Precast Box Girder) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-5">
        {/* Elevated Viaduct Concrete Deck / Parapet Sound Barrier */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800 dark:from-zinc-800 dark:via-zinc-900 dark:to-black border-t border-zinc-500/50 shadow-md">
          {/* Segmental Joint Grooves in Concrete Girder */}
          <div className="flex justify-between w-full h-full opacity-40">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-black/60" />
            ))}
          </div>
        </div>

        {/* Heavy Cylindrical Concrete Pillars (Piers) with T-Heads */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`pier-${i}`}
            className="absolute top-2.5 flex flex-col items-center"
            style={{ left: `${i * 16 + 5}%` }}
          >
            {/* Pier Cap (T-Head) */}
            <div className="w-12 h-2.5 bg-gradient-to-b from-zinc-700 to-zinc-800 dark:from-zinc-800 dark:to-zinc-950 rounded-xs shadow-md border-t border-zinc-500/40" />
            {/* Cylindrical Pier Column */}
            <div className="w-6 h-6 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-900 dark:from-zinc-950 dark:via-zinc-700 dark:to-black rounded-b-md shadow-lg" />
          </div>
        ))}

        {/* Ballastless Track Bed Plinth with Fasteners */}
        <div className="absolute -top-1.5 left-0 right-0 h-2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-t border-zinc-600/40" />

        {/* Continuous Welded High-Tensile Steel Rail Heads (Specular Metallic Glow) */}
        <div className="absolute -top-2.5 left-0 right-0 h-[2px] bg-gradient-to-r from-zinc-300 via-white to-zinc-300 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
        <div className="absolute -top-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500" />
      </div>

      {/* ── TRAIN 1: YELLOW LINE GURUGRAM (Moving Left to Right, Engine Leading at Front) ── */}
      <div 
        className="metro-train-anim1 absolute -top-1 z-20 flex items-center cursor-pointer group"
        onClick={() => handlePlayMetroSound(0)}
        title="Delhi Metro Yellow Line (Gurugram). Click to hear authentic Hindi announcement & horn!"
      >
        <RealDelhiMetroRake 
          line="yellow" 
          primaryColor="#eab308" 
          destination="HUDA CITY CTR / CYBER CITY"
          rakeCode="Y-24"
        />
      </div>

      {/* ── TRAIN 2: BLUE LINE NOIDA (Moving Right to Left, Engine Leading at Front) ── */}
      <div 
        className="metro-train-anim2 absolute top-0.5 z-15 flex items-center cursor-pointer group"
        onClick={() => handlePlayMetroSound(1)}
        title="Delhi Metro Blue Line (Noida). Click to hear authentic Hindi announcement & horn!"
      >
        <RealDelhiMetroRake 
          line="blue" 
          primaryColor="#2563eb" 
          destination="NOIDA ELECTRONIC CITY"
          rakeCode="B-18"
        />
      </div>

      {/* ── REAL DELHI METRO SOUND & HINDI ANNOUNCEMENT CONTROLS ── */}
      <div className="absolute bottom-1 right-4 z-30 flex items-center gap-2">
        {/* Active Hindi Announcement Banner */}
        {activeAnnouncement && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/90 text-emerald-400 text-[11px] font-medium border border-emerald-500/40 shadow-xl backdrop-blur-md animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate max-w-[260px] font-sans">{activeAnnouncement}</span>
          </div>
        )}

        {/* Real Hindi Announcement Button */}
        <button
          onClick={() => handlePlayMetroSound()}
          disabled={isPlayingSound}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 hover:from-teal-900 hover:to-zinc-900 text-white text-[11px] font-semibold border border-teal-500/50 hover:border-teal-400 shadow-lg backdrop-blur-md transition-all cursor-pointer active:scale-95"
          title="दिल्ली मेट्रो की आधिकारिक हिंदी घोषणा और चाइम सुनें (Play Hindi DMRC Announcement)"
        >
          <Volume2 className={`h-3.5 w-3.5 text-teal-400 ${isPlayingSound ? 'animate-bounce' : ''}`} />
          <span>{isPlayingSound ? 'घोषणा हो रही है...' : 'हिंदी अनाउंसमेंट 🔔'}</span>
        </button>

        {/* Metro Running Sound Button (VVVF Motor + Dhadak-Dhadak Wheels) */}
        <button
          onClick={handlePlayRunningSound}
          disabled={isPlayingRunning}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-md transition-all cursor-pointer active:scale-95 ${
            isPlayingRunning
              ? 'bg-amber-900/80 border-amber-500/60 text-amber-300'
              : 'bg-zinc-900/90 hover:bg-zinc-800 border-amber-500/30 hover:border-amber-400 text-zinc-200'
          }`}
          title="Metro chalne ki awaaz — VVVF Motor + Dhadak-Dhadak Wheels"
        >
          <Radio className={`h-3 w-3 text-amber-400 ${isPlayingRunning ? 'animate-pulse' : ''}`} />
          <span>{isPlayingRunning ? 'chal rahi...' : 'Metro Awaaz'}</span>
        </button>

        {/* Real DMRC Pneumatic Dual Horn */}
        <button
          onClick={() => playDelhiMetroHorn()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-[11px] font-semibold border border-white/20 shadow-md transition-all cursor-pointer active:scale-95"
          title="DMRC का हॉर्न बजाएं (Sound Delhi Metro Pneumatic Horn)"
        >
          <Train className="h-3 w-3 text-amber-400" />
          <span>हॉर्न</span>
        </button>

        {/* Sound Mute/Unmute Quick Toggle */}
        {onToggleSound && (
          <button
            onClick={onToggleSound}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-white/20 shadow-md transition-all cursor-pointer"
            title={soundOn ? 'आवाज म्यूट करें (Mute Metro Sound)' : 'आवाज चालू करें (Unmute Metro Sound)'}
          >
            {soundOn ? <Volume2 className="h-3 w-3 text-emerald-400" /> : <VolumeX className="h-3 w-3 text-zinc-400" />}
          </button>
        )}
      </div>

    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// REAL DELHI METRO RAKE (3-CAR STAINLESS STEEL TRAIN - ENGINE IN FRONT)
// ══════════════════════════════════════════════════════════════════════════════

interface RealDelhiMetroRakeProps {
  line: 'yellow' | 'blue' | 'magenta';
  primaryColor: string;
  destination: string;
  rakeCode: string;
}

const RealDelhiMetroRake: React.FC<RealDelhiMetroRakeProps> = ({
  line,
  primaryColor,
  destination,
  rakeCode
}) => {
  return (
    <div className="flex items-end select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]">
      
      {/* ── COACH 3: TRAILING REAR PASSENGER CAR (DT) - AT THE BACK (LEFT) ── */}
      <svg width="190" height="52" viewBox="0 0 190 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Stainless Steel Brushed Metallic Body Gradient */}
          <linearGradient id={`ssBody-${line}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#e4e8ec" />
            <stop offset="50%" stopColor="#cfd6de" />
            <stop offset="85%" stopColor="#b4becc" />
            <stop offset="100%" stopColor="#8c9aa8" />
          </linearGradient>

          {/* Roof Contour Gradient */}
          <linearGradient id={`roofGrad-${line}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Passenger Cabin Warm Interior Glow */}
          <linearGradient id={`cabinGlow-${line}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>

          {/* Forward Headlight Projection Beam */}
          <linearGradient id={`lightBeam-${line}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="2" y="10" width="184" height="33" rx="2" fill={`url(#ssBody-${line})`} stroke="#475569" strokeWidth="1" />
        
        {/* Corrugated ribs */}
        <line x1="2" y1="13" x2="186" y2="13" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />
        <line x1="2" y1="36" x2="186" y2="36" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />

        {/* Livery Stripe */}
        <rect x="2" y="28" width="184" height="6" fill={primaryColor} />
        <rect x="2" y="34.5" width="184" height="1.5" fill="#0f172a" />

        {/* Rear Red Marker Lights */}
        <circle cx="6" cy="35" r="1.5" fill="#ef4444" className="filter drop-shadow-[0_0_4px_#ef4444]" />
        <circle cx="6" cy="20" r="1.2" fill="#ef4444" />

        {/* Windows */}
        {[14, 50, 86, 122, 158].map((x, i) => (
          <g key={i}>
            <rect x={x} y="15" width="22" height="11" rx="2" fill={`url(#cabinGlow-${line})`} stroke="#1e293b" strokeWidth="0.6" />
            <rect x={x + 1} y="16" width="20" height="1.5" fill="white" opacity="0.4" />
            <circle cx={x + 8} cy="19" r="2.2" fill="#0f172a" opacity="0.45" />
            <path d={`M${x+5} 24 C${x+5} 21, ${x+11} 21, ${x+11} 24 Z`} fill="#0f172a" opacity="0.45" />
          </g>
        ))}

        {/* Automatic Doors */}
        {[40, 112].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="12" x2={x} y2="42" stroke="#475569" strokeWidth="0.8" />
            <line x1={x + 6} y1="12" x2={x + 6} y2="42" stroke="#475569" strokeWidth="0.8" />
            <rect x={x + 1} y="16" width="4" height="14" rx="1" fill="#0284c7" opacity="0.75" stroke="#334155" strokeWidth="0.4" />
            <circle cx={x + 3} cy="13.5" r="1" fill="#ef4444" className="door-light-blink-anim" />
          </g>
        ))}

        {/* Roof HVAC */}
        <rect x="65" y="6.5" width="45" height="3.5" rx="1.5" fill={`url(#roofGrad-${line})`} stroke="#334155" strokeWidth="0.5" />

        {/* Bogies & Wheels */}
        <rect x="4" y="43" width="180" height="2" fill="#1e293b" />
        <circle cx="28" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="28" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="40" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="40" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="150" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="150" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="162" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="162" cy="45.5" r="2" fill="#94a3b8" />
      </svg>

      {/* ── ARTICULATED RUBBER ACCORDION GANGWAY (Coupler 1) ── */}
      <div className="w-3 h-8 bg-zinc-950 border-y border-zinc-700 -mx-0.5 z-15 flex flex-col justify-between py-1 mb-2">
        <div className="h-[2px] w-full bg-zinc-700" />
        <div className="h-[2px] w-full bg-zinc-700" />
        <div className="h-[2px] w-full bg-zinc-700" />
        <div className="h-[2px] w-full bg-zinc-700" />
      </div>

      {/* ── COACH 2: MIDDLE MOTOR CAR (M) WITH HIGH-VOLTAGE PANTOGRAPH - IN CENTER ── */}
      <svg width="190" height="52" viewBox="0 0 190 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stainless Steel Body */}
        <rect x="2" y="10" width="186" height="33" rx="2" fill={`url(#ssBody-${line})`} stroke="#475569" strokeWidth="1" />

        {/* Stainless steel swage lines */}
        <line x1="2" y1="13" x2="188" y2="13" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />
        <line x1="2" y1="36" x2="188" y2="36" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />

        {/* DMRC Official Livery Color Stripe */}
        <rect x="2" y="28" width="186" height="6" fill={primaryColor} />
        <rect x="2" y="34.5" width="186" height="1.5" fill="#0f172a" />

        {/* ── 25kV HIGH SPEED SINGLE-ARM PANTOGRAPH TOUCHING CATENARY ── */}
        <g transform="translate(85, -2)">
          {/* Base Insulator Mounts */}
          <rect x="-10" y="10" width="24" height="2" fill="#475569" />
          <circle cx="-6" cy="11" r="1.5" fill="#b45309" />
          <circle cx="10" cy="11" r="1.5" fill="#b45309" />
          {/* Articulated Lower & Upper Pantograph Arms */}
          <line x1="-4" y1="10" x2="6" y2="3" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="3" x2="-2" y2="-4" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" />
          {/* Carbon Collector Strip Head touching contact wire */}
          <line x1="-12" y1="-4" x2="8" y2="-4" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          {/* Electrical Arc Spark Animation */}
          <circle cx="-2" cy="-4" r="3" fill="#38bdf8" className="pantograph-spark-anim" />
        </g>

        {/* Passenger Windows */}
        {[10, 46, 82, 118, 154].map((x, i) => (
          <g key={i}>
            <rect x={x} y="15" width="22" height="11" rx="2" fill={`url(#cabinGlow-${line})`} stroke="#1e293b" strokeWidth="0.6" />
            <rect x={x + 1} y="16" width="20" height="1.5" fill="white" opacity="0.4" />
            <circle cx={x + 9} cy="19" r="2.2" fill="#0f172a" opacity="0.45" />
            <path d={`M${x+6} 24 C${x+6} 21, ${x+12} 21, ${x+12} 24 Z`} fill="#0f172a" opacity="0.45" />
          </g>
        ))}

        {/* Automatic Doors */}
        {[36, 108].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="12" x2={x} y2="42" stroke="#475569" strokeWidth="0.8" />
            <line x1={x + 6} y1="12" x2={x + 6} y2="42" stroke="#475569" strokeWidth="0.8" />
            <rect x={x + 1} y="16" width="4" height="14" rx="1" fill="#0284c7" opacity="0.75" stroke="#334155" strokeWidth="0.4" />
            <circle cx={x + 3} cy="13.5" r="1" fill="#ef4444" className="door-light-blink-anim" />
          </g>
        ))}

        {/* Roof HVAC Unit */}
        <rect x="25" y="6.5" width="45" height="3.5" rx="1.5" fill={`url(#roofGrad-${line})`} stroke="#334155" strokeWidth="0.5" />
        <rect x="125" y="6.5" width="45" height="3.5" rx="1.5" fill={`url(#roofGrad-${line})`} stroke="#334155" strokeWidth="0.5" />

        {/* Bogies & Wheels */}
        <rect x="4" y="43" width="182" height="2" fill="#1e293b" />
        <circle cx="28" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="28" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="40" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="40" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="150" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="150" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="162" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="162" cy="45.5" r="2" fill="#94a3b8" />
      </svg>

      {/* ── ARTICULATED RUBBER ACCORDION GANGWAY (Coupler 2) ── */}
      <div className="w-3 h-8 bg-zinc-950 border-y border-zinc-700 -mx-0.5 z-15 flex flex-col justify-between py-1 mb-2">
        <div className="h-[2px] w-full bg-zinc-700" />
        <div className="h-[2px] w-full bg-zinc-700" />
        <div className="h-[2px] w-full bg-zinc-700" />
        <div className="h-[2px] w-full bg-zinc-700" />
      </div>

      {/* ── COACH 1: LEADING DRIVER CABIN ENGINE CAR (DM) - AT THE FRONT (RIGHT) ── */}
      <svg width="220" height="52" viewBox="0 0 220 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ── FORWARD HEADLIGHT BEAM PROJECTION ON THE TRACK ── */}
        <polygon points="214,35 290,26 290,46" fill={`url(#lightBeam-${line})`} />

        {/* ── STAINLESS STEEL AERODYNAMIC BODY ── */}
        <path
          d="M 4,10 
             C 4,10 170,10 180,10 
             C 196,10 212,20 217,30 
             C 219,34 218,40 213,42 
             C 204,43 14,43 4,43 
             C 2,43 1,41 1,38 
             L 1,15 
             C 1,12 2,10 4,10 Z"
          fill={`url(#ssBody-${line})`}
          stroke="#475569"
          strokeWidth="1"
        />

        {/* Stainless steel horizontal corrugated ribs (Delhi Metro swages) */}
        <line x1="6" y1="13" x2="175" y2="13" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />
        <line x1="6" y1="15" x2="175" y2="15" stroke="#94a3b8" strokeWidth="0.5" opacity="0.6" />
        <line x1="6" y1="36" x2="185" y2="36" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />
        <line x1="6" y1="38" x2="195" y2="38" stroke="#94a3b8" strokeWidth="0.5" opacity="0.6" />

        {/* ── DRIVER CABIN AERODYNAMIC WINDSHIELD (Black Masked Surrounds) ── */}
        <path
          d="M 178,13 
             C 188,13 203,20 209,28 
             L 182,28 
             C 180,28 178,26 178,24 
             Z"
          fill="#090d16"
          stroke="#0284c7"
          strokeWidth="0.6"
        />
        {/* Windshield Glass Reflection */}
        <path d="M 183,15 L 202,26 L 190,26 Z" fill="white" opacity="0.3" />
        {/* Single Curved Windshield Wiper */}
        <line x1="184" y1="27" x2="194" y2="19" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />

        {/* ── AMBER LED DIGITAL DESTINATION DISPLAY (Above Windshield) ── */}
        <rect x="180" y="11" width="22" height="3" rx="0.5" fill="#050810" />
        <text x="191" y="13.2" fill="#fbbf24" fontSize="2.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          {rakeCode}
        </text>

        {/* ── DMRC OFFICIAL LOGO EMBLEM ON FRONT NOSE (Red Circle + White Logo) ── */}
        <circle cx="211" cy="33" r="3.2" fill="#dc2626" stroke="#ffffff" strokeWidth="0.4" />
        {/* DMRC White Rails Graphic */}
        <path d="M 209.5,34.5 L 211,31.5 L 212.5,34.5 M 209.5,33 L 212.5,33" stroke="white" strokeWidth="0.6" strokeLinecap="round" />

        {/* ── TWIN ULTRA-BRIGHT LED HEADLAMPS (BEAMING FORWARD AHEAD) ── */}
        <circle cx="215" cy="35" r="3" fill="#fef08a" className="filter drop-shadow-[0_0_8px_#fde047]" />
        <circle cx="215" cy="35" r="1.5" fill="#ffffff" />
        {/* Red Marker / Tail Lamp */}
        <circle cx="212" cy="39" r="1.3" fill="#ef4444" />

        {/* ── DMRC OFFICIAL LIVERY COLOR STRIPE ── */}
        <path
          d="M 4,28 L 180,28 L 208,31 L 205,34 L 4,34 Z"
          fill={primaryColor}
        />
        {/* Navy blue accent pinstripe below livery band */}
        <rect x="4" y="34.5" width="178" height="1.5" fill="#0f172a" />

        {/* ── PASSENGER WINDOWS WITH WARM LIT INTERIORS ── */}
        {[16, 52, 88, 124, 152].map((x, i) => (
          <g key={i}>
            <rect x={x} y="15" width="22" height="11" rx="2" fill={`url(#cabinGlow-${line})`} stroke="#1e293b" strokeWidth="0.6" />
            <rect x={x + 1} y="16" width="20" height="1.5" fill="white" opacity="0.4" />
            <circle cx={x + 8} cy="19" r="2.2" fill="#0f172a" opacity="0.45" />
            <path d={`M${x+5} 24 C${x+5} 21, ${x+11} 21, ${x+11} 24 Z`} fill="#0f172a" opacity="0.45" />
            <circle cx={x + 16} cy="19.5" r="2" fill="#0f172a" opacity="0.35" />
          </g>
        ))}

        {/* ── BI-PARTING AUTOMATIC SLIDING DOORS WITH BLINKING WARNING LEDS ── */}
        {[42, 114].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="12" x2={x} y2="42" stroke="#475569" strokeWidth="0.8" />
            <line x1={x + 6} y1="12" x2={x + 6} y2="42" stroke="#475569" strokeWidth="0.8" />
            <rect x={x + 1} y="16" width="4" height="14" rx="1" fill="#0284c7" opacity="0.75" stroke="#334155" strokeWidth="0.4" />
            <circle cx={x + 3} cy="13.5" r="1" fill="#ef4444" className="door-light-blink-anim" />
          </g>
        ))}

        {/* ── ROOF HVAC AIR CONDITIONING POD ── */}
        <rect x="60" y="6.5" width="45" height="3.5" rx="1.5" fill={`url(#roofGrad-${line})`} stroke="#334155" strokeWidth="0.5" />
        <line x1="68" y1="8" x2="98" y2="8" stroke="#0f172a" strokeWidth="0.8" opacity="0.7" />
        <line x1="68" y1="9" x2="98" y2="9" stroke="#0f172a" strokeWidth="0.8" opacity="0.7" />

        {/* ── BOGIES & STEEL WHEELS ── */}
        <rect x="6" y="43" width="180" height="2" fill="#1e293b" />
        <circle cx="30" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="30" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="42" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="42" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="140" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="140" cy="45.5" r="2" fill="#94a3b8" />
        <circle cx="152" cy="45.5" r="4.5" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
        <circle cx="152" cy="45.5" r="2" fill="#94a3b8" />
        <polygon points="214,42 218,46 206,46" fill="#1e293b" />
      </svg>

    </div>
  );
};
