import { useState } from 'react';
import { Check, Copy, Download, Laptop, Moon, Sun } from 'lucide-react';
import nordicMidnightCss from '../nordic-midnight/nordic-midnight.css?raw';
import { ContrastAuditSection } from './components/ContrastAuditSection';
import { CssVariableInspector } from './components/CssVariableInspector';
import { SuperProductivityPreview } from './components/SuperProductivityPreview';
import { TopBar } from './components/TopBar';
import { useThemePreference, type ThemePreference } from './hooks/useThemePreference';

const INSTALL_STEPS = [
  {
    step: '01. Download Theme File',
    detail:
      'Download nordic-midnight.css directly from this workspace or copy its CSS source.',
  },
  {
    step: '02. Open Appearance Settings',
    detail:
      'In Super Productivity, navigate to Settings -> General -> Appearance.',
  },
  {
    step: '03. Set Dark Mode Preference',
    detail:
      'Choose System to follow OS prefers-color-scheme automatically, or Dark for #1a1d24.',
  },
  {
    step: '04. Install & Activate',
    detail:
      'Click Install theme, select nordic-midnight.css, and choose Nordic Midnight.',
  },
];

export default function App() {
  const { preference, setPreference, resolvedTheme, systemTheme } = useThemePreference();
  const [copiedCss, setCopiedCss] = useState(false);

  const handleDownloadCss = () => {
    const blob = new Blob([nordicMidnightCss], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nordic-midnight.css';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(nordicMidnightCss);
      setCopiedCss(true);
      window.setTimeout(() => setCopiedCss(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  const preferenceOptions: {
    value: ThemePreference;
    label: string;
    icon: typeof Laptop;
  }[] = [
    { value: 'system', label: 'System', icon: Laptop },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
  ];

  return (
    <div id="top" className="min-h-screen bg-[var(--surface-1)] text-[var(--ink)]">
      <TopBar onDownloadCss={handleDownloadCss} />

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14 sm:space-y-16">
        {/* Hero & Dynamic Theme Preference Bar */}
        <section className="border-b border-[var(--divider)] pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[var(--ink-muted)] flex flex-wrap items-center gap-2">
                <span>Forked from Forêt Miel</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">#1a1d24 Canvas</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">#81a1c1 Accent</span>
                <span aria-hidden="true">·</span>
                <span>Super Productivity</span>
              </p>

              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[var(--ink-strong)] leading-[1.14] text-balance">
                Nordic Midnight
              </h1>

              <p className="mt-3 text-base text-[var(--ink-muted)] leading-relaxed max-w-[62ch]">
                A high-contrast, modern slate evolution of Forêt Miel for Super Productivity. Built around a clean{' '}
                <code className="font-mono text-sm text-[var(--ink-strong)]">#1a1d24</code> background and{' '}
                <code className="font-mono text-sm text-[var(--nm-accent)]">#81a1c1</code> accents with seamless CSS variable compatibility, automatic system theme switching, and responsive layout polish.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCss}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--nm-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] transition-colors duration-150 hover:bg-[var(--nm-accent-hover)] cursor-pointer"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download nordic-midnight.css</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCss}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--divider)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors duration-150 hover:border-[var(--nm-accent)] cursor-pointer"
                >
                  {copiedCss ? (
                    <>
                      <Check className="h-4 w-4 text-[var(--nm-accent)]" aria-hidden="true" />
                      <span>Copied CSS</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[var(--ink-muted)]" aria-hidden="true" />
                      <span>Copy Theme CSS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic System Preference Switcher */}
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface-2)] p-4 sm:min-w-[300px] shrink-0">
              <div className="flex items-center justify-between gap-4 mb-2.5">
                <span className="text-xs font-semibold text-[var(--ink-strong)]">
                  Theme Preference
                </span>
                <span className="text-xs text-[var(--ink-muted)] font-mono">
                  {preference === 'system'
                    ? `OS: ${systemTheme === 'dark' ? 'Dark' : 'Light'}`
                    : `Active: ${resolvedTheme === 'dark' ? 'Dark' : 'Light'}`}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Theme preference mode"
                className="grid grid-cols-3 gap-1 rounded-lg border border-[var(--divider)] bg-[var(--surface-0)] p-1"
              >
                {preferenceOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = preference === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setPreference(option.value)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--surface-2)] text-[var(--ink-strong)] shadow-xs'
                          : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? 'text-[var(--nm-accent)]' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-2.5 text-xs text-[var(--ink-muted)] leading-relaxed">
                System mode listens to{' '}
                <code className="font-mono text-[11px] text-[var(--ink)]">
                  prefers-color-scheme
                </code>{' '}
                changes in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Workspace Preview */}
        <SuperProductivityPreview />

        {/* WCAG Contrast Audit */}
        <ContrastAuditSection />

        {/* CSS Variable Compatibility & Raw Source */}
        <CssVariableInspector onDownloadCss={handleDownloadCss} />

        {/* Installation Guide */}
        <section id="install" className="scroll-mt-20">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-strong)]">
              Install in Super Productivity
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Compatible with Super Productivity desktop and web builds via custom CSS theme import.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSTALL_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--surface-2)] p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--ink-strong)]">
                  {item.step}
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--divider)] bg-[var(--surface-0)]/50">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 text-xs text-[var(--ink-muted)]">
          <p>
            Nordic Midnight · MIT License · Forked from{' '}
            <a
              href="https://github.com/Oblavioon/Foret-Miel-Theme-for-SuperProductivity-"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--nm-accent)] hover:underline underline-offset-4"
            >
              Oblavioon/Foret-Miel-Theme-for-SuperProductivity-
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href="#preview" className="hover:text-[var(--ink)] transition-colors">
              Preview
            </a>
            <a href="#contrast" className="hover:text-[var(--ink)] transition-colors">
              Contrast
            </a>
            <a href="#variables" className="hover:text-[var(--ink)] transition-colors">
              Variables
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
