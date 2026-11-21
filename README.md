# Nordic Midnight — Super Productivity Theme & Interactive Studio

**Nordic Midnight** is a high-contrast, modern dark theme for [Super Productivity](https://github.com/super-productivity/super-productivity), forked from [Forêt Miel](https://github.com/Oblavioon/Foret-Miel-Theme-for-SuperProductivity-) and redesigned around a `#1a1d24` cool-slate canvas and `#81a1c1` glacier-blue accents.

This repository includes both the standalone installable Super Productivity stylesheet (`nordic-midnight/nordic-midnight.css`) and an interactive web studio for previewing the theme, auditing WCAG contrast ratios, inspecting CSS variables, and testing dynamic system light/dark preference switching across desktop, tablet, and mobile viewports.

## Palette & Contrast

| Role | CSS Variable | Dark (`#1a1d24`) | Light (`Nordic Daylight`) | Contrast on Canvas |
| :--- | :--- | :--- | :--- | :--- |
| Deep Sidenav | `--surface-0` | `#13161c` | `#e8ecf2` | Surface track |
| App Background | `--surface-1` | `#1a1d24` | `#f4f6f9` | Canvas baseline |
| Task Cards | `--surface-2` | `#222731` | `#ffffff` | Card surface |
| Card Hover | `--surface-3` | `#2a303d` | `#eef2f7` | Active hover |
| Primary Accent | `--nm-accent` | `#81a1c1` | `#43658b` | 6.15:1 / 5.71:1 (AA) |
| Primary Ink | `--ink` | `#eceff4` | `#1a1d24` | 14.70:1 / 15.50:1 (AAA) |
| Muted Ink | `--ink-muted` | `#9aa5b8` | `#4d576a` | 6.62:1 / 6.75:1 (AA) |

## Key Features

- **WCAG AA/AAA Readability**: Calibrated cool-slate hierarchy and crisp `#eceff4` / `#9aa5b8` ink tokens for long focus sessions.
- **Seamless CSS Variable Compatibility**: Preserves `--surface-0` through `--surface-4`, `--ink`, `--ink-strong`, `--ink-muted`, `--ink-on-channel`, `--state-*`, `--separator`, `--divider`, `--scrim`, and legacy palette aliases (`--canvas`, `--honey`, `--amber`, `--jade`, `--bark`, `--evergreen`).
- **Dynamic System Preference Support**: Respects OS `prefers-color-scheme` (`dark` / `light`) automatically while honoring explicit `.isDarkTheme` / `.isLightTheme` theme toggles.
- **Responsive Design**: Adaptive Focus Mode band, bounded mobile navigation drawers, and touch-friendly controls (`>= 44px` on small viewports).

## Install the Theme in Super Productivity

1. Download [`nordic-midnight/nordic-midnight.css`](./nordic-midnight/nordic-midnight.css).
2. Open **Super Productivity → Settings → General → Appearance**.
3. Set **Dark Mode** to **System** (automatic light/dark) or **Dark**.
4. Under **Theme**, click **Install theme** and select `nordic-midnight.css`.
5. Choose **Nordic Midnight**.

## Running the Interactive Preview App Locally

### Prerequisites

- Node.js 20+

### Commands

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Type-check:

```bash
npm run lint
```

## Project Structure

- `nordic-midnight/nordic-midnight.css` — Installable Super Productivity CSS theme
- `nordic-midnight/README.md` — Theme-specific documentation
- `src/` — Interactive theme preview, dynamic preference switcher, WCAG contrast auditor, and CSS variable inspector
- `LICENSE` — MIT License

## License

MIT License — See [`LICENSE`](./LICENSE). Forked from [Oblavioon/Foret-Miel-Theme-for-SuperProductivity-](https://github.com/Oblavioon/Foret-Miel-Theme-for-SuperProductivity-).
