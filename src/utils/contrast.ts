export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '').trim();
  const expanded =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(expanded, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hexA: string, hexB: string): number {
  const lumA = getRelativeLuminance(hexA);
  const lumB = getRelativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagGrade = 'AAA' | 'AA' | 'AA Large' | 'Fail';

export function getWcagGrade(ratio: number): WcagGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export interface ContrastPair {
  id: string;
  role: string;
  foregroundLabel: string;
  backgroundLabel: string;
  nordicDark: { fg: string; bg: string };
  nordicLight: { fg: string; bg: string };
  foretMiel: { fg: string; bg: string };
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  {
    id: 'primary-canvas',
    role: 'Primary body text on app canvas',
    foregroundLabel: '--ink',
    backgroundLabel: '--surface-1',
    nordicDark: { fg: '#eceff4', bg: '#1a1d24' },
    nordicLight: { fg: '#1a1d24', bg: '#f4f6f9' },
    foretMiel: { fg: '#fcf8ec', bg: '#132f20' },
  },
  {
    id: 'task-card-title',
    role: 'Task title on task card surface',
    foregroundLabel: '--ink',
    backgroundLabel: '--surface-2',
    nordicDark: { fg: '#eceff4', bg: '#222731' },
    nordicLight: { fg: '#1a1d24', bg: '#ffffff' },
    foretMiel: { fg: '#fcf8ec', bg: '#4a401d' },
  },
  {
    id: 'task-muted-meta',
    role: 'Muted metadata on task card',
    foregroundLabel: '--ink-muted',
    backgroundLabel: '--surface-2',
    nordicDark: { fg: '#9aa5b8', bg: '#222731' },
    nordicLight: { fg: '#4d576a', bg: '#ffffff' },
    foretMiel: { fg: '#cbb27a', bg: '#4a401d' },
  },
  {
    id: 'accent-on-canvas',
    role: 'Primary accent links & icons on canvas',
    foregroundLabel: '--nm-accent',
    backgroundLabel: '--surface-1',
    nordicDark: { fg: '#81a1c1', bg: '#1a1d24' },
    nordicLight: { fg: '#43658b', bg: '#f4f6f9' },
    foretMiel: { fg: '#fdca89', bg: '#132f20' },
  },
  {
    id: 'ink-on-accent-btn',
    role: 'Button label on primary action fill',
    foregroundLabel: '--ink-on-accent',
    backgroundLabel: '--nm-accent',
    nordicDark: { fg: '#13161c', bg: '#81a1c1' },
    nordicLight: { fg: '#ffffff', bg: '#43658b' },
    foretMiel: { fg: '#132f20', bg: '#fdca89' },
  },
  {
    id: 'sidenav-text',
    role: 'Sidebar navigation text',
    foregroundLabel: '--ink',
    backgroundLabel: '--surface-0',
    nordicDark: { fg: '#eceff4', bg: '#13161c' },
    nordicLight: { fg: '#1a1d24', bg: '#e8ecf2' },
    foretMiel: { fg: '#fcf8ec', bg: '#0c2016' },
  },
];

export interface CssTokenSpec {
  variable: string;
  category: 'Surface' | 'Ink' | 'Accent' | 'State & Border';
  foretMielValue: string;
  nordicDarkValue: string;
  nordicLightValue: string;
  usage: string;
}

export const CSS_TOKEN_SPECS: CssTokenSpec[] = [
  {
    variable: '--surface-0',
    category: 'Surface',
    foretMielValue: '#0c2016',
    nordicDarkValue: '#13161c',
    nordicLightValue: '#e8ecf2',
    usage: 'Deepest recessed container, navigation sidenav & scrollbar track',
  },
  {
    variable: '--surface-1',
    category: 'Surface',
    foretMielValue: '#132f20',
    nordicDarkValue: '#1a1d24',
    nordicLightValue: '#f4f6f9',
    usage: 'Primary application background canvas (mapped to --evergreen)',
  },
  {
    variable: '--surface-2',
    category: 'Surface',
    foretMielValue: '#4a401d',
    nordicDarkValue: '#222731',
    nordicLightValue: '#ffffff',
    usage: 'Task cards and primary content containers (mapped to --bark)',
  },
  {
    variable: '--surface-3',
    category: 'Surface',
    foretMielValue: '#5a4f26',
    nordicDarkValue: '#2a303d',
    nordicLightValue: '#eef2f7',
    usage: 'Hovered and active task card state',
  },
  {
    variable: '--surface-4',
    category: 'Surface',
    foretMielValue: '#1c4030',
    nordicDarkValue: '#252b36',
    nordicLightValue: '#ffffff',
    usage: 'Top toolbar, modal dialogs, menus, and elevation banners',
  },
  {
    variable: '--nm-accent',
    category: 'Accent',
    foretMielValue: '#fdca89 (--honey)',
    nordicDarkValue: '#81a1c1',
    nordicLightValue: '#43658b',
    usage: 'Primary accent for active task rings, buttons, links, and icons',
  },
  {
    variable: '--nm-accent-hover',
    category: 'Accent',
    foretMielValue: '#cbb27a (--amber)',
    nordicDarkValue: '#9ab5d1',
    nordicLightValue: '#355273',
    usage: 'Primary button and interactive accent hover state',
  },
  {
    variable: '--nm-frost',
    category: 'Accent',
    foretMielValue: '#2a7f5e (--jade)',
    nordicDarkValue: '#88c0d0',
    nordicLightValue: '#3b768f',
    usage: 'Secondary frost cyan highlight for timers and progress',
  },
  {
    variable: '--ink',
    category: 'Ink',
    foretMielValue: '#fcf8ec',
    nordicDarkValue: '#eceff4',
    nordicLightValue: '#1a1d24',
    usage: 'Primary readable text color across canvas and cards',
  },
  {
    variable: '--ink-strong',
    category: 'Ink',
    foretMielValue: '#ffffff',
    nordicDarkValue: '#ffffff',
    nordicLightValue: '#0f1217',
    usage: 'High-emphasis headings and toolbar titles',
  },
  {
    variable: '--ink-muted',
    category: 'Ink',
    foretMielValue: '#cbb27a',
    nordicDarkValue: '#9aa5b8',
    nordicLightValue: '#4d576a',
    usage: 'Secondary metadata, timestamps, and subtle labels',
  },
  {
    variable: '--ink-on-accent',
    category: 'Ink',
    foretMielValue: '#132f20',
    nordicDarkValue: '#13161c',
    nordicLightValue: '#ffffff',
    usage: 'Text and icon ink inside primary filled action buttons',
  },
  {
    variable: '--separator',
    category: 'State & Border',
    foretMielValue: 'rgba(203, 178, 122, .25)',
    nordicDarkValue: 'rgba(129, 161, 193, 0.22)',
    nordicLightValue: 'rgba(67, 101, 139, 0.20)',
    usage: 'Accent-tinted section separators and scrollbar thumbs',
  },
  {
    variable: '--divider',
    category: 'State & Border',
    foretMielValue: 'rgba(252, 248, 236, .12)',
    nordicDarkValue: 'rgba(236, 239, 244, 0.10)',
    nordicLightValue: 'rgba(26, 29, 36, 0.09)',
    usage: 'Hairline structural dividers for toolbars, sidenav, and lists',
  },
  {
    variable: '--scrim',
    category: 'State & Border',
    foretMielValue: 'rgba(12, 32, 22, .7)',
    nordicDarkValue: 'rgba(13, 16, 22, 0.78)',
    nordicLightValue: 'rgba(26, 29, 36, 0.45)',
    usage: 'Modal and mobile drawer backdrop overlay',
  },
];
