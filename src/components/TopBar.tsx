import { Download } from 'lucide-react';

interface TopBarProps {
  onDownloadCss: () => void;
}

export function TopBar({ onDownloadCss }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--divider)] bg-[var(--surface-1)]/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-base font-bold tracking-tight text-[var(--ink-strong)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--nm-accent)] focus-visible:outline-offset-4 rounded-sm"
        >
          Nordic Midnight
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--ink-muted)]"
        >
          <a
            href="#preview"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink-strong)] hover:underline underline-offset-4"
          >
            Preview
          </a>
          <a
            href="#contrast"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink-strong)] hover:underline underline-offset-4"
          >
            Contrast
          </a>
          <a
            href="#variables"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink-strong)] hover:underline underline-offset-4"
          >
            Variables
          </a>
          <a
            href="#install"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink-strong)] hover:underline underline-offset-4"
          >
            Install
          </a>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onDownloadCss}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--nm-accent)] px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--ink-on-accent)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[var(--nm-accent-hover)] focus-visible:outline-2 focus-visible:outline-[var(--nm-accent)] focus-visible:outline-offset-2 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Download CSS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
