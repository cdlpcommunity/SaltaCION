import { GAME_WIDTH, GAME_HEIGHT, COLORS, PLATFORM_HEIGHT, PLATFORM_WIDTH, MOVING_PLATFORM_WIDTH } from './constants';
import type { GameEngine } from './engine';
import type { Platform, Player, Particle, PowerUpType, Enemy } from './types';
import type { CharacterCustomization } from './characterTypes';
import { drawCharacterBody } from './characterDraw';
import type { ZonePalette } from './zones';
import { ZONES } from './zones';
import {
  drawIronBackground,
  drawMagmaBackground,
  drawRockBackground,
  drawCrustBackground,
  drawTroposphereBackground,
  drawStratosphereBackground,
  drawMesosphereBackground,
  drawExosphereBackground,
  drawOrbitBackground,
  drawInterstellarBackground,
  drawMilkyWayBackground,
  drawObservableUniverseBackground,
  drawMultiverseBackground,
  drawHyperspaceBackground,
  drawEmpyreanBackground,
  drawApeironBackground,
  drawMotorInmovilBackground,
} from './backgrounds';

type BgFn = (ctx: CanvasRenderingContext2D, engine: GameEngine, time: number) => void;

const BG_FN_MAP: Record<string, BgFn> = {
  iron: drawIronBackground,
  magma: drawMagmaBackground,
  rock: drawRockBackground,
  crust: drawCrustBackground,
  troposphere: drawTroposphereBackground,
  stratosphere: drawStratosphereBackground,
  mesosphere: drawMesosphereBackground,
  exosphere: drawExosphereBackground,
  orbit: drawOrbitBackground,
  interstellar: drawInterstellarBackground,
  milkyWay: drawMilkyWayBackground,
  observableUniverse: drawObservableUniverseBackground,
  multiverse: drawMultiverseBackground,
  hyperspace: drawHyperspaceBackground,
  empyrean: drawEmpyreanBackground,
  apeiron: drawApeironBackground,
  motorInmovil: drawMotorInmovilBackground,
};

type PlatColorSet = { top: string; side: string; dark: string; highlight: string; texture: string };

// Precomputed cloud platform colors per zone decoration type
interface CloudColors {
  shadow: string;
  dark: string;
  darker: string;
  light: string;
  bright: string;
  mid: string;
  mid2: string;
  rim: string;
}

const CLOUD_COLORS: Record<string, CloudColors> = {
  iron:         { shadow: 'rgba(15,23,42,0.32)', dark: '#94a3b8', darker: '#64748b', light: '#f8fafc', bright: '#ffffff', mid: '#cbd5e1', mid2: '#e2e8f0', rim: 'rgba(253,230,138,0.22)' },
  magma:        { shadow: 'rgba(60,20,5,0.3)',   dark: '#cc7744', darker: '#994422', light: '#ffcc99', bright: '#ffaa66', mid: '#dd8855', mid2: '#ee9955', rim: 'rgba(255,180,80,0.3)' },
  rock:         { shadow: 'rgba(30,20,10,0.3)',  dark: '#7a6a5a', darker: '#5a4a3a', light: '#c4b4a4', bright: '#d4c4b4', mid: '#9a8a7a', mid2: '#aa9a8a', rim: 'rgba(200,180,120,0.2)' },
  crust:        { shadow: 'rgba(40,30,15,0.3)',  dark: '#8a7a5a', darker: '#6a5a3a', light: '#d4c4a4', bright: '#e0d0b0', mid: '#aa9a7a', mid2: '#b8a88a', rim: 'rgba(220,190,100,0.2)' },
  troposphere:  { shadow: 'rgba(20,40,60,0.3)',  dark: '#a0b8d0', darker: '#7090b0', light: '#e0f0ff', bright: '#f0f8ff', mid: '#b0c8e0', mid2: '#c0d8f0', rim: 'rgba(180,220,255,0.2)' },
  stratosphere: { shadow: 'rgba(25,15,50,0.3)',  dark: '#9888c0', darker: '#6858a0', light: '#d0c0f0', bright: '#e0d0ff', mid: '#a898d0', mid2: '#b8a8e0', rim: 'rgba(180,140,255,0.2)' },
  mesosphere:   { shadow: 'rgba(10,30,50,0.3)',  dark: '#70a8d0', darker: '#407090', light: '#a0d8f0', bright: '#c0e8ff', mid: '#80b0c8', mid2: '#90c0d8', rim: 'rgba(80,220,255,0.2)' },
  exosphere:    { shadow: 'rgba(5,15,35,0.3)',   dark: '#5080a8', darker: '#305068', light: '#80b0d8', bright: '#a0c8f0', mid: '#6090b0', mid2: '#70a0c0', rim: 'rgba(100,180,255,0.15)' },
  orbit:        { shadow: 'rgba(20,15,5,0.3)',   dark: '#a09888', darker: '#605848', light: '#d0c0a0', bright: '#e0d0a0', mid: '#a09078', mid2: '#b0a088', rim: 'rgba(255,200,80,0.2)' },
  interstellar: { shadow: 'rgba(15,5,30,0.3)',   dark: '#8870a8', darker: '#584080', light: '#b0a0e0', bright: '#d0c0ff', mid: '#9080c0', mid2: '#a090d0', rim: 'rgba(180,120,255,0.2)' },
  milkyWay:     { shadow: 'rgba(5,15,40,0.3)',   dark: '#6890b0', darker: '#386890', light: '#90c0e0', bright: '#b0d0f0', mid: '#70a0c0', mid2: '#80b0d0', rim: 'rgba(100,160,255,0.2)' },
  observableUniverse: { shadow: 'rgba(5,10,25,0.3)', dark: '#486898', darker: '#284068', light: '#70a0c8', bright: '#90b8e0', mid: '#5088b0', mid2: '#6098c0', rim: 'rgba(80,140,220,0.15)' },
  multiverse:   { shadow: 'rgba(20,5,15,0.3)',   dark: '#9050a0', darker: '#602070', light: '#c080d0', bright: '#e0a0f0', mid: '#a060b0', mid2: '#b070c0', rim: 'rgba(220,60,180,0.2)' },
  hyperspace:   { shadow: 'rgba(15,12,5,0.3)',   dark: '#a09878', darker: '#605838', light: '#d0c898', bright: '#e8d8a8', mid: '#988868', mid2: '#a89878', rim: 'rgba(220,180,60,0.2)' },
  empyrean:     { shadow: 'rgba(20,12,3,0.3)',   dark: '#c0a868', darker: '#806838', light: '#f0e0b0', bright: '#fff0c8', mid: '#b89858', mid2: '#c8a868', rim: 'rgba(255,200,80,0.22)' },
  apeiron:      { shadow: 'rgba(10,0,20,0.3)',   dark: '#584090', darker: '#281850', light: '#8868c0', bright: '#a080e0', mid: '#6848a0', mid2: '#7858b0', rim: 'rgba(120,40,180,0.2)' },
  motorInmovil: { shadow: 'rgba(8,8,4,0.3)',     dark: '#b8b890', darker: '#888860', light: '#ffffd0', bright: '#ffffe8', mid: '#a0a078', mid2: '#b8b890', rim: 'rgba(255,255,200,0.22)' },
};

// NormalOverlay zone color lookup: { color, decoType }
const NORMAL_OVERLAY_COLORS: Record<string, string> = {
  iron: 'rgba(150,255,220,0.08)',
  rock: 'rgba(100,180,80,0.06)',
  crust: 'rgba(160,130,80,0.06)',
  troposphere: 'rgba(200,230,255,0.06)',
  stratosphere: 'rgba(180,140,255,0.06)',
  mesosphere: 'rgba(80,220,255,0.08)',
  exosphere: 'rgba(100,180,255,0.06)',
  orbit: 'rgba(255,180,60,0.08)',
  interstellar: 'rgba(180,100,255,0.07)',
  milkyWay: 'rgba(100,160,255,0.07)',
  observableUniverse: 'rgba(80,140,220,0.06)',
  multiverse: 'rgba(220,60,180,0.07)',
  hyperspace: 'rgba(220,180,60,0.07)',
  empyrean: 'rgba(255,200,100,0.08)',
  apeiron: 'rgba(100,30,160,0.07)',
  motorInmovil: 'rgba(255,255,200,0.08)',
  magma: 'rgba(255,140,60,0.08)',
};

// Texture overlay color per decoration type (the glow dots + sheen)
interface TextureColors {
  dotColor: string;
  sheenColor: string;
}

const TEXTURE_COLORS: Record<string, TextureColors> = {
  iron: { dotColor: 'rgba(150,255,220,0.06)', sheenColor: 'rgba(200,255,240,0.04)' },
  magma: { dotColor: 'rgba(255,180,50,0.08)', sheenColor: 'rgba(255,200,50,0.1)' },
  rock: { dotColor: 'rgba(100,180,80,0.05)', sheenColor: 'rgba(80,50,30,0.06)' },
  crust: { dotColor: 'rgba(160,130,80,0.06)', sheenColor: 'rgba(0,0,0,0.05)' },
  troposphere: { dotColor: 'rgba(200,230,255,0.06)', sheenColor: 'rgba(180,220,255,0.04)' },
  stratosphere: { dotColor: 'rgba(180,140,255,0.06)', sheenColor: 'rgba(220,200,255,0.04)' },
  mesosphere: { dotColor: 'rgba(80,220,255,0.08)', sheenColor: 'rgba(120,240,200,0.04)' },
  exosphere: { dotColor: 'rgba(100,180,255,0.06)', sheenColor: 'rgba(150,200,240,0.04)' },
  orbit: { dotColor: 'rgba(255,180,60,0.08)', sheenColor: 'rgba(255,220,120,0.04)' },
  interstellar: { dotColor: 'rgba(180,100,255,0.07)', sheenColor: 'rgba(220,160,255,0.04)' },
  milkyWay: { dotColor: 'rgba(100,160,255,0.07)', sheenColor: 'rgba(160,200,255,0.04)' },
  observableUniverse: { dotColor: 'rgba(80,140,220,0.06)', sheenColor: 'rgba(120,180,255,0.03)' },
  multiverse: { dotColor: 'rgba(220,60,180,0.07)', sheenColor: 'rgba(60,240,200,0.04)' },
  hyperspace: { dotColor: 'rgba(220,180,60,0.07)', sheenColor: 'rgba(200,170,80,0.04)' },
  empyrean: { dotColor: 'rgba(255,200,100,0.08)', sheenColor: 'rgba(255,230,150,0.04)' },
  apeiron: { dotColor: 'rgba(100,30,160,0.07)', sheenColor: 'rgba(140,50,200,0.04)' },
  motorInmovil: { dotColor: 'rgba(255,255,200,0.08)', sheenColor: 'rgba(255,255,240,0.04)' },
};

// Texture has a special case for magma with extra lava line
function drawTextureOverlay(ctx: CanvasRenderingContext2D, decoType: string, x: number, y: number, w: number, _h: number, texColor: string) {
  const tc = TEXTURE_COLORS[decoType] ?? TEXTURE_COLORS.iron;

  // Base texture blocks (shared by all zones except iron which uses a slightly different pattern)
  ctx.fillStyle = texColor;
  if (decoType === 'iron') {
    for (let i = 4; i < w - 4; i += 8) {
      ctx.fillRect(x + i, y + 2, 3, 3);
      ctx.fillRect(x + i + 2, y + 5, 2, 1);
    }
  } else {
    for (let i = 0; i < w; i += 8) {
      ctx.fillRect(x + i + 1, y + 2, 4, 2);
      ctx.fillRect(x + i + 3, y + 5, 3, 1);
    }
  }

  // Glow dots
  ctx.fillStyle = tc.dotColor;
  for (let i = 3; i < w - 3; i += 6) {
    ctx.fillRect(x + i, y + 3, 1, 1);
  }

  // Sheen
  ctx.fillStyle = tc.sheenColor;
  for (let i = 0; i < w; i += 4) {
    ctx.fillRect(x + i, y + 1, 1, 1);
  }

  // Magma special: extra lava glow line
  if (decoType === 'magma') {
    ctx.fillStyle = 'rgba(255,120,0,0.15)';
    ctx.fillRect(x + 4, y + 3, w - 8, 1);
  }
}

function makeVignetteCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const vGrad = ctx.createRadialGradient(
    GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_HEIGHT * 0.3,
    GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_HEIGHT * 0.75
  );
  vGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Edge darkening (4px border)
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, 4, GAME_HEIGHT);
  ctx.fillRect(GAME_WIDTH - 4, 0, 4, GAME_HEIGHT);
  ctx.fillRect(0, 0, GAME_WIDTH, 4);
  ctx.fillRect(0, GAME_HEIGHT - 4, GAME_WIDTH, 4);

  return canvas;
}

function makeBgGradientCanvas(zone: ZonePalette): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  grad.addColorStop(0, zone.bgGradient[0]);
  grad.addColorStop(0.3, zone.bgGradient[1]);
  grad.addColorStop(0.65, zone.bgGradient[2]);
  grad.addColorStop(1, zone.bgGradient[3]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const auroraGrad = ctx.createLinearGradient(0, GAME_HEIGHT * 0.15, 0, GAME_HEIGHT * 0.75);
  auroraGrad.addColorStop(0, 'rgba(0,0,0,0)');
  auroraGrad.addColorStop(0.5, zone.ambientGlow);
  auroraGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = auroraGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const topShade = ctx.createLinearGradient(0, 0, 0, 40);
  topShade.addColorStop(0, 'rgba(0,0,0,0.25)');
  topShade.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = topShade;
  ctx.fillRect(0, 0, GAME_WIDTH, 40);

  return canvas;
}

// Pre-render platform sprites for each zone + type combination
interface PlatformSprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

const PLATFORM_SPRITE_H = 20;

function makePlatformSprite(zone: ZonePalette, type: string, width: number): PlatformSprite {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = PLATFORM_SPRITE_H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const colors = getPlatformColorsForZone(zone, type);
  const x = 0;
  const y = 0;
  const w = width;
  const h = PLATFORM_HEIGHT;

  // 2.5D depth shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + 3, y + h + 1, w, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x + 5, y + h + 4, w - 4, 2);

  // Side face (3D extrusion downward)
  ctx.fillStyle = colors.dark;
  ctx.fillRect(x + 2, y + 4, w, h + 2);
  ctx.fillStyle = colors.side;
  ctx.fillRect(x, y + 2, w, h);

  // Top surface
  ctx.fillStyle = colors.top;
  ctx.fillRect(x, y, w, h - 2);

  // Top surface texture
  const tex = colors.texture || colors.side;
  drawTextureOverlay(ctx, zone.decorationType, x, y, w, h, tex);

  // Top edge highlight
  const hl = colors.highlight || 'rgba(255,255,255,0.3)';
  ctx.fillStyle = hl;
  ctx.fillRect(x + 2, y + 1, w - 4, 1);
  ctx.fillRect(x + 1, y + 1, 2, 1);
  ctx.fillRect(x + w - 3, y + 1, 2, 1);

  // Corner bevels
  ctx.fillStyle = colors.dark;
  ctx.fillRect(x, y + h - 3, 2, 2);
  ctx.fillRect(x + w - 2, y + h - 3, 2, 2);
  ctx.fillRect(x, y + h - 1, w, 1);

  // Side face texture lines
  ctx.fillStyle = colors.dark;
  for (let i = 0; i < w; i += 6) {
    ctx.fillRect(x + i, y + h, 1, 2);
  }

  // Type-specific overlays (static parts only — dynamic parts like spring compression drawn at runtime)
  if (type === 'ice') {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillRect(x + 3, y + 1, 3, 2);
    ctx.fillRect(x + w - 10, y + 2, 3, 1);
    ctx.fillRect(x + (w / 2 | 0) - 2, y + 3, 2, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(x + 4, y + 5, w - 8, 1);
    ctx.fillStyle = 'rgba(165,243,252,0.5)';
    ctx.fillRect(x + 1, y + 1, 1, 1);
    ctx.fillRect(x + w - 2, y + 1, 1, 1);
    ctx.fillStyle = 'rgba(200,240,255,0.3)';
    ctx.fillRect(x + 2, y + 1, 1, 1);
    ctx.fillRect(x + w - 3, y + 1, 1, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 6, y + 2, w - 12, 1);
  }

  if (type === 'breakable') {
    ctx.fillStyle = 'rgba(120,53,15,0.6)';
    ctx.fillRect(x + 5, y + 3, 2, 2);
    ctx.fillRect(x + w - 10, y + 5, 2, 2);
    ctx.fillRect(x + (w / 2 | 0), y + 4, 2, 2);
    ctx.fillRect(x + (w * 0.3) | 0, y + 6, 2, 2);
    ctx.fillRect(x + (w * 0.7) | 0, y + 3, 2, 1);
    ctx.fillStyle = 'rgba(254,243,199,0.4)';
    ctx.fillRect(x + 5, y + 3, 1, 1);
    ctx.fillRect(x + (w / 2 | 0), y + 4, 1, 1);
    ctx.fillStyle = 'rgba(80,40,10,0.3)';
    ctx.fillRect(x + 8, y + 2, 1, 4);
    ctx.fillRect(x + w - 14, y + 3, 1, 3);
  }

  if (type === 'moving') {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const cx = x + (w / 2 | 0);
    ctx.fillRect(cx - 1, y + 2, 2, 2);
    ctx.fillRect(cx - 3, y + 3, 2, 1);
    ctx.fillRect(cx + 3, y + 3, 2, 1);
    ctx.fillStyle = 'rgba(147,197,253,0.4)';
    ctx.fillRect(cx - 5, y + 5, 1, 1);
    ctx.fillRect(cx + 5, y + 5, 1, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 2; i < w - 2; i += 4) {
      ctx.fillRect(x + i, y + h, 2, 1);
    }
  }

  if (type === 'normal') {
    ctx.fillStyle = hl;
    ctx.fillRect(x + 3, y - 1, 1, 1);
    ctx.fillRect(x + 8, y - 1, 2, 1);
    ctx.fillRect(x + w - 12, y - 1, 1, 1);
    ctx.fillRect(x + w - 5, y - 1, 2, 1);
    ctx.fillRect(x + (w / 2 | 0) - 1, y - 1, 2, 1);
    const ovColor = NORMAL_OVERLAY_COLORS[zone.decorationType] ?? NORMAL_OVERLAY_COLORS.iron;
    ctx.fillStyle = ovColor;
    ctx.fillRect(x + 4, y + 6, 1, 1);
    ctx.fillRect(x + w - 10, y + 5, 1, 1);
  }

  // Spring static base (compression handled at runtime)
  if (type === 'spring') {
    drawSpringStatic(ctx, x + w / 2, y);
  }

  return { canvas, width, height: PLATFORM_SPRITE_H };
}

function drawSpringStatic(ctx: CanvasRenderingContext2D, cx: number, platY: number) {
  const h = 14;
  ctx.fillStyle = '#475569';
  ctx.fillRect(cx - 7, platY - h + 1, 14, h);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx - 6, platY - h, 12, h);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(cx - 5, platY - h, 10, 2);
  ctx.fillRect(cx - 5, platY - h + 4, 10, 2);
  ctx.fillRect(cx - 5, platY - h + 8, 10, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(cx - 8, platY - h - 2, 16, 3);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(cx - 7, platY - h - 1, 14, 1);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(cx - 6, platY - h + 2, 1, h - 2);
  ctx.fillRect(cx + 5, platY - h + 2, 1, h - 2);
}

function getPlatformColorsForZone(zone: ZonePalette, type: string): PlatColorSet {
  switch (type) {
    case 'normal': return zone.platformNormal;
    case 'moving': return zone.platformMoving;
    case 'breakable': return zone.platformBreakable;
    case 'spring': return zone.platformSpring;
    case 'cloud': return zone.platformCloud;
    case 'ice': return zone.platformIce;
    default: return zone.platformNormal;
  }
}

type EnemyPal = { body: string; dark: string; eye: string; pupil: string; accent: string; mouth: string };

const ENEMY_PALETTES: Record<string, EnemyPal> = {
  iron:         { body: '#b8c0c8', dark: '#4a4a52', eye: '#e0f8f0', pupil: '#10b981', accent: '#7dd3c0', mouth: '#1e293b' },
  magma:        { body: '#e04020', dark: '#661008', eye: '#fff0a0', pupil: '#ff6000', accent: '#ff9020', mouth: '#330808' },
  rock:         { body: '#8a6840', dark: '#3a2810', eye: '#c8e0a0', pupil: '#4a6020', accent: '#6a5030', mouth: '#1a1208' },
  crust:        { body: '#9a7850', dark: '#4a3820', eye: '#e0d0a0', pupil: '#604010', accent: '#806840', mouth: '#2a1808' },
  troposphere:  { body: '#5080b0', dark: '#204060', eye: '#e0f0ff', pupil: '#1090d0', accent: '#80c0e0', mouth: '#102838' },
  stratosphere: { body: '#6850b8', dark: '#302060', eye: '#e8d8ff', pupil: '#7040d0', accent: '#a888e0', mouth: '#201038' },
  mesosphere:   { body: '#2890c0', dark: '#084060', eye: '#a0f0ff', pupil: '#00b0e0', accent: '#50d0f0', mouth: '#082838' },
  exosphere:    { body: '#385878', dark: '#102838', eye: '#c0e0ff', pupil: '#3080b0', accent: '#587898', mouth: '#081828' },
  orbit:        { body: '#806040', dark: '#302010', eye: '#ffe080', pupil: '#c08020', accent: '#a08060', mouth: '#201008' },
  interstellar: { body: '#7848c0', dark: '#301060', eye: '#e0c0ff', pupil: '#a050ff', accent: '#b080e0', mouth: '#200838' },
  milkyWay:     { body: '#3868b0', dark: '#103060', eye: '#c0e0ff', pupil: '#4090e0', accent: '#68a0d0', mouth: '#082040' },
  observableUniverse: { body: '#284878', dark: '#081830', eye: '#a0c8e8', pupil: '#2070b0', accent: '#4878a8', mouth: '#041020' },
  multiverse:   { body: '#a03080', dark: '#500840', eye: '#ffe0f0', pupil: '#e040c0', accent: '#40e0c0', mouth: '#280820' },
  hyperspace:   { body: '#b0a040', dark: '#403810', eye: '#fff8d0', pupil: '#c0a020', accent: '#e0d060', mouth: '#282008' },
  empyrean:     { body: '#d0a050', dark: '#604018', eye: '#fff5d0', pupil: '#e0a030', accent: '#ffd080', mouth: '#382008' },
  apeiron:      { body: '#502888', dark: '#200840', eye: '#c8a0f0', pupil: '#8030c0', accent: '#6840a0', mouth: '#180830' },
  motorInmovil: { body: '#c8c090', dark: '#605830', eye: '#fffce8', pupil: '#b0a050', accent: '#e8e0a0', mouth: '#383818' },
};

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private pixelRatio = 1;
  private time = 0;
  private customization: CharacterCustomization | null = null;
  private engineRef: { currentZone: ZonePalette } | null = null;

  private vignetteCanvas: HTMLCanvasElement;
  private bgGradientCache: HTMLCanvasElement | null = null;
  private bgGradientZoneId: string = '';
  private platformSprites: Map<string, PlatformSprite> = new Map();
  private platformSpritesZoneId: string = '';
  private lastSnapKey = '';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.pixelRatio = 2;
    canvas.width = GAME_WIDTH * this.pixelRatio;
    canvas.height = GAME_HEIGHT * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    this.vignetteCanvas = makeVignetteCanvas();
  }

  setCustomization(c: CharacterCustomization) {
    this.customization = c;
  }

  private ensurePlatformSprites(zone: ZonePalette) {
    if (this.platformSpritesZoneId === zone.id && this.platformSprites.size > 0) return;
    this.platformSprites.clear();
    this.platformSpritesZoneId = zone.id;

    const types = ['normal', 'moving', 'breakable', 'spring', 'ice'];
    for (const type of types) {
      const width = type === 'moving' ? MOVING_PLATFORM_WIDTH : PLATFORM_WIDTH;
      this.platformSprites.set(type, makePlatformSprite(zone, type, width));
    }
  }

  private getBgGradient(zone: ZonePalette): HTMLCanvasElement {
    if (this.bgGradientZoneId === zone.id && this.bgGradientCache) return this.bgGradientCache;
    this.bgGradientCache = makeBgGradientCanvas(zone);
    this.bgGradientZoneId = zone.id;
    return this.bgGradientCache;
  }

  render(engine: GameEngine) {
    this.time += 0.016;
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    this.engineRef = engine;

    ctx.save();

    if (engine.shake > 0) {
      ctx.translate(
        (Math.random() - 0.5) * engine.shake,
        (Math.random() - 0.5) * engine.shake
      );
    }

    this.drawBackground(engine);

    ctx.save();
    ctx.translate(0, -engine.cameraY);

    this.drawPlatforms(engine);
    this.drawCoins(engine);
    this.drawPowerups(engine);
    this.drawEnemies(engine);
    this.drawParticles(engine);
    this.drawPlayer(engine);

    ctx.restore();

    // Vignette (cached, just drawImage)
    ctx.drawImage(this.vignetteCanvas, 0, 0);

    if (engine.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${engine.flash * 0.3})`;
      if (engine.flashColor === '#ef4444') {
        ctx.fillStyle = `rgba(239,68,68,${engine.flash * 0.3})`;
      }
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    ctx.restore();
  }

  // ===================== BACKGROUND =====================

  private drawBackground(engine: GameEngine) {
    const ctx = this.ctx;
    const zone = engine.currentZone;

    // Cached gradient + ambient glow + top shade
    ctx.drawImage(this.getBgGradient(zone), 0, 0);

    // Zone transition flash
    if (engine.zoneTransition > 0) {
      ctx.fillStyle = zone.ambientGlow.replace(/[\d.]+\)$/, `${engine.zoneTransition * 0.3})`);
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Zone-specific detailed pixel-art landscapes
    const fn = BG_FN_MAP[zone.decorationType] ?? drawIronBackground;
    fn(ctx, engine, this.time);

    // Floating particles
    this.drawBgParticles(engine);
  }

  private drawBgParticles(engine: GameEngine) {
    const ctx = this.ctx;
    for (const bp of engine.bgParticles) {
      const alpha = Math.min(bp.life / bp.maxLife, (bp.life / bp.maxLife) * 0.8);
      const pulse = Math.sin(this.time * 3 + bp.x) * 0.3 + 0.7;
      ctx.fillStyle = bp.color;
      ctx.globalAlpha = alpha * pulse * 0.6;
      ctx.fillRect(bp.x, bp.y, bp.size, bp.size);
      if (bp.size >= 2) {
        ctx.globalAlpha = alpha * pulse * 0.2;
        ctx.fillRect(bp.x - 1, bp.y, 1, 1);
        ctx.fillRect(bp.x + bp.size, bp.y, 1, 1);
        ctx.fillRect(bp.x, bp.y - 1, 1, 1);
        ctx.fillRect(bp.x, bp.y + bp.size, 1, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ===================== PLATFORMS =====================

  private drawPlatforms(engine: GameEngine) {
    const zone = engine.currentZone;
    this.ensurePlatformSprites(zone);

    for (const plat of engine.platforms) {
      if (plat.broken && plat.breakDelay <= 0 && plat.breakTimer > 0.5) continue;
      this.drawPlatform(plat);
    }
  }

  private drawPlatform(plat: Platform) {
    const ctx = this.ctx;
    const x = plat.x + (plat.wobble || 0);
    const y = plat.y;
    const isFalling = plat.broken && plat.breakDelay <= 0;

    if (plat.type === 'cloud') {
      if (isFalling) {
        const alpha = 1 - plat.breakTimer * 2;
        ctx.globalAlpha = Math.max(0, alpha);
      }
      this.drawCloudPlatform(x, y, plat.width, plat.height);
      ctx.globalAlpha = 1;
      return;
    }

    const sprite = this.platformSprites.get(plat.type);
    if (!sprite) return;

    if (isFalling) {
      const alpha = 1 - plat.breakTimer * 2;
      ctx.globalAlpha = Math.max(0, alpha);
    }

    // Draw pre-rendered sprite
    const drawY = y - 2; // sprite includes shadow below, offset so top surface aligns at y
    ctx.drawImage(sprite.canvas, x, drawY);

    // Dynamic overlays (spring compression, breakable crack lines when breaking)
    if (plat.type === 'spring' && plat.springCompressed > 0) {
      this.drawSpringCompressed(x + plat.width / 2, y, plat.springCompressed);
    }

    if (plat.type === 'breakable' && plat.broken && plat.breakDelay > 0) {
      const w = plat.width;
      ctx.fillStyle = 'rgba(60,30,5,0.8)';
      ctx.fillRect(x + (w * 0.2) | 0, y, 1, plat.height);
      ctx.fillRect(x + (w * 0.5) | 0, y, 1, plat.height);
      ctx.fillRect(x + (w * 0.75) | 0, y, 1, plat.height);
      ctx.fillRect(x + (w * 0.35) | 0, y + 3, 1, 3);
      ctx.fillRect(x + (w * 0.6) | 0, y + 2, 1, 4);
      ctx.fillStyle = 'rgba(252,211,77,0.5)';
      ctx.fillRect(x + (w * 0.2) | 0, y, 1, 1);
      ctx.fillRect(x + (w * 0.5) | 0, y, 1, 1);
    }

    ctx.globalAlpha = 1;
  }

  private drawSpringCompressed(cx: number, platY: number, compressed: number) {
    const ctx = this.ctx;
    const h = 14 - compressed * 8;
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 7, platY - h + 1, 14, h);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - 6, platY - h, 12, h);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 5, platY - h, 10, 2);
    ctx.fillRect(cx - 5, platY - h + 4, 10, 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 8, platY - h - 2, 16, 3);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(cx - 7, platY - h - 1, 14, 1);
  }

  private drawCloudPlatform(x: number, y: number, width: number, height: number) {
    const ctx = this.ctx;
    const baseY = y + height - 1;
    const decoType = this.engineRef?.currentZone?.decorationType ?? 'iron';
    const cc = CLOUD_COLORS[decoType] ?? CLOUD_COLORS.iron;

    // Zone-tinted shadow
    ctx.fillStyle = cc.shadow;
    ctx.fillRect(x + 7, baseY + 5, width - 14, 4);
    ctx.fillRect(x + 15, baseY + 9, width - 30, 3);
    ctx.fillRect(x + width - 11, baseY + 4, 5, 4);

    // Cloud body
    ctx.fillStyle = cc.dark;
    ctx.fillRect(x + 5, y + 5, width - 10, height + 4);
    ctx.fillRect(x + 11, y + 3, width - 22, height + 7);
    ctx.fillRect(x + 17, y + 1, width - 34, height + 9);
    ctx.fillRect(x + 2, y + 8, 4, height - 1);
    ctx.fillRect(x + width - 6, y + 8, 4, height - 1);

    ctx.fillStyle = cc.darker;
    ctx.fillRect(x + 8, baseY + 1, 12, 4);
    ctx.fillRect(x + 29, baseY + 2, 10, 5);
    ctx.fillRect(x + 47, baseY + 1, 13, 4);
    ctx.fillRect(x + 14, baseY + 7, 7, 3);
    ctx.fillRect(x + 40, baseY + 7, 8, 3);

    // Cloud highlights
    ctx.fillStyle = cc.light;
    ctx.fillRect(x + 5, y + 2, 18, 7);
    ctx.fillRect(x + 12, y - 1, 14, 8);
    ctx.fillRect(x + 23, y - 4, 22, 11);
    ctx.fillRect(x + 39, y, 19, 8);
    ctx.fillRect(x + 53, y + 3, 10, 6);

    ctx.fillStyle = cc.bright;
    ctx.fillRect(x + 8, y + 1, 13, 2);
    ctx.fillRect(x + 26, y - 4, 15, 2);
    ctx.fillRect(x + 44, y - 1, 10, 2);

    // Mid shadows
    ctx.fillStyle = cc.mid;
    ctx.fillRect(x + 4, y + 9, 8, 2);
    ctx.fillRect(x + 21, y + 8, 10, 2);
    ctx.fillRect(x + 49, y + 9, 9, 2);
    ctx.fillStyle = cc.mid2;
    ctx.fillRect(x + 15, y + 5, 3, 2);
    ctx.fillRect(x + 36, y + 3, 3, 2);

    // Warm rim light
    ctx.fillStyle = cc.rim;
    ctx.fillRect(x + 7, y + 1, 10, 1);
    ctx.fillRect(x + 27, y - 4, 9, 1);
  }

  // ===================== PLAYER =====================

  private drawPlayer(engine: GameEngine) {
    const p = engine.player;
    const ctx = this.ctx;

    for (const t of p.trail) {
      ctx.fillStyle = `rgba(251,191,36,${t.life * 0.3})`;
      const size = t.life * 6;
      ctx.fillRect(t.x - size / 2, t.y - size / 2, size, size);
    }

    ctx.save();
    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;

    const sx = 1 + p.stretch - p.squash;
    const sy = 1 + p.squash - p.stretch;

    ctx.translate(cx, cy);
    ctx.rotate(p.rotation);
    ctx.scale(sx, sy);

    if (p.invulnerable > 0 && Math.floor(this.time * 20) % 2 === 0 && p.hitFlash <= 0) {
      ctx.globalAlpha = 0.5;
    }
    if (p.hitFlash > 0) {
      ctx.globalAlpha = 0.3 + p.hitFlash * 0.7;
    }

    const w = p.width;
    const h = p.height;
    const hw = w / 2;
    const hh = h / 2;

    if (p.propellerFuel > 0) {
      this.drawPropeller(0, -hh - 8, this.time);
    }
    if (p.jetpackFuel > 0) {
      this.drawJetpack(hw - 4, 0);
    }
    if (p.invulnerable > 0 && p.hitFlash <= 0) {
      this.drawShield(0, 0, w * 0.7);
    }

    if (this.customization) {
      drawCharacterBody(ctx, this.customization, w, h, this.time, p.facing);
    } else {
      ctx.fillStyle = COLORS.player.dark;
      ctx.fillRect(-hw + 2, -hh + 4, w - 4, h - 4);

      ctx.fillStyle = COLORS.player.body;
      ctx.fillRect(-hw, -hh, w, h - 2);

      ctx.fillStyle = COLORS.player.light;
      ctx.fillRect(-hw + 2, -hh + 2, w - 4, 3);
      ctx.fillRect(-hw + 2, -hh + 2, 3, h - 6);

      ctx.fillStyle = COLORS.player.dark;
      ctx.fillRect(-hw, hh - 4, w, 4);

      const eyeOffset = p.facing > 0 ? 2 : -2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 8 + eyeOffset, -hh + 8, 7, 8);
      ctx.fillRect(hw - 15 + eyeOffset, -hh + 8, 7, 8);

      ctx.fillStyle = COLORS.player.eye;
      ctx.fillRect(-hw + 10 + eyeOffset, -hh + 10, 4, 5);
      ctx.fillRect(hw - 13 + eyeOffset, -hh + 10, 4, 5);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(-hw + 10 + eyeOffset, -hh + 10, 2, 2);
      ctx.fillRect(hw - 13 + eyeOffset, -hh + 10, 2, 2);

      ctx.fillStyle = COLORS.player.cheek;
      ctx.fillRect(-hw + 4, -hh + 18, 4, 3);
      ctx.fillRect(hw - 8, -hh + 18, 4, 3);

      ctx.fillStyle = COLORS.player.dark;
      ctx.fillRect(-4, -hh + 20, 8, 3);

      ctx.fillStyle = COLORS.player.cheek;
      ctx.fillRect(-3, -hh + 22, 6, 2);

      ctx.fillStyle = COLORS.player.dark;
      ctx.fillRect(-hw + 4, hh - 8, 8, 6);
      ctx.fillRect(hw - 12, hh - 8, 8, 6);

      ctx.fillStyle = COLORS.player.light;
      ctx.fillRect(-hw + 5, hh - 7, 3, 2);
      ctx.fillRect(hw - 11, hh - 7, 3, 2);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private drawJetpack(offsetX: number, offsetY: number) {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.jetpack.dark;
    ctx.fillRect(offsetX - 2, offsetY - 8, 12, 20);
    ctx.fillStyle = COLORS.jetpack.body;
    ctx.fillRect(offsetX, offsetY - 8, 10, 20);
    ctx.fillStyle = COLORS.jetpack.flame;
    const flameH = 6 + Math.random() * 4;
    ctx.fillRect(offsetX + 2, offsetY + 12, 6, flameH);
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(offsetX + 3, offsetY + 12, 4, flameH * 0.6);
  }

  private drawPropeller(x: number, y: number, t: number) {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.propeller.dark;
    ctx.fillRect(x - 1, y, 2, 8);
    ctx.fillStyle = COLORS.propeller.body;
    ctx.fillRect(x - 1, y, 2, 6);

    const angle = t * 30;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = COLORS.propeller.blade;
    ctx.fillRect(-14, -2, 28, 3);
    ctx.fillStyle = COLORS.propeller.dark;
    ctx.fillRect(-14, -2, 28, 1);
    ctx.restore();

    ctx.fillStyle = COLORS.propeller.dark;
    ctx.fillRect(x - 2, y - 1, 4, 3);
  }

  private drawShield(cx: number, cy: number, r: number) {
    const ctx = this.ctx;
    const pulse = Math.sin(this.time * 5) * 0.1 + 1;
    const radius = r * pulse;
    ctx.strokeStyle = `rgba(6,182,212,${0.5 + Math.sin(this.time * 3) * 0.2})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(6,182,212,0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ===================== COLLECTIBLES & ENEMIES =====================

  private drawCoins(engine: GameEngine) {
    const ctx = this.ctx;
    for (const c of engine.coins) {
      if (c.collected) continue;
      const bobY = c.y + Math.sin(c.bob) * 4;
      const scaleX = Math.cos(c.angle);
      const w = Math.abs(scaleX) * 14 + 2;

      ctx.fillStyle = COLORS.coin.dark;
      ctx.fillRect(c.x - w / 2 + 1, bobY - 7 + 1, w, 14);

      ctx.fillStyle = COLORS.coin.gold;
      ctx.fillRect(c.x - w / 2, bobY - 7, w, 14);

      if (scaleX > 0.3) {
        ctx.fillStyle = COLORS.coin.shine;
        ctx.fillRect(c.x - w / 2 + 2, bobY - 5, 3, 3);
      }

      ctx.fillStyle = COLORS.coin.dark;
      ctx.fillRect(c.x - 1, bobY - 3, 2, 6);
    }
  }

  private drawPowerups(engine: GameEngine) {
    const ctx = this.ctx;
    for (const pu of engine.powerups) {
      if (pu.collected) continue;
      const bobY = pu.y + Math.sin(pu.bobOffset) * 3;
      const cx = pu.x + pu.width / 2;
      const cy = bobY + pu.height / 2;

      const glow = Math.sin(this.time * 3) * 0.2 + 0.3;
      ctx.fillStyle = `rgba(255,255,255,${glow * 0.2})`;
      ctx.beginPath();
      ctx.arc(cx, cy, pu.width * 0.7, 0, Math.PI * 2);
      ctx.fill();

      switch (pu.type) {
        case 'jetpack':
          ctx.fillStyle = COLORS.jetpack.dark;
          ctx.fillRect(cx - 6, cy - 8, 12, 16);
          ctx.fillStyle = COLORS.jetpack.body;
          ctx.fillRect(cx - 5, cy - 8, 10, 16);
          ctx.fillStyle = COLORS.jetpack.flame;
          ctx.fillRect(cx - 3, cy + 8, 6, 5);
          break;
        case 'propeller':
          ctx.fillStyle = COLORS.propeller.dark;
          ctx.fillRect(cx - 1, cy - 6, 2, 12);
          ctx.fillStyle = COLORS.propeller.blade;
          ctx.fillRect(cx - 10, cy - 8, 20, 3);
          ctx.fillStyle = COLORS.propeller.dark;
          ctx.fillRect(cx - 10, cy - 8, 20, 1);
          break;
        case 'shield':
          ctx.fillStyle = COLORS.shield.glow;
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = COLORS.shield.body;
          ctx.beginPath();
          ctx.arc(cx, cy, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillRect(cx - 3, cy - 4, 2, 2);
          break;
        case 'spring_shoes':
          ctx.fillStyle = COLORS.springShoes.dark;
          ctx.fillRect(cx - 8, cy - 2, 6, 8);
          ctx.fillRect(cx + 2, cy - 2, 6, 8);
          ctx.fillStyle = COLORS.springShoes.body;
          ctx.fillRect(cx - 8, cy - 4, 6, 4);
          ctx.fillRect(cx + 2, cy - 4, 6, 4);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(cx - 7, cy - 3, 2, 2);
          ctx.fillRect(cx + 3, cy - 3, 2, 2);
          break;
      }
    }
  }

  private drawEnemyDetails(decoType: string, hw: number, hh: number, w: number, h: number, pal: EnemyPal) {
    const ctx = this.ctx;
    const t = this.time;

    if (decoType === 'iron') {
      ctx.fillStyle = 'rgba(125,211,192,0.2)';
      ctx.fillRect(-hw + 4, -hh + 4, 3, 3);
      ctx.fillRect(hw - 10, -hh + 5, 2, 2);
      ctx.fillRect(-hw + 6, hh - 10, 2, 2);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-2, -hh - 4, 4, 4);
      ctx.fillRect(-1, -hh - 6, 2, 2);
    } else if (decoType === 'magma') {
      ctx.fillStyle = `rgba(255,144,32,${0.4 + Math.sin(t * 4) * 0.2})`;
      ctx.fillRect(-hw + 3, -hh + 4, w - 6, 1);
      ctx.fillRect(-hw + 4, hh - 8, w - 8, 1);
      ctx.fillRect(-2, -hh + 4, 1, h - 8);
      ctx.fillStyle = `rgba(255,200,50,${0.5 + Math.sin(t * 6) * 0.3})`;
      ctx.fillRect(-1, -hh - 3, 2, 3);
    } else if (decoType === 'rock') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw + 3, -hh + 3, 4, 3);
      ctx.fillRect(hw - 9, -hh + 4, 3, 2);
      ctx.fillRect(-hw + 5, hh - 10, 3, 2);
      ctx.fillStyle = 'rgba(80,120,50,0.3)';
      ctx.fillRect(-hw + 3, -hh + 3, 2, 1);
      ctx.fillRect(hw - 8, hh - 9, 3, 1);
    } else if (decoType === 'crust') {
      ctx.fillStyle = 'rgba(120,90,50,0.3)';
      ctx.fillRect(-hw + 4, -hh + 4, 2, 2);
      ctx.fillRect(hw - 8, hh - 9, 2, 2);
      ctx.fillRect(-hw + 6, hh - 10, 2, 1);
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-1, -hh - 3, 2, 3);
    } else if (decoType === 'troposphere') {
      ctx.fillStyle = 'rgba(180,220,255,0.25)';
      ctx.fillRect(-hw + 2, -hh + 2, w - 4, 1);
      ctx.fillRect(-hw + 3, hh - 6, w - 6, 1);
      ctx.fillStyle = `rgba(160,220,255,${0.4 + Math.sin(t * 5) * 0.3})`;
      ctx.fillRect(-1, -hh - 4, 2, 2);
      ctx.fillRect(0, -hh - 2, 1, 2);
    } else if (decoType === 'stratosphere') {
      ctx.fillStyle = `rgba(168,136,224,${0.2 + Math.sin(t * 3) * 0.1})`;
      ctx.fillRect(-hw + 3, -hh + 3, w - 6, 1);
      ctx.fillRect(-hw + 2, hh - 7, w - 4, 1);
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-4, -hh - 3, 2, 3);
      ctx.fillRect(2, -hh - 3, 2, 3);
    } else if (decoType === 'mesosphere') {
      ctx.fillStyle = `rgba(80,208,240,${0.3 + Math.sin(t * 6) * 0.2})`;
      ctx.fillRect(-hw + 3, -hh + 3, 2, 2);
      ctx.fillRect(hw - 7, hh - 8, 2, 2);
      ctx.fillRect(-hw + 4, hh - 9, 2, 1);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 5, 2, 5);
      const sparkPulse = Math.sin(t * 10) > 0.5 ? 1 : 0;
      if (sparkPulse) {
        ctx.fillRect(-3, -hh - 6, 6, 1);
        ctx.fillRect(-1, -hh - 7, 2, 1);
      }
    } else if (decoType === 'exosphere') {
      ctx.fillStyle = 'rgba(150,200,240,0.25)';
      ctx.fillRect(-hw + 3, -hh + 3, 2, 2);
      ctx.fillRect(hw - 7, -hh + 4, 2, 1);
      ctx.fillRect(-hw + 5, hh - 9, 1, 2);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 4, 2, 4);
    } else if (decoType === 'orbit') {
      ctx.fillStyle = 'rgba(255,200,80,0.2)';
      ctx.fillRect(-hw + 3, -hh + 3, 3, 2);
      ctx.fillRect(hw - 8, -hh + 3, 3, 2);
      ctx.fillStyle = 'rgba(160,120,60,0.3)';
      ctx.fillRect(-hw + 4, hh - 9, 2, 1);
      ctx.fillRect(hw - 7, hh - 8, 2, 1);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 4, 2, 4);
      ctx.fillRect(-2, -hh - 6, 4, 2);
    } else if (decoType === 'interstellar') {
      ctx.fillStyle = `rgba(176,128,224,${0.3 + Math.sin(t * 3) * 0.15})`;
      ctx.fillRect(-hw + 3, -hh + 3, 2, 2);
      ctx.fillRect(hw - 7, hh - 9, 2, 2);
      ctx.fillRect(-hw + 5, hh - 7, 1, 1);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 5, 2, 5);
      ctx.fillRect(-2, -hh - 3, 4, 1);
    } else if (decoType === 'milkyWay') {
      const twinkle = Math.sin(t * 4) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(160,200,255,${0.3 * twinkle})`;
      ctx.fillRect(-hw + 4, -hh + 3, 1, 1);
      ctx.fillRect(hw - 6, -hh + 5, 1, 1);
      ctx.fillRect(-hw + 5, hh - 9, 1, 1);
      ctx.fillRect(hw - 8, hh - 7, 1, 1);
      ctx.fillStyle = `rgba(100,160,255,${0.15 + Math.sin(t * 2) * 0.1})`;
      ctx.fillRect(-3, -hh + 2, 6, 2);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 5, 2, 5);
      ctx.fillRect(-2, -hh - 6, 4, 1);
    } else if (decoType === 'observableUniverse') {
      ctx.fillStyle = 'rgba(80,120,180,0.2)';
      ctx.fillRect(-hw + 3, -hh + 4, w - 6, 1);
      ctx.fillRect(-2, -hh + 4, 1, h - 8);
      ctx.fillStyle = `rgba(120,180,255,${0.2 + Math.sin(t * 2) * 0.1})`;
      ctx.fillRect(-hw + 4, -hh + 5, 1, 1);
      ctx.fillRect(hw - 6, hh - 8, 1, 1);
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-1, -hh - 4, 2, 4);
    } else if (decoType === 'multiverse') {
      ctx.fillStyle = `rgba(64,224,192,${0.3 + Math.sin(t * 5) * 0.2})`;
      ctx.fillRect(-hw + 3, -hh + 3, w - 6, 1);
      ctx.fillRect(-hw + 2, hh - 8, w - 4, 1);
      ctx.fillStyle = pal.accent;
      const sparkPos = Math.sin(t * 8) * 4;
      ctx.fillRect(sparkPos - 1, -hh - 4, 2, 2);
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-3, -hh - 3, 2, 3);
      ctx.fillRect(1, -hh - 3, 2, 3);
    } else if (decoType === 'hyperspace') {
      ctx.fillStyle = 'rgba(224,208,96,0.25)';
      ctx.fillRect(-hw + 3, -hh + 3, 3, 1);
      ctx.fillRect(-hw + 4, -hh + 4, 1, 1);
      ctx.fillRect(hw - 8, -hh + 3, 3, 1);
      ctx.fillRect(hw - 7, -hh + 4, 1, 1);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 4, 2, 4);
      ctx.fillRect(-2, -hh - 5, 4, 1);
    } else if (decoType === 'empyrean') {
      const haloPulse = Math.sin(t * 3) * 0.15 + 0.85;
      ctx.strokeStyle = `rgba(255,208,128,${0.3 * haloPulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -hh - 2, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,220,120,${0.25 + Math.sin(t * 4) * 0.15})`;
      ctx.fillRect(-hw + 4, -hh + 3, 1, 1);
      ctx.fillRect(hw - 6, hh - 8, 1, 1);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 4, 2, 4);
    } else if (decoType === 'apeiron') {
      ctx.fillStyle = `rgba(104,64,160,${0.3 + Math.sin(t * 2) * 0.15})`;
      ctx.fillRect(-hw + 3, -hh + 3, 2, 2);
      ctx.fillRect(hw - 7, hh - 9, 2, 2);
      ctx.fillRect(-hw + 5, hh - 7, 1, 1);
      ctx.fillStyle = `rgba(40,8,80,${0.3})`;
      ctx.fillRect(-hw + 2, hh - 6, w - 4, 1);
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-1, -hh - 5, 2, 5);
      ctx.fillRect(-2, -hh - 3, 4, 1);
    } else if (decoType === 'motorInmovil') {
      const lightPulse = Math.sin(t * 2) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255,255,240,${0.2 * lightPulse})`;
      ctx.fillRect(-hw + 3, -hh + 3, w - 6, 1);
      ctx.fillRect(-hw + 2, hh - 7, w - 4, 1);
      ctx.strokeStyle = `rgba(255,252,232,${0.25 * lightPulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -hh - 3, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,240,${0.3 * lightPulse})`;
      ctx.fillRect(-1, -hh - 4, 2, 2);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-1, -hh - 5, 2, 5);
    }
  }

  private drawEnemyWings(decoType: string, hw: number, pal: EnemyPal) {
    const ctx = this.ctx;
    const wingFlap = Math.sin(this.time * 15) * 0.5 + 0.5;

    if (decoType === 'iron' || decoType === 'rock' || decoType === 'crust') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 8, -2, 8, 4 + wingFlap * 4);
      ctx.fillRect(hw, -2, 8, 4 + wingFlap * 4);
      ctx.fillStyle = pal.body;
      ctx.fillRect(-hw - 7, -1, 6, 3 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 6, 3 + wingFlap * 3);
    } else if (decoType === 'magma') {
      const flicker = Math.sin(this.time * 20) * 0.3;
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 8, -2, 8, 3 + wingFlap * 4 + flicker);
      ctx.fillRect(hw, -2, 8, 3 + wingFlap * 4 + flicker);
      ctx.fillStyle = `rgba(255,144,32,${0.5 + wingFlap * 0.3})`;
      ctx.fillRect(-hw - 7, -1, 6, 2 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 6, 2 + wingFlap * 3);
    } else if (decoType === 'troposphere' || decoType === 'stratosphere' || decoType === 'mesosphere' || decoType === 'exosphere') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 7, -1, 7, 3 + wingFlap * 3);
      ctx.fillRect(hw, -1, 7, 3 + wingFlap * 3);
      ctx.fillStyle = `rgba(180,220,255,${0.3 + wingFlap * 0.2})`;
      ctx.fillRect(-hw - 6, 0, 5, 2 + wingFlap * 2);
      ctx.fillRect(hw + 1, 0, 5, 2 + wingFlap * 2);
    } else if (decoType === 'orbit') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 6, -2, 6, 5 + wingFlap * 3);
      ctx.fillRect(hw, -2, 6, 5 + wingFlap * 3);
      ctx.fillStyle = `rgba(255,200,80,${0.2 + wingFlap * 0.2})`;
      ctx.fillRect(-hw - 5, -1, 4, 3 + wingFlap * 2);
      ctx.fillRect(hw + 1, -1, 4, 3 + wingFlap * 2);
    } else if (decoType === 'interstellar' || decoType === 'milkyWay' || decoType === 'observableUniverse') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 8, -2, 8, 3 + wingFlap * 4);
      ctx.fillRect(hw, -2, 8, 3 + wingFlap * 4);
      ctx.fillStyle = pal.accent;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(-hw - 7, -1, 6, 2 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 6, 2 + wingFlap * 3);
      ctx.globalAlpha = 1;
    } else if (decoType === 'multiverse') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 7, -2, 7, 4 + wingFlap * 4);
      ctx.fillRect(hw, -2, 7, 4 + wingFlap * 4);
      ctx.fillStyle = pal.accent;
      ctx.globalAlpha = 0.5 + wingFlap * 0.3;
      ctx.fillRect(-hw - 6, -1, 5, 2 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 5, 2 + wingFlap * 3);
      ctx.globalAlpha = 1;
    } else if (decoType === 'hyperspace') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 6, -2, 6, 4 + wingFlap * 4);
      ctx.fillRect(hw, -2, 6, 4 + wingFlap * 4);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-hw - 5, -1, 4, 3 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 4, 3 + wingFlap * 3);
    } else if (decoType === 'empyrean' || decoType === 'motorInmovil') {
      const divinePulse = Math.sin(this.time * 4) * 0.15 + 0.85;
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 8, -2, 8, 4 + wingFlap * 4);
      ctx.fillRect(hw, -2, 8, 4 + wingFlap * 4);
      ctx.fillStyle = `rgba(255,250,200,${0.3 * divinePulse})`;
      ctx.fillRect(-hw - 7, -1, 6, 3 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 6, 3 + wingFlap * 3);
    } else if (decoType === 'apeiron') {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 7, -2, 7, 3 + wingFlap * 4);
      ctx.fillRect(hw, -2, 7, 3 + wingFlap * 4);
      ctx.fillStyle = `rgba(104,64,160,${0.3 + wingFlap * 0.2})`;
      ctx.fillRect(-hw - 6, -1, 5, 2 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 5, 2 + wingFlap * 3);
    } else {
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw - 8, -2, 8, 4 + wingFlap * 4);
      ctx.fillRect(hw, -2, 8, 4 + wingFlap * 4);
      ctx.fillStyle = pal.body;
      ctx.fillRect(-hw - 7, -1, 6, 3 + wingFlap * 3);
      ctx.fillRect(hw + 1, -1, 6, 3 + wingFlap * 3);
    }
  }

  private drawEnemies(engine: GameEngine) {
    const ctx = this.ctx;
    const decoType = this.engineRef?.currentZone?.decorationType ?? 'iron';
    const pal = ENEMY_PALETTES[decoType] ?? ENEMY_PALETTES.iron;

    for (const e of engine.enemies) {
      if (!e.alive && e.deathTimer > 0.3) continue;
      const cx = e.x + e.width / 2;
      const cy = e.y + e.height / 2;
      const w = e.width;
      const h = e.height;
      const hw = w / 2;
      const hh = h / 2;

      ctx.save();
      ctx.translate(cx, cy);

      if (!e.alive) {
        ctx.globalAlpha = 1 - e.deathTimer * 3;
        ctx.scale(1 + e.deathTimer * 2, 1 + e.deathTimer * 2);
      }

      const float = e.type === 'flyer' ? Math.sin(e.wobble) * 2 : 0;
      ctx.translate(0, float);

      // Body shadow
      ctx.fillStyle = pal.dark;
      ctx.fillRect(-hw + 2, -hh + 3, w - 4, h - 4);

      // Body
      ctx.fillStyle = pal.body;
      ctx.fillRect(-hw, -hh, w, h - 2);

      // Top highlight
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(-hw + 2, -hh + 1, w - 4, 3);

      // Zone-specific decorative details
      this.drawEnemyDetails(decoType, hw, hh, w, h, pal);

      // Eyes
      ctx.fillStyle = pal.eye;
      ctx.fillRect(-hw + 6, -hh + 6, 8, 7);
      ctx.fillRect(hw - 14, -hh + 6, 8, 7);

      // Pupils
      ctx.fillStyle = pal.pupil;
      const lookDir = Math.sin(this.time * 2) * 2;
      ctx.fillRect(-hw + 8 + lookDir, -hh + 8, 4, 4);
      ctx.fillRect(hw - 12 + lookDir, -hh + 8, 4, 4);

      // Mouth/teeth
      ctx.fillStyle = pal.mouth;
      ctx.fillRect(-hw + 6, hh - 8, 4, 4);
      ctx.fillRect(-hw + 12, hh - 8, 4, 4);
      ctx.fillRect(hw - 10, hh - 8, 4, 4);
      ctx.fillRect(hw - 16, hh - 8, 4, 4);

      // Wings for flyers
      if (e.type === 'flyer') {
        this.drawEnemyWings(decoType, hw, pal);
      }

      ctx.restore();
    }
  }

  private drawParticles(engine: GameEngine) {
    const ctx = this.ctx;

    // Batch by shape+color to reduce fillStyle/globalAlpha changes
    type BatchKey = string;
    const batches = new Map<BatchKey, Particle[]>();

    for (const p of engine.particles) {
      const alpha = p.life / p.maxLife;
      const key = `${p.shape}|${p.color}|${alpha.toFixed(2)}`;
      let batch = batches.get(key);
      if (!batch) {
        batch = [];
        batches.set(key, batch);
      }
      batch.push(p);
    }

    for (const [key, particles] of batches) {
      const [shape, color, alphaStr] = key.split('|');
      ctx.fillStyle = color;
      ctx.globalAlpha = parseFloat(alphaStr);

      switch (shape) {
        case 'circle':
          for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        case 'square':
          for (const p of particles) {
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          }
          break;
        case 'star':
          for (const p of particles) {
            this.drawStar(p.x, p.y, p.size, 5);
          }
          break;
        case 'spark':
          for (const p of particles) {
            ctx.fillRect(p.x - p.size / 2, p.y - 0.5, p.size, 1);
            ctx.fillRect(p.x - 0.5, p.y - p.size / 2, 1, p.size);
          }
          break;
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawStar(cx: number, cy: number, r: number, spikes: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.4;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}
