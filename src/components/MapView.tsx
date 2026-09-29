import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Startup, ViewMode } from '../types';
import { playPinClickSound } from '../utils/audio';
import { 
  Map as MapIcon, 
  LayoutGrid, 
  Crosshair, 
  Building2, 
  ExternalLink,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

interface MapViewProps {
  startups: Startup[];
  selectedStartup: Startup | null;
  onSelectStartup: (startup: Startup) => void;
  isDark: boolean;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  onlyHiring: boolean;
  setOnlyHiring: (oh: boolean) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  startups,
  selectedStartup,
  onSelectStartup,
  isDark,
  viewMode,
  setViewMode,
  onlyHiring,
  setOnlyHiring
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'tech'>('streets');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered strategically over Delhi NCR (Gurugram + Noida + South Delhi)
    const map = L.map(mapContainerRef.current, {
      center: [28.520, 77.225],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Real Map Tile Layer (OpenStreetMap / Carto Dark - 100% Free, NO API KEY REQUIRED)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Always use official reliable tile servers that NEVER ask for an API key:
    // - Light / Streets: Standard OpenStreetMap (real roads, metro lines, landmarks, sectors)
    // - Dark: Carto public dark basemap or OSM with dark filter
    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let subdomains: string | string[] = ['a', 'b', 'c'];
    let maxZoom = 19;

    if (isDark && mapStyle === 'tech') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
      subdomains = 'abcd';
    } else if (mapStyle === 'streets') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = ['a', 'b', 'c'];
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [isDark, mapStyle]);

  // Update Markers: Modern Sleek Map Pin (Teardrop style)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    startups.forEach((startup) => {
      const isSelected = selectedStartup?._id === startup._id;
      const isHiring = startup.isHiring;

      // Extract short initial (e.g. "Z" for Zomato, "RP" for Razorpay)
      const initials = startup.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

      // Pin dimensions (Clean, compact modern teardrop)
      const pinWidth = isSelected ? 32 : 26;
      const pinHeight = isSelected ? 42 : 34;

      // Modern SVG Map Pin: Teardrop with pointed needle tip
      const pinHtml = `
        <div class="relative group cursor-pointer select-none transition-transform duration-200 ${
          isSelected ? 'scale-115 z-50' : 'hover:scale-110 z-20'
        }" style="width: ${pinWidth}px; height: ${pinHeight}px;">
          
          ${isHiring ? `
            <!-- Ground Pulse Ripple for Hiring -->
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-emerald-400/40 rounded-full animate-ping pointer-events-none"></div>
          ` : ''}

          <!-- Teardrop Map Pin SVG -->
          <svg width="${pinWidth}" height="${pinHeight}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-all drop-shadow-md">
            <!-- Pin Shadow -->
            <ellipse cx="14" cy="34" rx="6" ry="1.5" fill="rgba(0,0,0,0.25)" />
            
            <!-- Pin Outer Body -->
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" 
                  fill="${isHiring ? 'url(#pin-hiring-gradient)' : 'url(#pin-normal-gradient)'}" 
                  stroke="${isSelected ? '#fbbf24' : (isHiring ? '#34d399' : '#ffffff')}" 
                  stroke-width="${isSelected ? '2' : '1.2'}" />
            
            <!-- Center White Badge Circle -->
            <circle cx="14" cy="13.5" r="8" fill="#ffffff" />
            
            <defs>
              <linearGradient id="pin-hiring-gradient" x1="0" y1="0" x2="28" y2="36" gradientUnits="userSpaceOnUse">
                <stop stop-color="#10b981"/>
                <stop offset="1" stop-color="#047857"/>
              </linearGradient>
              <linearGradient id="pin-normal-gradient" x1="0" y1="0" x2="28" y2="36" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3b82f6"/>
                <stop offset="1" stop-color="#1d4ed8"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- Inside Pin: Monogram / Micro-logo -->
          <div class="absolute top-[5px] left-1/2 -translate-x-1/2 w-[16px] h-[16px] rounded-full overflow-hidden flex items-center justify-center font-bold text-[8px] tracking-tighter ${
            isHiring ? 'text-emerald-700' : 'text-blue-700'
          }">
            ${startup.logo 
              ? `<img src="${startup.logo}" alt="${startup.name}" class="w-full h-full object-cover" onerror="this.style.display='none';this.parentElement.innerText='${initials}'" />` 
              : initials
            }
          </div>

          <!-- Pulsing hiring badge dot on top right -->
          ${isHiring ? `
            <span class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-1.5 ring-white"></span>
            </span>
          ` : ''}

          <!-- Micro tooltip on hover -->
          <div class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            <div class="px-2 py-0.5 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1 ${
              isHiring ? 'bg-emerald-950/95 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-950/95 text-white border border-zinc-700'
            }">
              <span>${startup.name}</span>
              ${isHiring ? '<span class="text-[8px] bg-emerald-500 text-white px-1 rounded-xs">HIRING</span>' : ''}
            </div>
          </div>

        </div>
      `;

      const icon = L.divIcon({
        html: pinHtml,
        className: 'custom-map-pin',
        iconSize: [pinWidth, pinHeight],
        iconAnchor: [pinWidth / 2, pinHeight], // Bottom needle tip anchors directly to coordinates
        popupAnchor: [0, -pinHeight]
      });

      const marker = L.marker(startup.coordinates, { icon }).addTo(map);

      // Clean, elegant popup
      const popupHtml = `
        <div class="p-3.5 max-w-[280px] font-sans ${isDark ? 'text-zinc-100' : 'text-zinc-800'}">
          <div class="flex items-start gap-2.5">
            <div class="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 shrink-0 flex items-center justify-center font-bold text-xs">
              <img src="${startup.logo}" alt="${startup.name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='${initials}'" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="font-display font-bold text-sm truncate">${startup.name}</h4>
                ${isHiring ? '<span class="px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">HIRING</span>' : ''}
              </div>
              <p class="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">${startup.area}, <strong>${startup.city}</strong></p>
            </div>
          </div>
          
          <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">${startup.description}</p>
          
          <div class="mt-2.5 flex flex-wrap gap-1">
            <span class="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">${startup.sector}</span>
            <span class="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">${startup.stage}</span>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <button id="view-details-btn-${startup._id}" class="flex-1 py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer">
              <span>View Roles</span>
            </button>
            ${isHiring && startup.careersUrl ? `
              <a href="${startup.careersUrl}" target="_blank" rel="noopener noreferrer" class="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer whitespace-nowrap">
                <span>Apply ↗</span>
              </a>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: true
      });

      marker.on('click', () => {
        playPinClickSound();
        onSelectStartup(startup);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-btn-${startup._id}`);
        if (btn) {
          btn.onclick = () => onSelectStartup(startup);
        }
      });

      markersRef.current[startup._id] = marker;
    });
  }, [startups, selectedStartup, isDark, onSelectStartup]);

  // Fly to selected startup
  useEffect(() => {
    if (!selectedStartup || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.flyTo(selectedStartup.coordinates, 14, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const marker = markersRef.current[selectedStartup._id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 500);
    }
  }, [selectedStartup]);

  const recenterMap = () => {
    mapInstanceRef.current?.flyTo([28.520, 77.225], 11, { duration: 1 });
  };

  const hiringCount = startups.filter((s) => s.isHiring).length;

  return (
    <div className="relative h-full w-full overflow-hidden bg-white dark:bg-[#08111b]">
      {/* Leaflet map container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Top Left Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Map / List View Switcher */}
        <div role="group" aria-label="View mode toggle" className="inline-flex items-center rounded-xl bg-white/95 border border-zinc-200/90 p-1 shadow-md dark:bg-[#0e1a2b]/95 dark:border-white/[0.12] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
              viewMode === 'map' || viewMode === 'split'
                ? 'bg-[#183661] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Map View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
              viewMode === 'list'
                ? 'bg-[#183661] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>List View</span>
          </button>
        </div>

        {/* Hiring Only Filter Button */}
        <button
          type="button"
          onClick={() => setOnlyHiring(!onlyHiring)}
          aria-pressed={onlyHiring}
          className={`h-10 shrink-0 inline-flex items-center gap-2 rounded-xl px-3.5 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer select-none shadow-md border ${
            onlyHiring
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
              : 'bg-white/95 border-zinc-200/90 text-zinc-800 hover:border-zinc-400 dark:bg-[#0e1a2b]/95 dark:border-white/[0.12] dark:text-zinc-200'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${onlyHiring ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
          <span>Hiring Only</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${onlyHiring ? 'bg-emerald-700' : 'bg-zinc-100 dark:bg-white/10'}`}>
            {hiringCount}
          </span>
        </button>
      </div>

      {/* Floating Bottom Left: Clean Pin Legend */}
      <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-3.5 rounded-xl px-3.5 py-2 border border-zinc-200/90 bg-white/95 shadow-md backdrop-blur-md dark:border-white/[0.12] dark:bg-[#0e1a2b]/95 text-xs font-semibold select-none">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            {/* Blue Pin icon representation */}
            <span className="inline-block w-2.5 h-3.5 bg-blue-500 rounded-t-full rounded-b-xs shadow-xs" />
            <span>Startup</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            {/* Green Pin icon representation */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Hiring Now</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Right: Recenter & View Switcher */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Recenter button */}
        <button
          onClick={recenterMap}
          title="Recenter over Delhi NCR"
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-zinc-200/90 bg-white/95 text-zinc-800 backdrop-blur-md shadow-md hover:bg-zinc-50 dark:border-white/[0.12] dark:bg-[#0e1a2b]/95 dark:text-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer"
        >
          <Crosshair className="h-3.5 w-3.5 text-teal-500" />
          <span>NCR Center</span>
        </button>

        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'split' : 'map')}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-zinc-200/90 bg-white/95 text-zinc-800 backdrop-blur-md shadow-md hover:bg-zinc-50 dark:border-white/[0.12] dark:bg-[#0e1a2b]/95 dark:text-zinc-200 dark:hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer"
        >
          <span>{viewMode === 'map' ? 'Split View' : 'Full Map'}</span>
        </button>
      </div>
    </div>
  );
};
