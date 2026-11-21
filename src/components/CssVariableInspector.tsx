import { useMemo, useState } from 'react';
import { Check, Copy, Download, Search } from 'lucide-react';
import { CSS_TOKEN_SPECS, type CssTokenSpec } from '../utils/contrast';
import nordicMidnightCss from '../../nordic-midnight/nordic-midnight.css?raw';

interface CssVariableInspectorProps {
  onDownloadCss: () => void;
}

type CategoryFilter = 'All' | CssTokenSpec['category'];

export function CssVariableInspector({ onDownloadCss }: CssVariableInspectorProps) {
  const [activeTab, setActiveTab] = useState<'tokens' | 'source'>('tokens');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSource, setCopiedSource] = useState<boolean>(false);

  const filteredTokens = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CSS_TOKEN_SPECS.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.variable.toLowerCase().includes(q) ||
        item.usage.toLowerCase().includes(q) ||
        item.nordicDarkValue.toLowerCase().includes(q) ||
        item.foretMielValue.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  const handleCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(nordicMidnightCss);
      setCopiedSource(true);
      window.setTimeout(() => setCopiedSource(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section id="variables" className="scroll-mt-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-strong)]">
            CSS Variable Compatibility & Theme Source
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)] max-w-2xl">
            Every custom property from Forêt Miel is preserved and remapped for seamless drop-in compatibility alongside automatic light/dark system preferences.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Inspector view"
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--divider)] bg-[var(--surface-0)] p-1 self-start sm:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tokens'}
            onClick={() => setActiveTab('tokens')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-[var(--surface-2)] text-[var(--ink-strong)]'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            Variable Mapping
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'source'}
            onClick={() => setActiveTab('source')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'source'
                ? 'bg-[var(--surface-2)] text-[var(--ink-strong)]'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            nordic-midnight.css
          </button>
        </div>
      </div>

      {activeTab === 'tokens' ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter variables or usage..."
                aria-label="Filter CSS variables"
                className="h-10 w-full rounded-lg border border-[var(--divider)] bg-[var(--surface-2)] pl-9 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--nm-accent)] focus:outline-none"
              />
            </div>

            <div
              role="group"
              aria-label="Filter variables by category"
              className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--divider)] bg-[var(--surface-0)] p-1"
            >
              {(['All', 'Surface', 'Ink', 'Accent', 'State & Border'] as const).map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategoryFilter(category)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      categoryFilter === category
                        ? 'bg-[var(--surface-2)] text-[var(--ink-strong)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--surface-2)]">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--divider)] bg-[var(--surface-0)]/60 text-xs font-semibold text-[var(--ink-muted)]">
                  <th className="px-4 py-3">CSS Variable</th>
                  <th className="px-4 py-3">Nordic Dark</th>
                  <th className="px-4 py-3">Nordic Light</th>
                  <th className="px-4 py-3">Forêt Miel</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divider)]">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--ink-muted)]">
                      No matching CSS variables found.
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((token) => (
                    <tr key={token.variable} className="hover:bg-[var(--surface-3)]/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--nm-accent)] whitespace-nowrap">
                        {token.variable}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--ink-strong)] whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-sm border border-white/15 shrink-0"
                            style={{ backgroundColor: token.nordicDarkValue }}
                          />
                          <span>{token.nordicDarkValue}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--ink)] whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-sm border border-black/15 shrink-0"
                            style={{ backgroundColor: token.nordicLightValue }}
                          />
                          <span>{token.nordicLightValue}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--ink-muted)] whitespace-nowrap">
                        {token.foretMielValue}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--ink-muted)]">
                        {token.usage}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--surface-0)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--divider)] bg-[var(--surface-2)] px-4 py-3">
            <span className="font-mono text-xs font-medium text-[var(--ink)]">
              nordic-midnight/nordic-midnight.css
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCss}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--divider)] bg-[var(--surface-1)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--nm-accent)] cursor-pointer"
              >
                {copiedSource ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--nm-accent)]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy CSS</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onDownloadCss}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--nm-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-[var(--nm-accent-hover)] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <pre className="max-h-[460px] overflow-auto p-4 font-mono text-xs leading-relaxed text-[var(--ink)]">
            <code>{nordicMidnightCss}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
