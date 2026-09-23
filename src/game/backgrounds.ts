import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import type { GameEngine } from './engine';

type Ctx = CanvasRenderingContext2D;

function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function wrap(v: number, range: number): number {
  return ((v % range) + range) % range;
}

function px(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, Math.max(1, w | 0), Math.max(1, h | 0));
}

// ============================================================
// ZONE BACKGROUND FUNCTIONS — entirely redesigned
// ============================================================

// IRON ZONE: Geometric clockwork forge with rotating gears
export function drawIronBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: large rotating gears
  const p1 = parallax * 0.06;
  for (let i = 0; i < 4; i++) {
    const seed = i * 173.3;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 100) - p1, GAME_WIDTH + 100) - 50;
    const cy = hash(seed + 1) * GAME_HEIGHT * 0.7 + GAME_HEIGHT * 0.15;
    const r = 20 + hash(seed + 2) * 25;
    const rot = time * (0.3 + hash(seed + 3) * 0.4) * (i % 2 === 0 ? 1 : -1);
    const teeth = 10 + (hash(seed + 4) * 6 | 0);
    const shade = i % 2 === 0 ? '#3a3038' : '#2a2530';

    // Gear body
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Gear teeth
    for (let t = 0; t < teeth; t++) {
      const ang = rot + (t / teeth) * Math.PI * 2;
      const tx = cx + Math.cos(ang) * r;
      const ty = cy + Math.sin(ang) * r;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(ang);
      ctx.fillStyle = shade;
      ctx.fillRect(-3, -4, 6, 8);
      ctx.restore();
    }

    // Inner ring
    ctx.fillStyle = i % 2 === 0 ? '#4a3848' : '#3a3040';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Center hole
    ctx.fillStyle = '#1a1218';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Spokes
    for (let s = 0; s < 4; s++) {
      const ang = rot + (s / 4) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.fillStyle = shade;
      ctx.fillRect(-2, -r * 0.5, 4, r);
      ctx.restore();
    }

    // Ember glow at center
    const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.3);
    grad.addColorStop(0, `rgba(255,140,60,${0.2 * pulse})`);
    grad.addColorStop(1, 'rgba(255,140,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  // Mid layer: mechanical pipes and rivets
  const p2 = parallax * 0.18;
  for (let i = 0; i < 8; i++) {
    const seed = i * 89.3 + 20;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p2, GAME_WIDTH + 60) - 30;
    const y = hash(seed + 1) * GAME_HEIGHT;
    const w = 6 + hash(seed + 2) * 10;
    const isVertical = hash(seed + 3) > 0.5;

    if (isVertical) {
      px(ctx, x, y, w, 40 + hash(seed + 4) * 30, '#2a2028');
      px(ctx, x + 1, y, w - 2, 40 + hash(seed + 4) * 30, '#3a3038');
      px(ctx, x, y, 2, 40 + hash(seed + 4) * 30, '#4a4048');
    } else {
      const h2 = 6 + hash(seed + 2) * 8;
      px(ctx, x, y, 50 + hash(seed + 4) * 30, h2, '#2a2028');
      px(ctx, x, y + 1, 50 + hash(seed + 4) * 30, h2 - 2, '#3a3038');
      px(ctx, x, y, 50 + hash(seed + 4) * 30, 2, '#4a4048');
    }
    // Rivets
    for (let r = 0; r < 4; r++) {
      px(ctx, x + 2 + r * 6, y + 2, 2, 2, '#5a5058');
      px(ctx, x + 2 + r * 6, y + 2, 1, 1, '#7a7080');
    }
  }

  // Foreground: anvil silhouettes
  const p3 = parallax * 0.35;
  for (let i = 0; i < 5; i++) {
    const seed = i * 211 + 5;
    const x = wrap(hash(seed) * (GAME_WIDTH + 80) - p3, GAME_WIDTH + 80) - 40;
    const y = GAME_HEIGHT - 18 - hash(seed + 1) * 20;
    const w = 30 + hash(seed + 2) * 25;

    // Anvil base
    px(ctx, x + w * 0.3, y + 8, w * 0.4, 10, '#1a1218');
    // Anvil body
    px(ctx, x, y, w, 8, '#2a2028');
    px(ctx, x, y, w, 2, '#3a3038');
    // Horn
    px(ctx, x + w - 6, y - 2, 8, 4, '#2a2028');
    px(ctx, x + w - 6, y - 2, 8, 1, '#3a3038');
    // Glow from hot metal
    if (hash(seed + 4) > 0.5) {
      const pulse = Math.sin(time * 3 + i) * 0.3 + 0.7;
      px(ctx, x + 6, y + 2, w - 12, 3, `rgba(255,100,40,${0.3 * pulse})`);
      px(ctx, x + 8, y + 3, w - 16, 1, `rgba(255,180,60,${0.4 * pulse})`);
    }
  }

  // Sparks
  for (let i = 0; i < 10; i++) {
    const seed = i * 67.7 + 12;
    const baseX = hash(seed) * GAME_WIDTH;
    const baseY = GAME_HEIGHT * 0.5 + hash(seed + 1) * GAME_HEIGHT * 0.4;
    const life = (time * 1.5 + i * 0.37) % 1;
    const sx = baseX + Math.sin(time * 3 + i * 2) * 30;
    const sy = baseY - life * 60;
    const flicker = Math.sin(time * 10 + i * 3) * 0.4 + 0.6;
    const alpha = (1 - life) * 0.5 * flicker;

    px(ctx, sx, sy, 2, 2, `rgba(255,180,60,${alpha})`);
    px(ctx, sx, sy, 1, 1, `rgba(255,240,120,${alpha * 0.8})`);
    // Spark trail
    px(ctx, sx, sy + 3, 1, 3, `rgba(255,140,40,${alpha * 0.3})`);
  }

  // Steam puffs
  const p5 = parallax * 0.3;
  for (let i = 0; i < 6; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT - time * 20, GAME_HEIGHT);
    const size = 4 + Math.sin(time * 0.5 + i) * 2;
    const alpha = 0.06 + Math.sin(time + i) * 0.02;

    px(ctx, x, y, size, size, `rgba(180,160,170,${alpha})`);
    px(ctx, x + 2, y - 2, size + 2, size + 2, `rgba(160,140,150,${alpha * 0.6})`);
  }
}

// MAGMA ZONE: Infernal underworld with bone graveyard and ember rain
export function drawMagmaBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: giant ribcage bones arching across the sky
  const p1 = parallax * 0.05;
  for (let i = 0; i < 5; i++) {
    const seed = i * 157.3;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 120) - p1, GAME_WIDTH + 120) - 60;
    const baseY = GAME_HEIGHT - 30;
    const archH = 60 + hash(seed + 1) * 50;
    const archW = 50 + hash(seed + 2) * 40;

    // Rib arch (curved bone)
    const steps = 16;
    for (let s = 0; s <= steps; s++) {
      const t2 = s / steps;
      const ax = cx + (t2 - 0.5) * archW;
      const ay = baseY - Math.sin(t2 * Math.PI) * archH;
      px(ctx, ax, ay, 5, 5, '#4a3020');
      px(ctx, ax + 1, ay + 1, 3, 3, '#5a4030');
      px(ctx, ax, ay, 2, 2, '#6a5038');
    }
    // Spine connector
    px(ctx, cx - archW * 0.45, baseY - 4, archW * 0.9, 6, '#3a2818');
    px(ctx, cx - archW * 0.45, baseY - 4, archW * 0.9, 2, '#4a3828');
  }

  // Mid layer: skull formations
  const p2 = parallax * 0.15;
  for (let i = 0; i < 6; i++) {
    const seed = i * 113 + 22;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p2, GAME_WIDTH + 60) - 30;
    const y = GAME_HEIGHT - 20 - hash(seed + 1) * 40;
    const sz = 10 + hash(seed + 2) * 8;

    // Skull dome
    px(ctx, x, y - sz, sz * 2, sz, '#5a4838');
    px(ctx, x + 2, y - sz, sz * 2 - 4, sz - 2, '#6a5848');
    px(ctx, x, y - sz + 3, sz * 2, sz - 3, '#4a3828');
    // Eye sockets (glowing)
    const pulse = Math.sin(time * 1.5 + i * 1.3) * 0.3 + 0.7;
    px(ctx, x + sz * 0.3, y - sz * 0.5, 4, 4, '#1a0804');
    px(ctx, x + sz * 0.3 + 1, y - sz * 0.5 + 1, 2, 2, `rgba(255,80,0,${0.6 * pulse})`);
    px(ctx, x + sz * 1.2, y - sz * 0.5, 4, 4, '#1a0804');
    px(ctx, x + sz * 1.2 + 1, y - sz * 0.5 + 1, 2, 2, `rgba(255,80,0,${0.6 * pulse})`);
    // Jaw
    px(ctx, x + 3, y, sz * 2 - 6, 4, '#3a2818');
    // Teeth
    for (let t = 0; t < 4; t++) {
      px(ctx, x + 4 + t * (sz * 2 - 8) / 4, y, 2, 3, '#4a3828');
    }
  }

  // Ground: cracked obsidian floor with lava seeping
  const p3 = parallax * 0.3;
  for (let i = 0; i < 5; i++) {
    const seed = i * 211 + 5;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p3, GAME_WIDTH + 60) - 30;
    const y = GAME_HEIGHT - 10;
    const w = 40 + hash(seed + 2) * 30;

    px(ctx, x, y, w, 10, '#1a0a04');
    px(ctx, x, y, w, 2, '#2a1408');
    // Lava crack
    const crackPulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
    px(ctx, x + 4, y + 3, w - 8, 2, `rgba(255,80,0,${0.4 * crackPulse})`);
    px(ctx, x + 6, y + 4, w - 12, 1, `rgba(255,160,40,${0.5 * crackPulse})`);
  }

  // Ember rain (falling diagonally)
  for (let i = 0; i < 16; i++) {
    const seed = i * 97.7 + 25;
    const baseX = hash(seed) * GAME_WIDTH;
    const life = (time * 0.8 + i * 0.16) % 1;
    const ex = baseX + life * 20;
    const ey = life * GAME_HEIGHT;
    const flicker = Math.sin(time * 12 + i * 2) * 0.4 + 0.6;
    const alpha = (1 - life * 0.7) * 0.4 * flicker;

    px(ctx, ex, ey, 2, 2, `rgba(255,100,0,${alpha})`);
    px(ctx, ex, ey, 1, 1, `rgba(255,200,80,${alpha * 0.7})`);
    px(ctx, ex - 1, ey - 4, 1, 4, `rgba(255,60,0,${alpha * 0.3})`);
  }

  // Ground fire glow
  for (let i = 0; i < 3; i++) {
    const seed = i * 421 + 55;
    const x = hash(seed) * GAME_WIDTH;
    const pulse = Math.sin(time * 0.8 + i * 1.5) * 0.2 + 0.8;
    const grad = ctx.createRadialGradient(x, GAME_HEIGHT - 5, 0, x, GAME_HEIGHT - 5, 80);
    grad.addColorStop(0, `rgba(255,80,0,${0.08 * pulse})`);
    grad.addColorStop(1, 'rgba(255,80,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - 80, GAME_HEIGHT - 85, 160, 80);
  }

  // Smoke plumes rising
  const p6 = parallax * 0.12;
  for (let i = 0; i < 5; i++) {
    const seed = i * 251 + 31;
    const x = wrap(hash(seed) * GAME_WIDTH - p6, GAME_WIDTH);
    const y = wrap(GAME_HEIGHT - time * 25 - i * 50, GAME_HEIGHT);
    const drift = Math.sin(time * 0.3 + i) * 10;
    const size = 8 + Math.sin(time * 0.5 + i) * 3;
    const alpha = 0.05;

    px(ctx, x + drift, y, size, size, `rgba(60,40,30,${alpha})`);
    px(ctx, x + drift + 3, y - 4, size + 4, size + 4, `rgba(40,28,20,${alpha * 0.7})`);
  }
}

// ROCK ZONE: Ancient mining tunnels with minecart rails and gem veins
export function drawRockBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: wooden support beams with lanterns
  const p1 = parallax * 0.06;
  for (let i = 0; i < 5; i++) {
    const seed = i * 173.3;
    const x = wrap(hash(seed) * (GAME_WIDTH + 100) - p1, GAME_WIDTH + 100) - 50;
    const beamH = GAME_HEIGHT * 0.6 + hash(seed + 1) * GAME_HEIGHT * 0.3;

    // Vertical beam
    px(ctx, x, GAME_HEIGHT - beamH, 8, beamH, '#2a1a0a');
    px(ctx, x + 1, GAME_HEIGHT - beamH, 2, beamH, '#3a2818');
    px(ctx, x + 6, GAME_HEIGHT - beamH, 2, beamH, '#1a0e06');
    // Crossbeam
    px(ctx, x - 8, GAME_HEIGHT - beamH, 24, 5, '#2a1a0a');
    px(ctx, x - 8, GAME_HEIGHT - beamH, 24, 1, '#3a2818');
    // Plank grain
    for (let g = 0; g < beamH; g += 12) {
      px(ctx, x + 2, GAME_HEIGHT - beamH + g, 4, 1, '#1a0e06');
    }
    // Hanging lantern
    const lx = x + 4;
    const ly = GAME_HEIGHT - beamH + 8;
    const pulse = Math.sin(time * 1.5 + i * 1.2) * 0.3 + 0.7;
    // Lantern body
    px(ctx, lx - 2, ly, 5, 5, '#1a1008');
    px(ctx, lx - 1, ly + 1, 3, 3, `rgba(255,180,60,${0.5 * pulse})`);
    px(ctx, lx, ly + 1, 1, 1, `rgba(255,240,120,${0.7 * pulse})`);
    // Glow
    const grad = ctx.createRadialGradient(lx, ly + 2, 0, lx, ly + 2, 30);
    grad.addColorStop(0, `rgba(255,180,60,${0.06 * pulse})`);
    grad.addColorStop(1, 'rgba(255,180,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(lx - 30, ly - 28, 60, 60);
  }

  // Mid layer: minecart rails
  const p2 = parallax * 0.15;
  for (let i = 0; i < 3; i++) {
    const seed = i * 89.3 + 20;
    const y = GAME_HEIGHT * 0.4 + i * GAME_HEIGHT * 0.2 + hash(seed) * 20;
    const offset = wrap(hash(seed + 1) * 40 - p2, 40);

    // Rails (two parallel lines)
    for (let x = -40; x < GAME_WIDTH + 40; x += 12) {
      const rx = wrap(x + offset, GAME_WIDTH + 40) - 20;
      // Rail ties (wooden)
      px(ctx, rx, y + 3, 10, 3, '#2a1a0a');
      px(ctx, rx, y + 3, 10, 1, '#3a2818');
    }
    // Metal rails
    px(ctx, 0, y, GAME_WIDTH, 1, '#5a5048');
    px(ctx, 0, y + 6, GAME_WIDTH, 1, '#5a5048');
    px(ctx, 0, y, GAME_WIDTH, 1, '#7a7080');
  }

  // Gem veins in rock walls
  const p3 = parallax * 0.22;
  for (let i = 0; i < 14; i++) {
    const seed = i * 113 + 33;
    const x = wrap(hash(seed) * (GAME_WIDTH + 40) - p3, GAME_WIDTH + 40) - 20;
    const y = hash(seed + 1) * GAME_HEIGHT;
    const pulse = Math.sin(time * 1 + i * 0.8) * 0.3 + 0.7;
    const gemType = i % 4;
    const colors = [
      ['rgba(80,200,200,', 'rgba(120,255,240,'],
      ['rgba(200,80,120,', 'rgba(255,120,160,'],
      ['rgba(120,200,80,', 'rgba(180,255,120,'],
      ['rgba(200,160,60,', 'rgba(255,220,100,'],
    ];
    const [gc, gl] = colors[gemType];

    // Gem cluster
    px(ctx, x, y, 4, 4, `${gc}${0.3 * pulse})`);
    px(ctx, x + 1, y + 1, 2, 2, `${gc}${0.4 * pulse})`);
    px(ctx, x + 1, y + 1, 1, 1, `${gl}${0.5 * pulse})`);
    // Small gems
    px(ctx, x + 5, y + 2, 2, 2, `${gc}${0.25 * pulse})`);
    px(ctx, x - 2, y + 3, 2, 2, `${gc}${0.25 * pulse})`);
  }

  // Minecart (animated, moving along rail)
  const cartCycle = (time * 0.15) % 1;
  const cartX = cartCycle * (GAME_WIDTH + 60) - 30;
  const cartY = GAME_HEIGHT * 0.4 - 8;
  // Cart body
  px(ctx, cartX, cartY, 20, 10, '#3a2818');
  px(ctx, cartX, cartY, 20, 2, '#4a3828');
  px(ctx, cartX + 2, cartY - 3, 16, 3, '#2a1a0a');
  // Ore in cart
  px(ctx, cartX + 4, cartY - 2, 4, 2, `rgba(200,160,60,${0.4})`);
  px(ctx, cartX + 10, cartY - 2, 3, 2, `rgba(80,200,200,${0.3})`);
  // Wheels
  px(ctx, cartX + 2, cartY + 10, 4, 4, '#1a1008');
  px(ctx, cartX + 14, cartY + 10, 4, 4, '#1a1008');
  px(ctx, cartX + 3, cartY + 11, 2, 2, '#3a2818');

  // Foreground: rock rubble
  const p4 = parallax * 0.4;
  for (let i = 0; i < 8; i++) {
    const seed = i * 383 + 41;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p4, GAME_WIDTH + 60) - 30;
    const y = GAME_HEIGHT - 8 - hash(seed + 1) * 15;
    const w = 8 + hash(seed + 2) * 14;
    px(ctx, x, y, w, 8, '#2a1a08');
    px(ctx, x, y, w, 2, '#3a2818');
    px(ctx, x + 2, y - 2, w - 4, 2, '#332014');
  }

  // Dust motes
  const p5 = parallax * 0.35;
  for (let i = 0; i < 10; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 8, GAME_HEIGHT);
    const sway = Math.sin(time * 1.5 + i * 0.6) * 4;
    px(ctx, x + sway, y, 1, 1, 'rgba(180,150,100,0.25)');
  }
}

// CRUST ZONE: Underground aquifer with waterfalls and coral formations
export function drawCrustBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: underground lake with ripples
  const p1 = parallax * 0.05;
  const lakeY = GAME_HEIGHT * 0.65;
  for (let x = 0; x < GAME_WIDTH; x += 3) {
    const wave = Math.sin(time * 0.8 + x * 0.03 + parallax * 0.01) * 2;
    const wave2 = Math.sin(time * 1.2 + x * 0.06) * 1;
    const ly = lakeY + wave + wave2;
    px(ctx, x, ly, 3, GAME_HEIGHT - ly, 'rgba(20,60,80,0.25)');
    px(ctx, x, ly, 3, 2, 'rgba(40,100,120,0.2)');
    px(ctx, x, ly, 3, 1, 'rgba(80,160,180,0.15)');
  }

  // Waterfalls cascading from above
  const p2 = parallax * 0.12;
  for (let i = 0; i < 4; i++) {
    const seed = i * 89.3 + 20;
    const x = wrap(hash(seed) * (GAME_WIDTH + 40) - p2, GAME_WIDTH + 40) - 20;
    const fallH = GAME_HEIGHT * 0.5 + hash(seed + 1) * GAME_HEIGHT * 0.2;
    const w = 8 + hash(seed + 2) * 6;

    // Water column
    for (let wy = 0; wy < fallH; wy += 3) {
      const flow = Math.sin(time * 3 + wy * 0.1 + i) * 2;
      px(ctx, x + flow, wy, w, 3, 'rgba(100,180,200,0.15)');
      px(ctx, x + flow + 1, wy, w - 2, 3, 'rgba(140,220,240,0.1)');
      px(ctx, x + flow + 2, wy, 1, 3, 'rgba(200,240,255,0.08)');
    }
    // Splash at bottom
    const splashPulse = Math.sin(time * 4 + i) * 0.3 + 0.7;
    const grad = ctx.createRadialGradient(x + w / 2, fallH, 0, x + w / 2, fallH, 15);
    grad.addColorStop(0, `rgba(180,220,240,${0.15 * splashPulse})`);
    grad.addColorStop(1, 'rgba(180,220,240,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - 10, fallH - 10, w + 20, 20);
    // Splash drops
    for (let d = 0; d < 4; d++) {
      const dx = x + w / 2 + (hash(seed + d) - 0.5) * 16;
      const dy = fallH + Math.sin(time * 5 + d + i) * 3;
      px(ctx, dx, dy, 1, 2, `rgba(200,240,255,${0.2 * splashPulse})`);
    }
  }

  // Bioluminescent coral formations
  const p3 = parallax * 0.2;
  for (let i = 0; i < 8; i++) {
    const seed = i * 211 + 13;
    const x = wrap(hash(seed) * (GAME_WIDTH - 30) + 15 - p3, GAME_WIDTH);
    const y = GAME_HEIGHT - 15 - hash(seed + 1) * 30;
    const pulse = Math.sin(time * 1.2 + i * 0.9) * 0.3 + 0.7;
    const coralColor = i % 3 === 0 ? '255,120,180' : i % 3 === 1 ? '120,255,200' : '200,160,80';

    // Coral branches (fan-like)
    for (let b = 0; b < 5; b++) {
      const bh = 6 + hash(seed + b) * 10;
      const bw = 2 + hash(seed + b + 5) * 2;
      const offset = (b - 2) * 3;
      px(ctx, x + offset, y - bh, bw, bh, `rgba(${coralColor},${0.2 * pulse})`);
      px(ctx, x + offset, y - bh, bw, 2, `rgba(${coralColor},${0.3 * pulse})`);
      // Tip glow
      px(ctx, x + offset, y - bh - 1, bw, 1, `rgba(${coralColor},${0.4 * pulse})`);
    }
    // Base
    px(ctx, x - 3, y, 8, 3, '#2a2a1a');
    // Glow halo
    const grad = ctx.createRadialGradient(x, y - 6, 0, x, y - 6, 18);
    grad.addColorStop(0, `rgba(${coralColor},${0.04 * pulse})`);
    grad.addColorStop(1, `rgba(${coralColor},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - 18, y - 24, 36, 30);
  }

  // Cave ceiling stalactites with dripping water
  const p4 = parallax * 0.18;
  for (let i = 0; i < 7; i++) {
    const seed = i * 67 + 17;
    const x = wrap(hash(seed) * (GAME_WIDTH + 30) - p4, GAME_WIDTH + 30) - 15;
    const h = 10 + hash(seed + 1) * 20;
    const w = 3 + hash(seed + 2) * 3;

    const steps = Math.floor(h / 2);
    for (let s = 0; s < steps; s++) {
      const sw = w * (1 - s / steps * 0.6);
      px(ctx, x + (w - sw) / 2, s * 2, sw, 2, '#3a3028');
      px(ctx, x + (w - sw) / 2, s * 2, 2, 1, '#4a4038');
    }
    // Drip
    const dripCycle = (time * 0.4 + i * 0.3) % 1;
    if (dripCycle < 0.85) {
      const dy = h + dripCycle * 30;
      px(ctx, x + (w / 2 | 0), dy, 1, 3, `rgba(120,200,220,${(0.8 - dripCycle) * 0.3})`);
    }
  }

  // Floating bubbles
  const p5 = parallax * 0.3;
  for (let i = 0; i < 12; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT - time * 18, GAME_HEIGHT);
    const sway = Math.sin(time * 1.2 + i * 0.5) * 5;
    const size = hash(seed + 2) > 0.6 ? 3 : 2;

    px(ctx, x + sway, y, size, size, 'rgba(150,220,240,0.2)');
    px(ctx, x + sway + 1, y, 1, 1, 'rgba(220,250,255,0.3)');
  }

  // Light shafts from above
  for (let i = 0; i < 3; i++) {
    const seed = i * 421 + 55;
    const x = hash(seed) * GAME_WIDTH;
    const pulse = Math.sin(time * 0.4 + i * 1.2) * 0.2 + 0.8;
    const grad = ctx.createLinearGradient(x, 0, x + 20, GAME_HEIGHT * 0.6);
    grad.addColorStop(0, `rgba(120,200,220,${0.04 * pulse})`);
    grad.addColorStop(1, 'rgba(120,200,220,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 25, GAME_HEIGHT * 0.6);
  }
}

// TROPOSPHERE ZONE: Stormy sky with lightning, wind streaks and rain
export function drawTroposphereBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: towering cumulonimbus clouds (dark storm clouds)
  const p1 = parallax * 0.05;
  for (let i = 0; i < 5; i++) {
    const seed = i * 173.3;
    const x = wrap(hash(seed) * (GAME_WIDTH + 120) - p1, GAME_WIDTH + 120) - 60;
    const y = 30 + hash(seed + 1) * GAME_HEIGHT * 0.5;
    const w = 60 + hash(seed + 2) * 50;

    // Cloud dark base
    px(ctx, x + 6, y + 10, w, 14, 'rgba(40,50,70,0.5)');
    px(ctx, x + 14, y + 6, w - 28, 18, 'rgba(50,60,80,0.55)');
    px(ctx, x + 24, y + 2, w - 48, 22, 'rgba(60,70,95,0.6)');
    // Cloud bumps
    px(ctx, x + 4, y + 8, 20, 10, 'rgba(55,65,85,0.5)');
    px(ctx, x + w - 24, y + 8, 20, 10, 'rgba(55,65,85,0.5)');
    px(ctx, x + 18, y, 24, 8, 'rgba(70,80,100,0.45)');
    // Highlights (top edge)
    px(ctx, x + 20, y + 2, w - 40, 2, 'rgba(100,110,140,0.3)');
    // Bottom flat shadow
    px(ctx, x + 8, y + 22, w - 16, 3, 'rgba(25,35,55,0.4)');
  }

  // Lightning flashes (occasional)
  const flashCycle = (time * 0.3) % 1;
  if (flashCycle < 0.08) {
    const flashSeed = Math.floor(time * 0.3) * 97.7;
    const lx = hash(flashSeed) * GAME_WIDTH;
    // Lightning bolt (jagged)
    let ly = 0;
    let cx = lx;
    for (let b = 0; b < 8; b++) {
      const nextX = cx + (hash(flashSeed + b) - 0.5) * 20;
      const nextY = ly + 20 + hash(flashSeed + b + 10) * 15;
      // Bolt line
      const steps = 6;
      for (let s = 0; s < steps; s++) {
        const t2 = s / steps;
        const bx = cx + (nextX - cx) * t2;
        const by = ly + (nextY - ly) * t2;
        px(ctx, bx, by, 2, 2, 'rgba(255,255,255,0.6)');
        px(ctx, bx, by, 1, 1, 'rgba(200,220,255,0.4)');
      }
      cx = nextX;
      ly = nextY;
    }
    // Flash glow
    const flashAlpha = (0.08 - flashCycle) / 0.08 * 0.08;
    ctx.fillStyle = `rgba(200,220,255,${flashAlpha})`;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  // Mid layer: wind streaks
  const p2 = parallax * 0.15;
  for (let i = 0; i < 10; i++) {
    const seed = i * 89.3 + 20;
    const y = hash(seed + 1) * GAME_HEIGHT;
    const offset = (time * 60 + hash(seed) * 100 + p2) % (GAME_WIDTH + 80);
    const len = 20 + hash(seed + 2) * 30;
    const x = offset - 40;

    px(ctx, x, y, len, 1, 'rgba(180,200,220,0.08)');
    px(ctx, x + 4, y, len - 8, 1, 'rgba(200,220,240,0.06)');
  }

  // Rain (diagonal streaks)
  const p3 = parallax * 0.3;
  for (let i = 0; i < 30; i++) {
    const seed = i * 67.7 + 12;
    const baseX = hash(seed) * GAME_WIDTH;
    const life = (time * 2 + i * 0.07) % 1;
    const rx = baseX + life * 15 - p3 * 0.01;
    const ry = life * (GAME_HEIGHT + 20) - 10;
    const alpha = 0.15 + hash(seed + 2) * 0.1;

    px(ctx, rx, ry, 1, 6, `rgba(150,180,200,${alpha})`);
    px(ctx, rx, ry, 1, 2, `rgba(200,220,240,${alpha * 0.5})`);
  }

  // Foreground: dark rain cloud wisps
  const p4 = parallax * 0.35;
  for (let i = 0; i < 4; i++) {
    const seed = i * 211 + 5;
    const x = wrap(hash(seed) * (GAME_WIDTH + 80) - p4, GAME_WIDTH + 80) - 40;
    const y = GAME_HEIGHT - 20 - hash(seed + 1) * 15;
    const w = 40 + hash(seed + 2) * 30;

    px(ctx, x, y, w, 12, 'rgba(30,40,60,0.3)');
    px(ctx, x + 6, y - 2, w - 12, 14, 'rgba(35,45,65,0.25)');
    px(ctx, x + 10, y, w - 20, 4, 'rgba(45,55,75,0.2)');
  }

  // Wind-blown leaves
  for (let i = 0; i < 8; i++) {
    const seed = i * 251 + 31;
    const life = (time * 0.4 + i * 0.15) % 1;
    const x = life * (GAME_WIDTH + 40) - 20;
    const y = hash(seed + 1) * GAME_HEIGHT + Math.sin(time * 2 + i * 1.5) * 15;
    const rot = time * 4 + i * 2;
    const sway = Math.sin(rot) * 2;

    px(ctx, x + sway, y, 3, 2, 'rgba(120,100,40,0.3)');
    px(ctx, x + sway + 1, y, 1, 1, 'rgba(160,140,60,0.2)');
  }
}

// STRATOSPHERE ZONE: Cosmic observatory with planets, comets and nebula
export function drawStratosphereBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Nebula clouds (colorful wisps)
  for (let i = 0; i < 4; i++) {
    const seed = i * 137.5;
    const x = wrap(hash(seed) * GAME_WIDTH - parallax * 0.03, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT;
    const w = 80 + hash(seed + 2) * 60;
    const pulse = Math.sin(time * 0.3 + i * 1.2) * 0.15 + 0.85;
    const color = i % 2 === 0 ? '100,60,180' : '60,100,200';

    const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
    grad.addColorStop(0, `rgba(${color},${0.04 * pulse})`);
    grad.addColorStop(0.5, `rgba(${color},${0.02 * pulse})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - w, y - w, w * 2, w * 2);
  }

  // Distant planets
  const p1 = parallax * 0.04;
  for (let i = 0; i < 3; i++) {
    const seed = i * 89.3 + 40;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p1, GAME_WIDTH + 60) - 30;
    const y = 40 + hash(seed + 1) * GAME_HEIGHT * 0.5;
    const r = 12 + hash(seed + 2) * 10;
    const planetColor = i === 0 ? '#5a3a7a' : i === 1 ? '#3a5a8a' : '#7a5a3a';

    // Planet body
    ctx.fillStyle = planetColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Shading (dark side)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(x + r * 0.3, y + r * 0.2, r, 0, Math.PI * 2);
    ctx.fill();

    // Surface detail (bands)
    ctx.fillStyle = i === 0 ? 'rgba(120,80,160,0.3)' : i === 1 ? 'rgba(80,120,180,0.3)' : 'rgba(160,120,60,0.3)';
    ctx.fillRect(x - r, y - 2, r * 2, 2);
    ctx.fillRect(x - r * 0.8, y + 4, r * 1.6, 1);

    // Atmosphere glow
    const grad = ctx.createRadialGradient(x, y, r, x, y, r + 6);
    grad.addColorStop(0, i === 0 ? 'rgba(150,100,200,0.08)' : i === 1 ? 'rgba(100,150,220,0.08)' : 'rgba(200,160,80,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - r - 6, y - r - 6, (r + 6) * 2, (r + 6) * 2);

    // Ring (for one planet)
    if (i === 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.3);
      ctx.strokeStyle = 'rgba(180,200,220,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.6, r * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Star field (twinkling, multiple sizes)
  const p2 = parallax * 0.06;
  for (let i = 0; i < 30; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 2.5 + i * 1.7) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.8 ? 2 : 1;

    px(ctx, x, y, size, size, `rgba(220,220,255,${0.2 + twinkle * 0.4})`);
    if (twinkle > 0.75 && size > 1) {
      px(ctx, x - 1, y, 3, 1, `rgba(255,255,255,${twinkle * 0.15})`);
      px(ctx, x, y - 1, 1, 3, `rgba(255,255,255,${twinkle * 0.15})`);
    }
  }

  // Comets with trails
  for (let i = 0; i < 3; i++) {
    const seed = i * 97 + 7;
    const cycle = (time * 0.08 + i * 0.33) % 1;
    if (cycle < 0.4) {
      const baseX = hash(seed) * GAME_WIDTH * 0.3;
      const baseY = hash(seed + 1) * GAME_HEIGHT * 0.4;
      const progress = cycle / 0.4;
      const cx = baseX + progress * 200;
      const cy = baseY + progress * 120;
      const trailLen = Math.max(8, 15 + (progress * 25 | 0));
      const alpha = Math.sin(progress * Math.PI) * 0.5;

      // Trail
      for (let t = 0; t < trailLen; t++) {
        const tx = cx - t * 3;
        const ty = cy - t * 1.5;
        const tAlpha = alpha * (1 - t / trailLen);
        px(ctx, tx, ty, 2, 2, `rgba(180,200,255,${tAlpha})`);
      }
      // Head
      px(ctx, cx, cy, 3, 3, `rgba(255,255,255,${alpha})`);
      px(ctx, cx, cy, 2, 2, `rgba(200,220,255,${alpha * 0.8})`);
      // Glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
      grad.addColorStop(0, `rgba(200,220,255,${alpha * 0.3})`);
      grad.addColorStop(1, 'rgba(200,220,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 8, cy - 8, 16, 16);
    }
  }

  // Orbiting satellites
  for (let i = 0; i < 2; i++) {
    const seed = i * 173 + 17;
    const angle = time * 0.15 + i * Math.PI;
    const orbitR = 50 + hash(seed) * 30;
    const ox = GAME_WIDTH * 0.5 + Math.cos(angle) * orbitR;
    const oy = GAME_HEIGHT * 0.3 + Math.sin(angle) * orbitR * 0.5;

    // Satellite body
    px(ctx, ox, oy, 4, 3, '#6a6a7a');
    px(ctx, ox, oy, 4, 1, '#8a8a9a');
    // Solar panels
    px(ctx, ox - 6, oy, 4, 3, '#3a5a8a');
    px(ctx, ox + 6, oy, 4, 3, '#3a5a8a');
    px(ctx, ox - 6, oy, 4, 1, '#5a8aba');
    px(ctx, ox + 6, oy, 4, 1, '#5a8aba');
    // Blinking light
    const blink = Math.sin(time * 4 + i * 2) > 0.7 ? 1 : 0;
    if (blink) {
      px(ctx, ox + 1, oy + 3, 1, 1, 'rgba(255,100,100,0.8)');
    }
  }

  // Cosmic dust
  const p5 = parallax * 0.12;
  for (let i = 0; i < 14; i++) {
    const seed = i * 211 + 13;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 2, GAME_HEIGHT);
    const sway = Math.sin(time * 1.5 + i * 0.6) * 6;
    const pulse = Math.sin(time * 2.5 + i * 1.3) * 0.3 + 0.7;
    const color = i % 3 === 0 ? '200,180,255' : i % 3 === 1 ? '180,200,255' : '255,200,220';

    px(ctx, x + sway, y, 2, 2, `rgba(${color},${0.2 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,255,255,${0.15 * pulse})`);
  }
}

// MESOSPHERE/THERMOSPHERE ZONE: Auroras, shooting stars and glowing ions
export function drawMesosphereBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Aurora ribbons (animated wavy bands)
  for (let band = 0; band < 3; band++) {
    const bandY = GAME_HEIGHT * (0.2 + band * 0.25);
    const bandColor = band === 0 ? '40,220,140' : band === 1 ? '60,180,255' : '140,80,255';
    const phase = time * 0.5 + band * 1.5;
    for (let x = 0; x < GAME_WIDTH; x += 2) {
      const wave = Math.sin(x * 0.015 + phase) * 15 + Math.sin(x * 0.04 + phase * 1.3) * 8;
      const wave2 = Math.sin(x * 0.025 + phase * 0.7) * 10;
      const ribbonH = 30 + Math.sin(x * 0.02 + phase) * 15;
      const alpha = 0.04 + Math.sin(x * 0.03 + phase * 2) * 0.02;
      for (let dy = 0; dy < ribbonH; dy += 2) {
        const fade = 1 - Math.abs(dy - ribbonH / 2) / (ribbonH / 2);
        px(ctx, x, bandY + wave + wave2 + dy, 2, 2, `rgba(${bandColor},${alpha * fade})`);
      }
    }
  }

  // Shooting stars (streaking across)
  for (let i = 0; i < 4; i++) {
    const seed = i * 137 + 7;
    const cycle = (time * 0.12 + i * 0.31) % 1;
    if (cycle < 0.3) {
      const progress = cycle / 0.3;
      const baseX = hash(seed) * GAME_WIDTH * 0.5;
      const baseY = hash(seed + 1) * GAME_HEIGHT * 0.3;
      const sx = baseX + progress * 200;
      const sy = baseY + progress * 100;
      const trailLen = 12 + (progress * 20 | 0);
      const alpha = Math.sin(progress * Math.PI) * 0.6;
      for (let t = 0; t < trailLen; t++) {
        const tx = sx - t * 4;
        const ty = sy - t * 2;
        const tAlpha = alpha * (1 - t / trailLen);
        px(ctx, tx, ty, 2, 2, `rgba(180,240,255,${tAlpha})`);
      }
      px(ctx, sx, sy, 3, 3, `rgba(255,255,255,${alpha})`);
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10);
      grad.addColorStop(0, `rgba(200,240,255,${alpha * 0.3})`);
      grad.addColorStop(1, 'rgba(200,240,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sx - 10, sy - 10, 20, 20);
    }
  }

  // Ion glow particles (drifting upward)
  const p2 = parallax * 0.1;
  for (let i = 0; i < 20; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT - time * 12, GAME_HEIGHT);
    const sway = Math.sin(time * 1.2 + i * 0.5) * 5;
    const pulse = Math.sin(time * 3 + i * 1.1) * 0.4 + 0.6;
    const size = hash(seed + 2) > 0.7 ? 3 : 2;
    const color = i % 3 === 0 ? '80,220,255' : i % 3 === 1 ? '120,200,255' : '180,160,255';
    px(ctx, x + sway, y, size, size, `rgba(${color},${0.3 * pulse})`);
    px(ctx, x + sway + 1, y, 1, 1, `rgba(220,240,255,${0.2 * pulse})`);
  }

  // Distant Earth curvature (bottom edge)
  const earthY = GAME_HEIGHT - 30;
  ctx.fillStyle = 'rgba(20,60,120,0.15)';
  ctx.beginPath();
  ctx.arc(GAME_WIDTH / 2, earthY + 80, 120, Math.PI * 1.2, Math.PI * 1.8);
  ctx.fill();
  ctx.fillStyle = 'rgba(40,100,160,0.1)';
  ctx.beginPath();
  ctx.arc(GAME_WIDTH / 2, earthY + 80, 118, Math.PI * 1.2, Math.PI * 1.8);
  ctx.fill();
  // Atmosphere glow on the edge
  const atmGrad = ctx.createRadialGradient(GAME_WIDTH / 2, earthY + 80, 116, GAME_WIDTH / 2, earthY + 80, 126);
  atmGrad.addColorStop(0, 'rgba(80,180,255,0.08)');
  atmGrad.addColorStop(1, 'rgba(80,180,255,0)');
  ctx.fillStyle = atmGrad;
  ctx.fillRect(0, earthY, GAME_WIDTH, 60);

  // Star field
  const p3 = parallax * 0.04;
  for (let i = 0; i < 25; i++) {
    const seed = i * 211 + 13;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 3 + i * 1.5) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.85 ? 2 : 1;
    px(ctx, x, y, size, size, `rgba(200,230,255,${0.15 + twinkle * 0.3})`);
  }

  // Noctilucent cloud wisps (high-altitude ice crystals)
  const p4 = parallax * 0.08;
  for (let i = 0; i < 5; i++) {
    const seed = i * 173 + 31;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p4, GAME_WIDTH + 60) - 30;
    const y = hash(seed + 1) * GAME_HEIGHT * 0.6;
    const w = 30 + hash(seed + 2) * 20;
    const pulse = Math.sin(time * 0.8 + i * 1.2) * 0.2 + 0.8;
    px(ctx, x, y, w, 3, `rgba(150,220,255,${0.04 * pulse})`);
    px(ctx, x + 4, y - 2, w - 8, 5, `rgba(120,200,240,${0.03 * pulse})`);
    px(ctx, x + 8, y + 1, w - 16, 2, `rgba(180,230,255,${0.05 * pulse})`);
  }
}

// EXOSPHERE ZONE: Satellites, space debris and orbital stations
export function drawExosphereBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Deep space star field (dense, multi-layer)
  const p1 = parallax * 0.02;
  for (let i = 0; i < 50; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p1, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 2 + i * 1.3) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.9 ? 2 : 1;
    const brightness = 0.1 + twinkle * 0.3;
    px(ctx, x, y, size, size, `rgba(200,210,230,${brightness})`);
    if (twinkle > 0.8 && size > 1) {
      px(ctx, x - 1, y, 3, 1, `rgba(220,230,255,${twinkle * 0.1})`);
      px(ctx, x, y - 1, 1, 3, `rgba(220,230,255,${twinkle * 0.1})`);
    }
  }

  // Distant Earth (small, at bottom)
  const earthR = 60;
  const earthCX = GAME_WIDTH / 2;
  const earthCY = GAME_HEIGHT + earthR - 10;
  // Earth body
  ctx.fillStyle = '#0a2040';
  ctx.beginPath();
  ctx.arc(earthCX, earthCY, earthR, 0, Math.PI * 2);
  ctx.fill();
  // Continent patches
  ctx.fillStyle = 'rgba(20,80,40,0.3)';
  ctx.beginPath();
  ctx.arc(earthCX - 15, earthCY - 30, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(earthCX + 10, earthCY - 20, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(earthCX + 20, earthCY - 35, 6, 0, Math.PI * 2);
  ctx.fill();
  // Atmosphere ring
  const atmGrad = ctx.createRadialGradient(earthCX, earthCY, earthR - 2, earthCX, earthCY, earthR + 8);
  atmGrad.addColorStop(0, 'rgba(80,160,255,0.15)');
  atmGrad.addColorStop(0.5, 'rgba(80,160,255,0.06)');
  atmGrad.addColorStop(1, 'rgba(80,160,255,0)');
  ctx.fillStyle = atmGrad;
  ctx.beginPath();
  ctx.arc(earthCX, earthCY, earthR + 8, 0, Math.PI * 2);
  ctx.fill();

  // Satellites (orbiting, with blinking lights)
  const p2 = parallax * 0.06;
  for (let i = 0; i < 4; i++) {
    const seed = i * 173 + 17;
    const orbitAngle = time * 0.1 + i * Math.PI * 0.5;
    const orbitR = 40 + hash(seed) * 50;
    const baseX = hash(seed + 1) * GAME_WIDTH * 0.6 + GAME_WIDTH * 0.2;
    const baseY = hash(seed + 2) * GAME_HEIGHT * 0.4 + 40;
    const sx = baseX + Math.cos(orbitAngle) * orbitR;
    const sy = baseY + Math.sin(orbitAngle) * orbitR * 0.4;

    // Satellite body
    px(ctx, sx, sy, 5, 4, '#4a4a5a');
    px(ctx, sx, sy, 5, 1, '#6a6a7a');
    // Solar panels
    px(ctx, sx - 8, sy, 5, 4, '#1a3060');
    px(ctx, sx + 8, sy, 5, 4, '#1a3060');
    px(ctx, sx - 8, sy, 5, 1, '#3a5080');
    px(ctx, sx + 8, sy, 5, 1, '#3a5080');
    // Antenna
    px(ctx, sx + 2, sy - 3, 1, 3, '#5a5a6a');
    // Blinking light
    const blink = Math.sin(time * 3 + i * 2) > 0.6 ? 1 : 0;
    if (blink) {
      px(ctx, sx + 2, sy + 4, 1, 1, 'rgba(255,80,80,0.8)');
    }
  }

  // Space debris (tumbling fragments)
  const p3 = parallax * 0.15;
  for (let i = 0; i < 8; i++) {
    const seed = i * 89 + 33;
    const x = wrap(hash(seed) * (GAME_WIDTH + 30) - p3, GAME_WIDTH + 30) - 15;
    const y = hash(seed + 1) * GAME_HEIGHT;
    const rot = time * (0.5 + hash(seed + 2) * 0.8) + i;
    const size = 3 + hash(seed + 3) * 4;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    // Debris fragment (small rotated rectangle)
    px(ctx, x, y, size, size * 0.6, '#3a3a48');
    px(ctx, x + 1, y, size - 2, 1, '#5a5a68');
    if (hash(seed + 4) > 0.5) {
      px(ctx, x + size, y - 2, 2, 2, '#2a2a38');
    }
  }

  // Orbital station (large, slow-moving)
  const stationCycle = (time * 0.04) % 1;
  const stationX = stationCycle * (GAME_WIDTH + 80) - 40;
  const stationY = GAME_HEIGHT * 0.25;
  // Main module
  px(ctx, stationX, stationY, 16, 8, '#4a4a5a');
  px(ctx, stationX, stationY, 16, 2, '#6a6a7a');
  // Side modules
  px(ctx, stationX - 6, stationY + 1, 6, 6, '#3a3a48');
  px(ctx, stationX + 16, stationY + 1, 6, 6, '#3a3a48');
  // Solar arrays
  px(ctx, stationX - 14, stationY + 2, 8, 4, '#1a3060');
  px(ctx, stationX + 22, stationY + 2, 8, 4, '#1a3060');
  px(ctx, stationX - 14, stationY + 2, 8, 1, '#3a5080');
  px(ctx, stationX + 22, stationY + 2, 8, 1, '#3a5080');
  // Window glow
  for (let w = 0; w < 3; w++) {
    const glow = Math.sin(time * 2 + w) * 0.3 + 0.7;
    px(ctx, stationX + 3 + w * 4, stationY + 3, 2, 2, `rgba(255,220,100,${0.4 * glow})`);
  }

  // Faint orbital trail (dashed line)
  ctx.strokeStyle = 'rgba(100,140,200,0.04)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT * 0.3);
  ctx.lineTo(GAME_WIDTH, GAME_HEIGHT * 0.3);
  ctx.stroke();
  ctx.setLineDash([]);

  // Drifting micro-debris
  const p5 = parallax * 0.2;
  for (let i = 0; i < 10; i++) {
    const seed = i * 211 + 13;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 3, GAME_HEIGHT);
    px(ctx, x, y, 1, 1, 'rgba(150,170,200,0.15)');
  }
}

// ORBIT/SOLAR SYSTEM ZONE: Planets, sun, asteroid belt and deep space
export function drawOrbitBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // The Sun (large, radiant, at edge)
  const sunX = GAME_WIDTH - 30;
  const sunY = 40;
  const sunR = 25;
  // Corona glow
  for (let r = sunR + 20; r > sunR; r -= 2) {
    const fade = (sunR + 20 - r) / 20;
    const grad = ctx.createRadialGradient(sunX, sunY, r - 2, sunX, sunY, r);
    grad.addColorStop(0, `rgba(255,200,60,${0.02 * fade})`);
    grad.addColorStop(1, 'rgba(255,200,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(sunX - r, sunY - r, r * 2, r * 2);
  }
  // Sun body
  const sunGrad = ctx.createRadialGradient(sunX - 5, sunY - 5, 2, sunX, sunY, sunR);
  sunGrad.addColorStop(0, '#fff8c0');
  sunGrad.addColorStop(0.4, '#ffd040');
  sunGrad.addColorStop(0.8, '#ff9020');
  sunGrad.addColorStop(1, '#cc5010');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();
  // Solar flares (pulsing)
  const flarePulse = Math.sin(time * 1.5) * 0.3 + 0.7;
  for (let f = 0; f < 6; f++) {
    const ang = time * 0.3 + f * Math.PI / 3;
    const fx = sunX + Math.cos(ang) * (sunR - 2);
    const fy = sunY + Math.sin(ang) * (sunR - 2);
    const flen = 4 + Math.sin(time * 4 + f) * 3;
    px(ctx, fx, fy, 2, flen, `rgba(255,200,80,${0.3 * flarePulse})`);
  }

  // Planets (various sizes, with orbits)
  const planets = [
    { r: 8, color: '#a08060', orbit: 60, speed: 0.08, phase: 0, hasRing: false },
    { r: 12, color: '#4080c0', orbit: 100, speed: 0.05, phase: 1.5, hasRing: true },
    { r: 6, color: '#c05030', orbit: 140, speed: 0.04, phase: 3, hasRing: false },
    { r: 14, color: '#d0a060', orbit: 180, speed: 0.03, phase: 4.5, hasRing: true },
  ];
  for (const planet of planets) {
    const ang = time * planet.speed + planet.phase;
    const px2 = GAME_WIDTH / 2 + Math.cos(ang) * planet.orbit;
    const py2 = GAME_HEIGHT * 0.5 + Math.sin(ang) * planet.orbit * 0.35;

    // Orbit trail (faint ellipse)
    ctx.strokeStyle = 'rgba(100,120,160,0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH / 2, GAME_HEIGHT * 0.5, planet.orbit, planet.orbit * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Planet body
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(px2, py2, planet.r, 0, Math.PI * 2);
    ctx.fill();
    // Shading
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.arc(px2 + planet.r * 0.3, py2 + planet.r * 0.2, planet.r, 0, Math.PI * 2);
    ctx.fill();
    // Surface band
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(px2 - planet.r, py2 - 1, planet.r * 2, 1);
    // Ring
    if (planet.hasRing) {
      ctx.save();
      ctx.translate(px2, py2);
      ctx.rotate(-0.3);
      ctx.strokeStyle = 'rgba(200,180,140,0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, planet.r * 1.8, planet.r * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    // Atmospheric glow
    const atmGrad = ctx.createRadialGradient(px2, py2, planet.r, px2, py2, planet.r + 4);
    atmGrad.addColorStop(0, 'rgba(150,180,220,0.06)');
    atmGrad.addColorStop(1, 'rgba(150,180,220,0)');
    ctx.fillStyle = atmGrad;
    ctx.fillRect(px2 - planet.r - 4, py2 - planet.r - 4, (planet.r + 4) * 2, (planet.r + 4) * 2);
  }

  // Asteroid belt (drifting rocks)
  const p2 = parallax * 0.1;
  for (let i = 0; i < 18; i++) {
    const seed = i * 97 + 13;
    const baseX = hash(seed) * GAME_WIDTH;
    const baseY = hash(seed + 1) * GAME_HEIGHT;
    const drift = (time * 5 + hash(seed + 2) * 100 + p2) % (GAME_WIDTH + 40);
    const ax = wrap(baseX + drift - 20, GAME_WIDTH);
    const ay = baseY + Math.sin(time * 0.5 + i) * 8;
    const sz = 2 + hash(seed + 3) * 3;
    const rot = time * 0.8 + i * 2;
    px(ctx, ax, ay, sz, sz, '#4a4038');
    px(ctx, ax + 1, ay, sz - 1, 1, '#6a5848');
    if (hash(seed + 4) > 0.6) {
      px(ctx, ax + sz, ay - 1, 1, 1, '#3a3028');
    }
  }

  // Dense star field (deep space)
  const p3 = parallax * 0.02;
  for (let i = 0; i < 60; i++) {
    const seed = i * 421 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 2.5 + i * 1.7) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.92 ? 2 : 1;
    const color = hash(seed + 3) > 0.8 ? '255,220,180' : hash(seed + 3) > 0.5 ? '200,220,255' : '230,230,240';
    px(ctx, x, y, size, size, `rgba(${color},${0.12 + twinkle * 0.25})`);
    if (twinkle > 0.85 && size > 1) {
      px(ctx, x - 1, y, 3, 1, `rgba(255,255,255,${twinkle * 0.08})`);
      px(ctx, x, y - 1, 1, 3, `rgba(255,255,255,${twinkle * 0.08})`);
    }
  }

  // Comet with long tail
  const cometCycle = (time * 0.06) % 1;
  if (cometCycle < 0.5) {
    const progress = cometCycle / 0.5;
    const cx = -20 + progress * (GAME_WIDTH + 40);
    const cy = GAME_HEIGHT * 0.15 + progress * GAME_HEIGHT * 0.3;
    const trailLen = 20 + (progress * 30 | 0);
    const alpha = Math.sin(progress * Math.PI) * 0.5;
    for (let t = 0; t < trailLen; t++) {
      const tx = cx - t * 3;
      const ty = cy - t * 1.5;
      const tAlpha = alpha * (1 - t / trailLen);
      px(ctx, tx, ty, 2, 2, `rgba(255,200,120,${tAlpha})`);
    }
    px(ctx, cx, cy, 3, 3, `rgba(255,255,200,${alpha})`);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
    grad.addColorStop(0, `rgba(255,220,120,${alpha * 0.3})`);
    grad.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - 10, cy - 10, 20, 20);
  }

  // Solar wind particles (radiating outward from sun)
  for (let i = 0; i < 12; i++) {
    const seed = i * 251 + 31;
    const ang = hash(seed) * Math.PI * 2;
    const dist = (time * 30 + hash(seed + 1) * 100) % 120;
    const wx = sunX + Math.cos(ang) * (sunR + dist);
    const wy = sunY + Math.sin(ang) * (sunR + dist);
    const fade = 1 - dist / 120;
    px(ctx, wx, wy, 1, 1, `rgba(255,200,80,${0.2 * fade})`);
  }
}

// INTERSTELLAR MEDIUM: Dust clouds, protostars, and molecular nebulae
export function drawInterstellarBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: vast nebula clouds (purple/magenta molecular clouds)
  for (let i = 0; i < 5; i++) {
    const seed = i * 137.5 + 50;
    const x = wrap(hash(seed) * GAME_WIDTH - parallax * 0.02, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT;
    const w = 80 + hash(seed + 2) * 70;
    const pulse = Math.sin(time * 0.2 + i * 1.1) * 0.15 + 0.85;
    const colors = ['120,60,200', '180,60,160', '60,80,220', '140,40,180'];
    const color = colors[i % colors.length];

    const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
    grad.addColorStop(0, `rgba(${color},${0.06 * pulse})`);
    grad.addColorStop(0.4, `rgba(${color},${0.03 * pulse})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - w, y - w, w * 2, w * 2);
  }

  // Molecular cloud filaments (dusty strands)
  const p1 = parallax * 0.05;
  for (let i = 0; i < 8; i++) {
    const seed = i * 89.3 + 70;
    const x = wrap(hash(seed) * GAME_WIDTH - p1, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT;
    const len = 40 + hash(seed + 2) * 50;
    const angle = hash(seed + 3) * Math.PI;
    const pulse = Math.sin(time * 0.5 + i) * 0.3 + 0.7;
    for (let s = 0; s < len; s += 2) {
      const fx = x + Math.cos(angle) * s;
      const fy = y + Math.sin(angle) * s;
      const alpha = (1 - s / len) * 0.08 * pulse;
      px(ctx, fx, fy, 3, 2, `rgba(140,80,200,${alpha})`);
      px(ctx, fx, fy, 1, 1, `rgba(200,140,255,${alpha * 0.6})`);
    }
  }

  // Protostars (bright spots igniting within clouds)
  const p2 = parallax * 0.08;
  for (let i = 0; i < 6; i++) {
    const seed = i * 211 + 13;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT;
    const pulse = Math.sin(time * 1.5 + i * 0.9) * 0.4 + 0.6;
    const color = i % 2 === 0 ? '255,200,120' : '180,160,255';

    // Core
    px(ctx, x, y, 2, 2, `rgba(255,255,240,${0.6 * pulse})`);
    px(ctx, x, y, 1, 1, `rgba(255,255,255,${0.8 * pulse})`);
    // Glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 12);
    grad.addColorStop(0, `rgba(${color},${0.15 * pulse})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - 12, y - 12, 24, 24);
  }

  // Dust particles (drifting interstellar grains)
  const p3 = parallax * 0.15;
  for (let i = 0; i < 24; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 4, GAME_HEIGHT);
    const sway = Math.sin(time * 0.8 + i * 0.6) * 5;
    const pulse = Math.sin(time * 2 + i * 1.3) * 0.3 + 0.7;
    const size = hash(seed + 2) > 0.8 ? 2 : 1;
    const color = i % 3 === 0 ? '180,140,255' : i % 3 === 1 ? '200,180,255' : '220,200,240';

    px(ctx, x + sway, y, size, size, `rgba(${color},${0.25 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,255,255,${0.12 * pulse})`);
  }

  // Dense star field
  const p4 = parallax * 0.02;
  for (let i = 0; i < 55; i++) {
    const seed = i * 421 + 17;
    const x = wrap(hash(seed) * GAME_WIDTH - p4, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 2.5 + i * 1.5) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.9 ? 2 : 1;
    const tint = hash(seed + 3) > 0.7 ? '255,200,180' : hash(seed + 3) > 0.4 ? '200,200,255' : '230,230,240';
    px(ctx, x, y, size, size, `rgba(${tint},${0.15 + twinkle * 0.3})`);
    if (twinkle > 0.85 && size > 1) {
      px(ctx, x - 1, y, 3, 1, `rgba(255,255,255,${twinkle * 0.08})`);
      px(ctx, x, y - 1, 1, 3, `rgba(255,255,255,${twinkle * 0.08})`);
    }
  }
}

// MILKY WAY & LOCAL GROUP: Spiral galaxy with galactic core and satellite galaxies
export function drawMilkyWayBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;
  const gcX = GAME_WIDTH / 2;
  const gcY = GAME_HEIGHT * 0.5;

  // Galactic core glow (bright bulge)
  const corePulse = Math.sin(time * 0.4) * 0.1 + 0.9;
  const coreGrad = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, 80);
  coreGrad.addColorStop(0, `rgba(255,220,150,${0.1 * corePulse})`);
  coreGrad.addColorStop(0.3, `rgba(255,180,100,${0.05 * corePulse})`);
  coreGrad.addColorStop(1, 'rgba(255,180,100,0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(gcX - 80, gcY - 80, 160, 160);

  // Galactic core (bright spot)
  const innerGrad = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, 20);
  innerGrad.addColorStop(0, 'rgba(255,240,200,0.5)');
  innerGrad.addColorStop(0.5, 'rgba(255,200,120,0.2)');
  innerGrad.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(gcX - 20, gcY - 20, 40, 40);

  // Spiral arms (particle streams rotating around core)
  const rotation = time * 0.05;
  for (let arm = 0; arm < 4; arm++) {
    const armPhase = arm * Math.PI / 2 + rotation;
    for (let s = 0; s < 60; s++) {
      const t = s / 60;
      const r = 15 + t * 120;
      const spiralAngle = armPhase + t * 3.5;
      const sx = gcX + Math.cos(spiralAngle) * r;
      const sy = gcY + Math.sin(spiralAngle) * r * 0.5;
      const alpha = (1 - t) * 0.15;
      const color = arm % 2 === 0 ? '120,160,255' : '180,200,255';
      const size = t < 0.3 ? 2 : 1;
      px(ctx, sx, sy, size, size, `rgba(${color},${alpha})`);
      if (hash(s + arm * 10) > 0.8) {
        px(ctx, sx, sy, 1, 1, `rgba(255,255,255,${alpha * 0.8})`);
      }
    }
  }

  // Satellite galaxies (Magellanic Clouds — small fuzzy patches)
  const p1 = parallax * 0.03;
  for (let i = 0; i < 3; i++) {
    const seed = i * 173 + 41;
    const x = wrap(hash(seed) * GAME_WIDTH - p1, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT * 0.6 + 20;
    const w = 20 + hash(seed + 2) * 15;
    const pulse = Math.sin(time * 0.3 + i) * 0.2 + 0.8;
    const color = i === 0 ? '200,180,255' : i === 1 ? '255,200,180' : '180,220,255';

    // Cloud glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
    grad.addColorStop(0, `rgba(${color},${0.06 * pulse})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - w, y - w, w * 2, w * 2);
    // Cloud stars
    for (let s = 0; s < 8; s++) {
      const sx = x + (hash(seed + s) - 0.5) * w;
      const sy = y + (hash(seed + s + 10) - 0.5) * w * 0.7;
      px(ctx, sx, sy, 1, 1, `rgba(255,255,255,${0.15 * pulse})`);
    }
  }

  // Dense star field (galactic disk stars)
  const p2 = parallax * 0.02;
  for (let i = 0; i < 70; i++) {
    const seed = i * 421 + 7;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 2 + i * 1.3) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.88 ? 2 : 1;
    const tint = hash(seed + 3) > 0.7 ? '255,220,160' : hash(seed + 3) > 0.45 ? '180,200,255' : '240,240,250';
    px(ctx, x, y, size, size, `rgba(${tint},${0.12 + twinkle * 0.25})`);
    if (twinkle > 0.85 && size > 1) {
      px(ctx, x - 1, y, 3, 1, `rgba(255,255,255,${twinkle * 0.08})`);
      px(ctx, x, y - 1, 1, 3, `rgba(255,255,255,${twinkle * 0.08})`);
    }
  }

  // Drifting cosmic dust
  const p3 = parallax * 0.12;
  for (let i = 0; i < 14; i++) {
    const seed = i * 251 + 31;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 3, GAME_HEIGHT);
    const sway = Math.sin(time * 1 + i * 0.5) * 5;
    px(ctx, x + sway, y, 2, 2, 'rgba(150,180,255,0.12)');
    px(ctx, x + sway, y, 1, 1, 'rgba(220,240,255,0.06)');
  }
}

// OBSERVABLE UNIVERSE: Cosmic web, galaxy clusters, and the CMB boundary
export function drawObservableUniverseBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Cosmic Microwave Background (faint mottled glow)
  const p1 = parallax * 0.01;
  for (let i = 0; i < 30; i++) {
    const seed = i * 157 + 3;
    const x = wrap(hash(seed) * GAME_WIDTH - p1, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const w = 30 + hash(seed + 2) * 40;
    const pulse = Math.sin(time * 0.15 + i * 0.8) * 0.15 + 0.85;
    const color = i % 2 === 0 ? '40,60,120' : '60,40,100';

    const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
    grad.addColorStop(0, `rgba(${color},${0.02 * pulse})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - w, y - w, w * 2, w * 2);
  }

  // Galaxy clusters (dense groups of tiny galaxies)
  const p2 = parallax * 0.04;
  for (let cluster = 0; cluster < 4; cluster++) {
    const seed = cluster * 211 + 17;
    const cx = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const cy = hash(seed + 1) * GAME_HEIGHT;
    const numGalaxies = 4 + (hash(seed + 2) * 4 | 0);

    // Cluster halo
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
    grad.addColorStop(0, 'rgba(80,120,200,0.03)');
    grad.addColorStop(1, 'rgba(80,120,200,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - 40, cy - 40, 80, 80);

    for (let g = 0; g < numGalaxies; g++) {
      const gx = cx + (hash(seed + g * 3) - 0.5) * 50;
      const gy = cy + (hash(seed + g * 3 + 1) - 0.5) * 40;
      const sz = 2 + hash(seed + g * 3 + 2) * 3;
      const color = hash(seed + g * 3 + 3) > 0.5 ? '150,180,255' : '255,200,160';

      px(ctx, gx, gy, sz, sz, `rgba(${color},0.2)`);
      px(ctx, gx, gy, 1, 1, `rgba(255,255,255,0.1)`);
      // Tiny glow
      const gGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 8);
      gGrad.addColorStop(0, `rgba(${color},0.04)`);
      gGrad.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = gGrad;
      ctx.fillRect(gx - 8, gy - 8, 16, 16);
    }
  }

  // Cosmic web filaments (connecting strands between clusters)
  const p3 = parallax * 0.03;
  for (let i = 0; i < 6; i++) {
    const seed = i * 331 + 27;
    const x1 = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y1 = hash(seed + 1) * GAME_HEIGHT;
    const x2 = wrap(hash(seed + 2) * GAME_WIDTH - p3, GAME_WIDTH);
    const y2 = hash(seed + 3) * GAME_HEIGHT;
    const pulse = Math.sin(time * 0.3 + i) * 0.2 + 0.8;

    const steps = 20;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const fx = x1 + (x2 - x1) * t;
      const fy = y1 + (y2 - y1) * t;
      const alpha = Math.sin(t * Math.PI) * 0.04 * pulse;
      px(ctx, fx, fy, 1, 1, `rgba(100,140,220,${alpha})`);
    }
  }

  // Distant star field (extremely deep)
  const p4 = parallax * 0.01;
  for (let i = 0; i < 80; i++) {
    const seed = i * 421 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p4, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 1.5 + i * 1.1) * 0.4 + 0.5;
    const size = hash(seed + 2) > 0.93 ? 2 : 1;
    const tint = hash(seed + 3) > 0.6 ? '200,180,255' : '220,220,240';
    px(ctx, x, y, size, size, `rgba(${tint},${0.08 + twinkle * 0.2})`);
  }

  // Redshift streaks (distant light stretching toward red)
  for (let i = 0; i < 5; i++) {
    const seed = i * 97 + 7;
    const cycle = (time * 0.04 + i * 0.23) % 1;
    if (cycle < 0.3) {
      const progress = cycle / 0.3;
      const x = hash(seed) * GAME_WIDTH;
      const y = hash(seed + 1) * GAME_HEIGHT;
      const alpha = Math.sin(progress * Math.PI) * 0.08;
      for (let t = 0; t < 8; t++) {
        const tx = x + t * 2;
        px(ctx, tx, y, 1, 1, `rgba(255,80,40,${alpha * (1 - t / 8)})`);
      }
    }
  }
}

// MULTIVERSE (M-Theory): Parallel branes, quantum foam, and extra dimensions
export function drawMultiverseBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Quantum foam (bubbling reality fluctuations)
  for (let i = 0; i < 20; i++) {
    const seed = i * 137 + 7;
    const x = wrap(hash(seed) * GAME_WIDTH - parallax * 0.03, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT;
    const w = 8 + hash(seed + 2) * 20;
    const pulse = Math.sin(time * 2 + i * 0.7) * 0.3 + 0.7;
    const color = i % 3 === 0 ? '200,60,160' : i % 3 === 1 ? '60,220,180' : '120,80,255';

    const grad = ctx.createRadialGradient(x, y, 0, x, y, w);
    grad.addColorStop(0, `rgba(${color},${0.04 * pulse})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - w, y - w, w * 2, w * 2);
  }

  // Brane membranes (floating dimensional sheets)
  const p1 = parallax * 0.04;
  for (let i = 0; i < 3; i++) {
    const seed = i * 211 + 31;
    const phase = time * 0.3 + i * 1.5;
    const braneY = GAME_HEIGHT * (0.2 + i * 0.3);
    const color = i === 0 ? '200,60,160' : i === 1 ? '60,200,200' : '120,80,255';

    for (let x = 0; x < GAME_WIDTH; x += 2) {
      const wave = Math.sin(x * 0.015 + phase) * 20 + Math.sin(x * 0.04 + phase * 1.3) * 10;
      const offset = wrap(hash(seed) * 40 - p1, 40);
      const fade = Math.sin(x * 0.01 + phase * 0.5) * 0.3 + 0.7;
      px(ctx, x + offset - 20, braneY + wave, 2, 3, `rgba(${color},${0.04 * fade})`);
      px(ctx, x + offset - 20, braneY + wave, 2, 1, `rgba(${color},${0.06 * fade})`);
    }
  }

  // Parallel universe windows (brief glimpses of alternate realities)
  for (let i = 0; i < 4; i++) {
    const seed = i * 173 + 17;
    const cycle = (time * 0.08 + i * 0.27) % 1;
    if (cycle < 0.15) {
      const x = hash(seed) * GAME_WIDTH;
      const y = hash(seed + 1) * GAME_HEIGHT;
      const r = 15 + (cycle / 0.15) * 25;
      const alpha = Math.sin((cycle / 0.15) * Math.PI) * 0.06;
      const color = i === 0 ? '200,60,160' : i === 1 ? '60,220,180' : i === 2 ? '120,80,255' : '255,160,40';

      const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
      grad.addColorStop(0, `rgba(${color},${alpha})`);
      grad.addColorStop(0.7, `rgba(${color},${alpha * 0.3})`);
      grad.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);

      // Alternate reality stars inside
      for (let s = 0; s < 6; s++) {
        const sx = x + (hash(seed + s) - 0.5) * r * 0.8;
        const sy = y + (hash(seed + s + 10) - 0.5) * r * 0.8;
        px(ctx, sx, sy, 1, 1, `rgba(255,255,255,${alpha * 2})`);
      }
    }
  }

  // Quantum particle fluctuations (popping in and out of existence)
  const p2 = parallax * 0.1;
  for (let i = 0; i < 30; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const flicker = Math.sin(time * 8 + i * 2.3) * 0.5 + 0.5;
    const size = hash(seed + 2) > 0.8 ? 2 : 1;
    const color = i % 4 === 0 ? '220,60,180' : i % 4 === 1 ? '60,240,200' : i % 4 === 2 ? '140,80,255' : '255,140,60';

    if (flicker > 0.3) {
      px(ctx, x, y, size, size, `rgba(${color},${flicker * 0.2})`);
      px(ctx, x, y, 1, 1, `rgba(255,255,255,${flicker * 0.1})`);
    }
  }

  // Calabi-Yau dimensional shadows (extra-dimensional geometry)
  const p3 = parallax * 0.05;
  for (let i = 0; i < 5; i++) {
    const seed = i * 89 + 13;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = hash(seed + 1) * GAME_HEIGHT;
    const rot = time * 0.2 + i;
    const sz = 6 + hash(seed + 2) * 8;

    // Hexagonal dimensional shadow
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = 'rgba(200,60,160,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let v = 0; v < 6; v++) {
      const ang = (v / 6) * Math.PI * 2;
      const vx = Math.cos(ang) * sz;
      const vy = Math.sin(ang) * sz;
      if (v === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.stroke();
    // Inner geometry
    ctx.strokeStyle = 'rgba(60,220,180,0.04)';
    for (let v = 0; v < 6; v++) {
      const ang = (v / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * sz, Math.sin(ang) * sz);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Very deep star field (nearly invisible, from our universe)
  const p4 = parallax * 0.01;
  for (let i = 0; i < 40; i++) {
    const seed = i * 421 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p4, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 1 + i) * 0.4 + 0.5;
    px(ctx, x, y, 1, 1, `rgba(200,200,220,${0.05 + twinkle * 0.1})`);
  }
}

// HYPERSPACE / PLATONIC LATTICE: Sacred geometry, Platonic solids, golden ratio
export function drawHyperspaceBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Far layer: rotating Platonic solids (tetrahedron, cube, octahedron)
  const p1 = parallax * 0.04;
  for (let i = 0; i < 5; i++) {
    const seed = i * 157.3 + 10;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 80) - p1, GAME_WIDTH + 80) - 40;
    const cy = hash(seed + 1) * GAME_HEIGHT * 0.7 + GAME_HEIGHT * 0.15;
    const r = 18 + hash(seed + 2) * 20;
    const rot = time * (0.2 + hash(seed + 3) * 0.3) * (i % 2 === 0 ? 1 : -1);
    const solidType = i % 3; // 0=tetrahedron, 1=cube, 2=octahedron
    const goldAlpha = 0.08 + Math.sin(time + i) * 0.03;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    if (solidType === 0) {
      // Tetrahedron (triangle with inner lines)
      ctx.strokeStyle = `rgba(220,180,60,${goldAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let v = 0; v < 3; v++) {
        const ang = (v / 3) * Math.PI * 2 - Math.PI / 2;
        const vx = Math.cos(ang) * r;
        const vy = Math.sin(ang) * r;
        if (v === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.stroke();
      // Inner lines to center
      for (let v = 0; v < 3; v++) {
        const ang = (v / 3) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        ctx.stroke();
      }
    } else if (solidType === 1) {
      // Cube (projected square with 3D edges)
      ctx.strokeStyle = `rgba(200,170,80,${goldAlpha})`;
      ctx.lineWidth = 1;
      // Front face
      ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
      // Back face (offset)
      ctx.strokeRect(-r * 0.5, -r * 0.5, r * 1.4, r * 1.4);
      // Connecting edges
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(-r * 0.5, -r * 0.5);
      ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(r * 0.9, -r * 0.5);
      ctx.moveTo(-r * 0.7, r * 0.7); ctx.lineTo(-r * 0.5, r * 0.9);
      ctx.moveTo(r * 0.7, r * 0.7); ctx.lineTo(r * 0.9, r * 0.9);
      ctx.stroke();
    } else {
      // Octahedron (diamond with inner cross)
      ctx.strokeStyle = `rgba(180,200,120,${goldAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.7, 0);
      ctx.closePath();
      ctx.stroke();
      // Inner cross
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, 0); ctx.lineTo(r * 0.7, 0);
      ctx.moveTo(0, -r); ctx.lineTo(0, r);
      ctx.stroke();
    }

    // Golden glow at center
    const pulse = Math.sin(time * 1.5 + i) * 0.3 + 0.7;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
    grad.addColorStop(0, `rgba(220,180,60,${0.12 * pulse})`);
    grad.addColorStop(1, 'rgba(220,180,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    ctx.restore();
  }

  // Mid layer: sacred geometry grid (Flower of Life pattern)
  const p2 = parallax * 0.1;
  const gridSpacing = 50;
  const gridOffsetX = wrap(p2, gridSpacing);
  for (let row = -1; row < GAME_HEIGHT / gridSpacing + 1; row++) {
    for (let col = -1; col < GAME_WIDTH / gridSpacing + 1; col++) {
      const gx = col * gridSpacing + gridOffsetX + (row % 2 === 0 ? 0 : gridSpacing / 2);
      const gy = row * gridSpacing * 0.866;
      const pulse = Math.sin(time * 0.5 + (row + col) * 0.3) * 0.15 + 0.85;

      ctx.strokeStyle = `rgba(200,170,80,${0.025 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(gx, gy, gridSpacing * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Fibonacci spiral (golden ratio)
  const p3 = parallax * 0.07;
  for (let i = 0; i < 2; i++) {
    const seed = i * 211 + 5;
    const sx = wrap(hash(seed) * (GAME_WIDTH + 60) - p3, GAME_WIDTH + 60) - 30;
    const sy = hash(seed + 1) * GAME_HEIGHT;
    const pulse = Math.sin(time * 0.3 + i) * 0.2 + 0.8;

    ctx.strokeStyle = `rgba(220,190,80,${0.06 * pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const phi = 1.618;
    let angle = 0;
    let radius = 2;
    for (let s = 0; s < 40; s++) {
      const x = sx + Math.cos(angle) * radius;
      const y = sy + Math.sin(angle) * radius;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      angle += 0.3;
      radius *= phi * 0.98;
    }
    ctx.stroke();
  }

  // Golden ratio particles
  const p4 = parallax * 0.15;
  for (let i = 0; i < 18; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p4, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 5, GAME_HEIGHT);
    const sway = Math.sin(time * 1.2 + i * 0.7) * 6;
    const pulse = Math.sin(time * 2 + i * 1.3) * 0.3 + 0.7;
    const size = hash(seed + 2) > 0.7 ? 2 : 1;

    px(ctx, x + sway, y, size, size, `rgba(220,180,60,${0.25 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,230,140,${0.15 * pulse})`);
  }

  // Faint star field
  const p5 = parallax * 0.02;
  for (let i = 0; i < 35; i++) {
    const seed = i * 421 + 17;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 2 + i * 1.5) * 0.4 + 0.5;
    px(ctx, x, y, 1, 1, `rgba(220,210,180,${0.08 + twinkle * 0.12})`);
  }

  // Connecting lattice lines (Platonic grid)
  const p6 = parallax * 0.06;
  for (let i = 0; i < 4; i++) {
    const seed = i * 89 + 33;
    const x1 = wrap(hash(seed) * GAME_WIDTH - p6, GAME_WIDTH);
    const y1 = hash(seed + 1) * GAME_HEIGHT;
    const x2 = wrap(hash(seed + 2) * GAME_WIDTH - p6, GAME_WIDTH);
    const y2 = hash(seed + 3) * GAME_HEIGHT;
    const pulse = Math.sin(time * 0.4 + i) * 0.15 + 0.85;

    ctx.strokeStyle = `rgba(200,170,80,${0.03 * pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

// EMPYREAN / PARMENIDEAN HEAVEN: Eternal light, divine radiance, perfect stillness
export function drawEmpyreanBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Central divine radiance (emanating from center)
  const centerX = GAME_WIDTH / 2;
  const centerY = GAME_HEIGHT / 2;
  const radPulse = Math.sin(time * 0.3) * 0.15 + 0.85;

  // Outer radiance
  for (let r = 200; r > 40; r -= 4) {
    const fade = (200 - r) / 160;
    const grad = ctx.createRadialGradient(centerX, centerY, r - 4, centerX, centerY, r);
    grad.addColorStop(0, `rgba(255,200,100,${0.006 * fade * radPulse})`);
    grad.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(centerX - r, centerY - r, r * 2, r * 2);
  }

  // Inner luminous core
  const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
  coreGrad.addColorStop(0, `rgba(255,240,180,${0.15 * radPulse})`);
  coreGrad.addColorStop(0.4, `rgba(255,200,100,${0.08 * radPulse})`);
  coreGrad.addColorStop(1, 'rgba(255,200,100,0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(centerX - 50, centerY - 50, 100, 100);

  // Angelic light rays (radiating outward, slowly rotating)
  const rayRotation = time * 0.05;
  for (let i = 0; i < 12; i++) {
    const ang = rayRotation + (i / 12) * Math.PI * 2;
    const pulse = Math.sin(time * 0.5 + i * 0.5) * 0.2 + 0.8;
    const rayLen = 180 + Math.sin(time * 0.4 + i) * 20;
    const grad = ctx.createLinearGradient(
      centerX + Math.cos(ang) * 30,
      centerY + Math.sin(ang) * 30,
      centerX + Math.cos(ang) * rayLen,
      centerY + Math.sin(ang) * rayLen
    );
    grad.addColorStop(0, `rgba(255,220,140,${0.04 * pulse})`);
    grad.addColorStop(1, 'rgba(255,220,140,0)');
    ctx.fillStyle = grad;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(ang);
    ctx.fillRect(30, -3, rayLen, 6);
    ctx.restore();
  }

  // Floating halos (celestial rings)
  const p1 = parallax * 0.05;
  for (let i = 0; i < 6; i++) {
    const seed = i * 137 + 7;
    const x = wrap(hash(seed) * (GAME_WIDTH + 60) - p1, GAME_WIDTH + 60) - 30;
    const y = hash(seed + 1) * GAME_HEIGHT;
    const r = 12 + hash(seed + 2) * 16;
    const pulse = Math.sin(time * 0.6 + i * 0.9) * 0.2 + 0.8;
    const bob = Math.sin(time * 0.4 + i) * 8;

    // Halo ring
    ctx.strokeStyle = `rgba(255,200,100,${0.08 * pulse})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + bob, r, 0, Math.PI * 2);
    ctx.stroke();
    // Inner glow
    const grad = ctx.createRadialGradient(x, y + bob, r - 3, x, y + bob, r + 6);
    grad.addColorStop(0, `rgba(255,200,80,${0.03 * pulse})`);
    grad.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - r - 6, y + bob - r - 6, (r + 6) * 2, (r + 6) * 2);
  }

  // Divine particles (ascending sparks of light)
  const p2 = parallax * 0.12;
  for (let i = 0; i < 24; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT - time * 15, GAME_HEIGHT);
    const sway = Math.sin(time * 1 + i * 0.5) * 5;
    const pulse = Math.sin(time * 3 + i * 1.1) * 0.4 + 0.6;
    const size = hash(seed + 2) > 0.7 ? 3 : 2;

    px(ctx, x + sway, y, size, size, `rgba(255,220,120,${0.3 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,250,200,${0.2 * pulse})`);
  }

  // Heavenly choir dots (soft warm motes)
  const p3 = parallax * 0.08;
  for (let i = 0; i < 16; i++) {
    const seed = i * 251 + 31;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 4, GAME_HEIGHT);
    const sway = Math.sin(time * 0.8 + i * 0.6) * 7;
    const pulse = Math.sin(time * 1.5 + i * 0.8) * 0.3 + 0.7;

    px(ctx, x + sway, y, 2, 2, `rgba(255,240,180,${0.15 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,255,220,${0.08 * pulse})`);
  }

  // Very faint distant lights (eternal realm)
  const p4 = parallax * 0.02;
  for (let i = 0; i < 30; i++) {
    const seed = i * 421 + 17;
    const x = wrap(hash(seed) * GAME_WIDTH - p4, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 1.5 + i * 1.3) * 0.4 + 0.5;
    px(ctx, x, y, 1, 1, `rgba(255,230,180,${0.1 + twinkle * 0.15})`);
  }

  // Celestial spheres (nested concentric circles — Aristotelian cosmology)
  const p5 = parallax * 0.03;
  for (let i = 0; i < 3; i++) {
    const seed = i * 89 + 33;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 40) - p5, GAME_WIDTH + 40) - 20;
    const cy = hash(seed + 1) * GAME_HEIGHT;
    const pulse = Math.sin(time * 0.3 + i * 1.2) * 0.15 + 0.85;

    for (let s = 0; s < 3; s++) {
      const r = 15 + s * 12;
      ctx.strokeStyle = `rgba(255,200,80,${0.04 * pulse * (1 - s * 0.3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ABYSS OF BEING / ANAXIMANDER'S APEIRON: Boundless, indefinite void — the primordial chaos
export function drawApeironBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Deep void swirls — formless churning darkness
  const p1 = parallax * 0.03;
  for (let i = 0; i < 5; i++) {
    const seed = i * 173.7 + 5;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 60) - p1, GAME_WIDTH + 60) - 30;
    const cy = hash(seed + 1) * GAME_HEIGHT;
    const r = 40 + hash(seed + 2) * 50;
    const rot = time * (0.15 + hash(seed + 3) * 0.2) * (i % 2 === 0 ? 1 : -1);
    const pulse = Math.sin(time * 0.4 + i) * 0.2 + 0.8;

    // Swirling void tendril
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    for (let s = 0; s < 4; s++) {
      const sr = r * (1 - s * 0.2);
      const alpha = 0.04 * pulse * (1 - s * 0.25);
      ctx.fillStyle = `rgba(60,0,100,${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, sr, sr * 0.4, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Indefinite particles — sparks of unformed matter drifting in the boundless
  const p2 = parallax * 0.1;
  for (let i = 0; i < 30; i++) {
    const seed = i * 331 + 17;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 8, GAME_HEIGHT);
    const drift = Math.sin(time * 0.8 + i * 0.5) * 8;
    const pulse = Math.sin(time * 2 + i * 1.3) * 0.4 + 0.6;
    const size = hash(seed + 2) > 0.7 ? 2 : 1;

    px(ctx, x + drift, y, size, size, `rgba(120,40,180,${0.2 * pulse})`);
    px(ctx, x + drift, y, 1, 1, `rgba(180,80,220,${0.12 * pulse})`);
  }

  // Primordial vortex — the boundless churning
  const p3 = parallax * 0.06;
  for (let i = 0; i < 3; i++) {
    const seed = i * 251 + 9;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 40) - p3, GAME_WIDTH + 40) - 20;
    const cy = hash(seed + 1) * GAME_HEIGHT;
    const rot = time * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
    const pulse = Math.sin(time * 0.5 + i) * 0.2 + 0.8;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = `rgba(80,20,140,${0.06 * pulse})`;
    ctx.lineWidth = 1;
    for (let arm = 0; arm < 3; arm++) {
      ctx.beginPath();
      for (let s = 0; s < 25; s++) {
        const ang = (arm / 3) * Math.PI * 2 + s * 0.15;
        const rad = s * 1.8;
        const x = Math.cos(ang) * rad;
        const y = Math.sin(ang) * rad;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Faint abyssal glows — formless potential
  const p4 = parallax * 0.04;
  for (let i = 0; i < 4; i++) {
    const seed = i * 89 + 33;
    const x = wrap(hash(seed) * (GAME_WIDTH + 30) - p4, GAME_WIDTH + 30) - 15;
    const y = hash(seed + 1) * GAME_HEIGHT;
    const pulse = Math.sin(time * 0.3 + i * 1.2) * 0.2 + 0.8;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 30);
    grad.addColorStop(0, `rgba(80,20,140,${0.04 * pulse})`);
    grad.addColorStop(1, 'rgba(80,20,140,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - 30, y - 30, 60, 60);
  }

  // Distant void motes (nearly invisible — the infinite dark)
  const p5 = parallax * 0.02;
  for (let i = 0; i < 35; i++) {
    const seed = i * 421 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p5, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 1.5 + i * 1.3) * 0.3 + 0.5;
    px(ctx, x, y, 1, 1, `rgba(120,60,160,${0.06 + twinkle * 0.08})`);
  }
}

// UNMOVED MOVER / THE ONE: Pure absolute — ultimate unity, pure light of Being itself
export function drawMotorInmovilBackground(ctx: Ctx, engine: GameEngine, time: number) {
  const parallax = engine.cameraY;

  // Central absolute radiance — the One emanates pure light
  const centerX = GAME_WIDTH / 2;
  const centerY = GAME_HEIGHT / 2;
  const corePulse = Math.sin(time * 0.2) * 0.1 + 0.9;

  // Expanding radiance (pure white-gold light)
  for (let r = 180; r > 20; r -= 3) {
    const fade = (180 - r) / 160;
    const grad = ctx.createRadialGradient(centerX, centerY, r - 3, centerX, centerY, r);
    grad.addColorStop(0, `rgba(255,255,200,${0.008 * fade * corePulse})`);
    grad.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(centerX - r, centerY - r, r * 2, r * 2);
  }

  // Blinding core — the unity of all things
  const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
  coreGrad.addColorStop(0, `rgba(255,255,240,${0.2 * corePulse})`);
  coreGrad.addColorStop(0.3, `rgba(255,250,200,${0.1 * corePulse})`);
  coreGrad.addColorStop(1, 'rgba(255,250,200,0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(centerX - 40, centerY - 40, 80, 80);

  // Emanation rays — pure light streaming from the One
  const rayRot = time * 0.03;
  for (let i = 0; i < 16; i++) {
    const ang = rayRot + (i / 16) * Math.PI * 2;
    const pulse = Math.sin(time * 0.4 + i * 0.3) * 0.15 + 0.85;
    const rayLen = 200 + Math.sin(time * 0.3 + i) * 15;
    const grad = ctx.createLinearGradient(
      centerX + Math.cos(ang) * 20,
      centerY + Math.sin(ang) * 20,
      centerX + Math.cos(ang) * rayLen,
      centerY + Math.sin(ang) * rayLen
    );
    grad.addColorStop(0, `rgba(255,255,220,${0.05 * pulse})`);
    grad.addColorStop(0.5, `rgba(255,250,180,${0.02 * pulse})`);
    grad.addColorStop(1, 'rgba(255,250,180,0)');
    ctx.fillStyle = grad;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(ang);
    ctx.fillRect(20, -2, rayLen, 4);
    ctx.restore();
  }

  // Concentric emanation rings — Neoplatonic procession from the One
  for (let i = 0; i < 5; i++) {
    const ringR = 40 + i * 35 + Math.sin(time * 0.5 + i) * 5;
    const pulse = Math.sin(time * 0.3 + i * 0.4) * 0.15 + 0.85;
    ctx.strokeStyle = `rgba(255,250,200,${0.04 * pulse * (1 - i * 0.15)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Pure light particles — ascending sparks of Being
  const p2 = parallax * 0.12;
  for (let i = 0; i < 28; i++) {
    const seed = i * 331 + 27;
    const x = wrap(hash(seed) * GAME_WIDTH - p2, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT - time * 12, GAME_HEIGHT);
    const sway = Math.sin(time * 0.9 + i * 0.4) * 4;
    const pulse = Math.sin(time * 3 + i * 1.1) * 0.4 + 0.6;
    const size = hash(seed + 2) > 0.7 ? 3 : 2;

    px(ctx, x + sway, y, size, size, `rgba(255,255,200,${0.35 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,255,255,${0.25 * pulse})`);
  }

  // Soft warm motes — pure contemplation
  const p3 = parallax * 0.08;
  for (let i = 0; i < 18; i++) {
    const seed = i * 251 + 31;
    const x = wrap(hash(seed) * GAME_WIDTH - p3, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT + time * 3, GAME_HEIGHT);
    const sway = Math.sin(time * 0.7 + i * 0.6) * 6;
    const pulse = Math.sin(time * 1.5 + i * 0.8) * 0.3 + 0.7;

    px(ctx, x + sway, y, 2, 2, `rgba(255,250,220,${0.18 * pulse})`);
    px(ctx, x + sway, y, 1, 1, `rgba(255,255,240,${0.1 * pulse})`);
  }

  // Eternal still points — the unmoved stars of pure Being
  const p4 = parallax * 0.02;
  for (let i = 0; i < 40; i++) {
    const seed = i * 421 + 17;
    const x = wrap(hash(seed) * GAME_WIDTH - p4, GAME_WIDTH);
    const y = wrap(hash(seed + 1) * GAME_HEIGHT, GAME_HEIGHT);
    const twinkle = Math.sin(time * 1.2 + i * 1.5) * 0.4 + 0.5;
    px(ctx, x, y, 1, 1, `rgba(255,255,220,${0.12 + twinkle * 0.18})`);
  }

  // Divine geometry — perfect circles of the absolute (Plotinian henads)
  const p5 = parallax * 0.05;
  for (let i = 0; i < 3; i++) {
    const seed = i * 89 + 33;
    const cx = wrap(hash(seed) * (GAME_WIDTH + 40) - p5, GAME_WIDTH + 40) - 20;
    const cy = hash(seed + 1) * GAME_HEIGHT;
    const pulse = Math.sin(time * 0.25 + i * 1.2) * 0.1 + 0.9;

    // Perfect circle — the henad, a unity
    ctx.strokeStyle = `rgba(255,250,200,${0.05 * pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.stroke();
    // Inner point — the One within each
    ctx.fillStyle = `rgba(255,255,240,${0.08 * pulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
