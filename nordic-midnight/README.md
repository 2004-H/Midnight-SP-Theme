# Nordic Midnight — a Super Productivity theme

A refined, high-contrast dark theme for [Super Productivity](https://github.com/super-productivity/super-productivity), forked from **Forêt Miel** by OnzeBleu and redesigned around a clean `#1a1d24` slate canvas and `#81a1c1` Nordic glacier-blue accents.

Designed for extended focus sessions with WCAG AA/AAA text legibility, automatic `prefers-color-scheme` system preference support (paired with **Nordic Daylight** in light mode), and responsive sizing across desktop and mobile viewports.

## Palette

| Role | Token | Dark (`#1a1d24`) | Light (`Nordic Daylight`) | Contrast on Canvas |
| :--- | :--- | :--- | :--- | :--- |
| App Background | `--surface-1` | `#1a1d24` | `#f4f6f9` | Baseline |
| Task Cards | `--surface-2` | `#222731` | `#ffffff` | Surface step |
| Primary Accent | `--nm-accent` | `#81a1c1` | `#43658b` | 6.15:1 / 5.71:1 |
| Primary Ink | `--ink` | `#eceff4` | `#1a1d24` | 14.70:1 / 15.50:1 |
| Muted Ink | `--ink-muted` | `#9aa5b8` | `#4d576a` | 6.62:1 / 6.75:1 |

## Features

- **High-Contrast Dark Surface (`#1a1d24`)**: Replaces warm brown/green surfaces with neutral cool slate (`#1a1d24` canvas, `#222731` task cards) for crisp readability.
- **Nordic Accent System (`#81a1c1`)**: Calm glacier-blue accents for active task rings, primary buttons, progress indicators, and focus states.
- **Seamless CSS Variable Compatibility**: Preserves all existing `--surface-0` through `--surface-4`, `--ink*`, `--state-*`, `--separator`, `--divider`, and `--scrim` variables alongside `--nm-*` tokens.
- **Dynamic System Preference Support**: Respects OS `prefers-color-scheme` (`dark` / `light`) automatically while honoring explicit `.isDarkTheme` and `.isLightTheme` toggles.
- **Responsive Viewports**: Touch-friendly targets (`>= 44px` on mobile), bounded drawer widths (`min(85vw, 280px)`), and fluid Focus Mode bands.

## Installation

1. Download `nordic-midnight/nordic-midnight.css`.
2. In Super Productivity, open **Settings -> General -> Appearance**.
3. Set **Dark Mode** to **System** (recommended) or **Dark**.
4. Under **Theme**, click **Install theme** and select `nordic-midnight.css`.
5. Choose **Nordic Midnight**.

## License

MIT License — Forked from [Oblavioon/Foret-Miel-Theme-for-SuperProductivity-](https://github.com/Oblavioon/Foret-Miel-Theme-for-SuperProductivity-).
