import type { ZoneId } from './zones';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export type PlatformType = 'normal' | 'moving' | 'breakable' | 'spring' | 'cloud' | 'ice';

export interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  vx: number;
  broken: boolean;
  breakTimer: number;
  breakDelay: number;
  springCompressed: number;
  hasCoin: boolean;
  coinAngle: number;
  iceSlip: boolean;
  wobble: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: number;
  squash: number;
  stretch: number;
  rotation: number;
  invulnerable: number;
  jetpackFuel: number;
  propellerFuel: number;
  hitFlash: number;
  trail: { x: number; y: number; life: number }[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  gravity: number;
  shape: 'circle' | 'square' | 'star' | 'spark';
}

export interface PowerUpType {
  type: 'jetpack' | 'propeller' | 'spring_shoes' | 'shield' | 'extra_life';
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  bobOffset: number;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  type: 'flyer' | 'walker';
  alive: boolean;
  deathTimer: number;
  wobble: number;
}

export interface Coin {
  x: number;
  y: number;
  collected: boolean;
  angle: number;
  bob: number;
}

export interface GameSnapshot {
  state: GameState;
  score: number;
  coins: number;
  height: number;
  lives: number;
  hasJetpack: boolean;
  hasPropeller: boolean;
  hasShield: boolean;
  hasSpringShoes: boolean;
  jetpackFuel: number;
  propellerFuel: number;
  zone: ZoneId;
  zoneName: string;
  zoneSubtitle: string;
  rouletteReady: boolean;
  isZoneTest: boolean;
}

export type ViewMode = 'auto' | 'mobile' | 'desktop';
