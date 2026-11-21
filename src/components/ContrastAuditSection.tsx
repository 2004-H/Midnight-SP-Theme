import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  CONTRAST_PAIRS,
  getContrastRatio,
  getWcagGrade,
} from '../utils/contrast';

interface Swatch {
  name: string;
  token: string;
  hex: string;
  role: string;
}

const NORDIC_SWATCHES: Swatch[] = [
  { name: 'Abyss', token: '--surface-0', hex: '#13161c', role: 'Sidenav & recessed tracks' },
  { name: 'Midnight Canvas', token: '--surface-1', hex: '#1a1d24', role: 'Primary app background' },
  { name: 'Slate Card', token: '--surface-2', hex: '#222731', role: 'Task cards & panels' },
  { name: 'Slate Hover', token: '--surface-3', hex: '#2a303d', role: 'Active hover state' },
  { name: 'Glacier Accent', token: '--nm-accent', hex: '#81a1c1', role: 'Primary buttons & focus' },
  { name: 'Frost Cyan', token: '--nm-frost', hex: '#88c0d0', role: 'Secondary highlights' },
  { name: 'Snow Ink', token: '--ink', hex: '#eceff4', role: 'Primary readable text' },
  { name: 'Slate Mist', token: '--ink-muted', hex: '#9aa5b8', role: 'Muted metadata & labels' },
];

export function ContrastAuditSection() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      window.setTimeout(() => setCopiedHex(null), 1600);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section id="contrast" className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-strong)]">
          Palette & WCAG Contrast Audit
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)] max-w-2xl">
          Replacing Forêt Miel&apos;s warm bark and amber tokens with a calibrated cool-slate hierarchy raises primary and muted text legibility cleanly above WCAG AA and AAA thresholds.
        </p>
      </div>

      {/* Interactive Core Swatches */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 mb-8">
        {NORDIC_SWATCHES.map((swatch) => {
          const isCopied = copiedHex === swatch.hex;
          return (
            <button
              key={swatch.token}
              type="button"
              onClick={() => handleCopyHex(swatch.hex)}
              title={`Copy ${swatch.hex}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--surface-2)] text-left transition-colors hover:border-[var(--nm-accent)] cursor-pointer"
            >
              <div
                className="h-14 w-full border-b border-[var(--divider)]"
                style={{ backgroundColor: swatch.hex }}
              />
              <div className="p-2.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-semibold text-[var(--ink-strong)] tabular-nums">
                    {swatch.hex}
                  </span>
                  {isCopied ? (
                    <Check className="h-3 w-3 text-[var(--nm-accent)] shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3 w-3 text-[var(--ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-[var(--ink)] truncate">
                  {swatch.name}
                </p>
                <p className="text-[11px] text-[var(--ink-muted)] font-mono truncate">
                  {swatch.token}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contrast Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--surface-2)]">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--divider)] bg-[var(--surface-0)]/60 text-xs font-semibold text-[var(--ink-muted)]">
              <th className="px-4 py-3">UI Element Pair</th>
              <th className="px-4 py-3">Nordic Midnight (Dark)</th>
              <th className="px-4 py-3">Nordic Daylight (Light)</th>
              <th className="px-4 py-3">Forêt Miel Baseline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--divider)]">
            {CONTRAST_PAIRS.map((pair) => {
              const darkRatio = getContrastRatio(pair.nordicDark.fg, pair.nordicDark.bg);
              const lightRatio = getContrastRatio(pair.nordicLight.fg, pair.nordicLight.bg);
              const fmRatio = getContrastRatio(pair.foretMiel.fg, pair.foretMiel.bg);

              return (
                <tr key={pair.id} className="hover:bg-[var(--surface-3)]/40 transition-colors">
                  <td className="px-4 py-3.5 align-top">
                    <div className="font-medium text-[var(--ink-strong)]">{pair.role}</div>
                    <div className="mt-0.5 font-mono text-xs text-[var(--ink-muted)]">
                      {pair.foregroundLabel} on {pair.backgroundLabel}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-8 w-12 shrink-0 items-center justify-center rounded-md border border-white/10 font-mono text-xs font-semibold"
                        style={{
                          backgroundColor: pair.nordicDark.bg,
                          color: pair.nordicDark.fg,
                        }}
                      >
                        Aa
                      </span>
                      <div>
                        <div className="font-mono text-xs font-semibold text-[var(--ink-strong)] tabular-nums">
                          {darkRatio.toFixed(2)}:1 · {getWcagGrade(darkRatio)}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--ink-muted)]">
                          {pair.nordicDark.fg} / {pair.nordicDark.bg}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-8 w-12 shrink-0 items-center justify-center rounded-md border border-black/10 font-mono text-xs font-semibold"
                        style={{
                          backgroundColor: pair.nordicLight.bg,
                          color: pair.nordicLight.fg,
                        }}
                      >
                        Aa
                      </span>
                      <div>
                        <div className="font-mono text-xs font-semibold text-[var(--ink-strong)] tabular-nums">
                          {lightRatio.toFixed(2)}:1 · {getWcagGrade(lightRatio)}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--ink-muted)]">
                          {pair.nordicLight.fg} / {pair.nordicLight.bg}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-8 w-12 shrink-0 items-center justify-center rounded-md border border-white/10 font-mono text-xs font-semibold"
                        style={{
                          backgroundColor: pair.foretMiel.bg,
                          color: pair.foretMiel.fg,
                        }}
                      >
                        Aa
                      </span>
                      <div>
                        <div className="font-mono text-xs text-[var(--ink-muted)] tabular-nums">
                          {fmRatio.toFixed(2)}:1 · {getWcagGrade(fmRatio)}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--ink-muted)]">
                          {pair.foretMiel.fg} / {pair.foretMiel.bg}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
