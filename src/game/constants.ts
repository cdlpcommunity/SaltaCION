export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;

export const GRAVITY = 0.38;
export const JUMP_VELOCITY = -11.5;
export const SPRING_VELOCITY = -20;
export const JETPACK_VELOCITY = -6;
export const PROPELLER_VELOCITY = -4;

export const MOVE_ACCEL = 0.65;
export const MOVE_MAX = 5.2;
export const FRICTION = 0.86;
export const AIR_FRICTION = 0.94;

export const PLAYER_WIDTH = 36;
export const PLAYER_HEIGHT = 40;

export const PLATFORM_WIDTH = 68;
export const PLATFORM_HEIGHT = 14;
export const MOVING_PLATFORM_WIDTH = 60;

export const PLATFORM_SPACING_MIN = 60;
export const PLATFORM_SPACING_MAX = 100;

export const COIN_VALUE = 10;
export const ROULETTE_COST = 10;
export const HEIGHT_SCORE_DIVISOR = 10;

export const MAX_PARTICLES = 200;
export const SCREEN_WRAP = true;

export const COLORS = {
  bgTop: '#0F172A',
  bgMid: '#1e293b',
  bgBottom: '#334155',
  ui: {
    primary: '#0F172A',
    secondary: '#FF5A36',
    tertiary: '#FFFFFF',
    extra: '#F1F5F9',
  },
  platformNormal: { top: '#4ade80', side: '#16a34a', dark: '#15803d', highlight: '#86efac', texture: '#22c55e' },
  platformMoving: { top: '#60a5fa', side: '#2563eb', dark: '#1d4ed8', highlight: '#93c5fd', texture: '#3b82f6' },
  platformBreakable: { top: '#fbbf24', side: '#d97706', dark: '#b45309', highlight: '#fde68a', texture: '#f59e0b' },
  platformSpring: { top: '#f472b6', side: '#db2777', dark: '#9d174d', highlight: '#fbcfe8', texture: '#ec4899' },
  platformCloud: { top: '#F1F5F9', side: '#cbd5e1', dark: '#94a3b8', highlight: '#ffffff', texture: '#e2e8f0' },
  platformIce: { top: '#67e8f9', side: '#0891b2', dark: '#155e75', highlight: '#a5f3fc', texture: '#22d3ee' },
  player: { body: '#fbbf24', dark: '#d97706', light: '#fde68a', eye: '#1e1b4b', cheek: '#fb7185' },
  coin: { gold: '#fcd34d', dark: '#d97706', shine: '#fef3c7' },
  enemy: { body: '#ef4444', dark: '#991b1b', eye: '#fef2f2', pupil: '#1e1b4b' },
  jetpack: { body: '#6366f1', dark: '#3730a3', flame: '#fb923c' },
  propeller: { body: '#14b8a6', dark: '#0f766e', blade: '#5eead4' },
  shield: { body: '#06b6d4', glow: '#67e8f9' },
  springShoes: { body: '#a78bfa', dark: '#7c3aed' },
} as const;
