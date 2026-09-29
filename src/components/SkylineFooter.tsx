import React from 'react';

interface SkylineFooterProps {
  onOpenMap?: () => void;
  onOpenJobs?: () => void;
  onOpenPostJob?: () => void;
}

export const SkylineFooter: React.FC<SkylineFooterProps> = ({
  onOpenMap,
  onOpenJobs,
  onOpenPostJob,
}) => {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white dark:border-white/[0.08] dark:bg-[#060a10] px-6 sm:px-12 py-6 select-none transition-colors">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left: Official Full Logo Image */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer shrink-0 group"
        >
          <img
            src="/logo.png"
            alt="NCR LaunchMap"
            className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
            style={{ maxWidth: '180px' }}
          />
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs text-zinc-600 dark:text-zinc-400 font-medium flex-wrap justify-center">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Home</button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <button onClick={onOpenMap} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Map</button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <button onClick={onOpenJobs} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Jobs</button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <button onClick={onOpenPostJob} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Post a Job</button>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">About</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Contact</span>
        </div>

        {/* Right: Social Icons & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 text-zinc-400 text-xs">
          <div className="flex items-center gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="Instagram">
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors" aria-label="YouTube">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-[11px] text-zinc-500">© 2025 NCR LaunchMap. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
