import {
  GRAVITY, JUMP_VELOCITY, SPRING_VELOCITY, JETPACK_VELOCITY, PROPELLER_VELOCITY,
  MOVE_ACCEL, MOVE_MAX, FRICTION, AIR_FRICTION,
  PLAYER_WIDTH, PLAYER_HEIGHT, PLATFORM_WIDTH, PLATFORM_HEIGHT,
  MOVING_PLATFORM_WIDTH, PLATFORM_SPACING_MIN, PLATFORM_SPACING_MAX,
  HEIGHT_SCORE_DIVISOR, GAME_WIDTH, GAME_HEIGHT, ROULETTE_COST,
} from './constants';
import type { Platform, Player, Particle, PowerUpType, Enemy, Coin, PlatformType, GameSnapshot, GameState } from './types';
import { soundManager } from './sound';
import { getZoneByHeight, getZoneIndex, ZONES, type ZonePalette } from './zones';

let platformIdCounter = 0;
let enemyIdCounter = 0;

export class GameEngine {
  state: GameState = 'menu';
  player: Player;
  platforms: Platform[] = [];
  particles: Particle[] = [];
  powerups: PowerUpType[] = [];
  enemies: Enemy[] = [];
  coins: Coin[] = [];

  score = 0;
  coinCount = 0;
  maxHeight = 0;
  lives = 1;
  cameraY = 0;
  highestPlatformY = 0;
  shake = 0;
  flash = 0;
  flashColor = '#ffffff';
  bgOffset = 0;
  bgParticles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string }[] = [];
  bgParticleTimer = 0;
  currentZone: ZonePalette = ZONES[0];
  currentZoneIndex = 0;
  zoneTransition = 0;
  zoneTransitionTimer = 0;
  zoneAnnouncement = 0;

  rouletteReady = false;
  isZoneTest = false;
  inputLeft = false;
  inputRight = false;
  inputJump = false;

  private lastTime = 0;
  private accumulator = 0;
  private readonly dt = 1 / 60;
  private rafId = 0;
  private onStateChange?: (snapshot: GameSnapshot) => void;

  constructor() {
    this.player = this.createPlayer();
    this.initBackground();
  }

  setOnStateChange(cb: (snapshot: GameSnapshot) => void) {
    this.onStateChange = cb;
  }

  private createPlayer(): Player {
    return {
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - 120,
      vx: 0,
      vy: 0,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      facing: 1,
      squash: 0,
      stretch: 0,
      rotation: 0,
      invulnerable: 0,
      jetpackFuel: 0,
      propellerFuel: 0,
      hitFlash: 0,
      trail: [],
    };
  }

  private initBackground() {
    this.bgParticles = [];
    this.bgParticleTimer = 0;
  }

  startGame() {
    this.state = 'playing';
    this.player = this.createPlayer();
    this.platforms = [];
    this.particles = [];
    this.powerups = [];
    this.enemies = [];
    this.coins = [];
    this.score = 0;
    this.coinCount = 0;
    this.rouletteReady = false;
    this.isZoneTest = false;
    this.maxHeight = 0;
    this.lives = 1;
    this.cameraY = 0;
    this.shake = 0;
    this.flash = 0;
    this.currentZone = ZONES[0];
    this.currentZoneIndex = 0;
    this.zoneTransition = 0;
    this.zoneTransitionTimer = 0;
    this.zoneAnnouncement = 0;
    this.lastSnapKey = '';
    platformIdCounter = 0;
    enemyIdCounter = 0;
    this.inputLeft = false;
    this.inputRight = false;

    this.generateInitialPlatforms();
    soundManager.play('start');
    this.emitState();
  }

  startZoneTest(zoneIndex: number) {
    const zone = ZONES[zoneIndex];
    if (!zone) return;

    this.startGame();
    this.isZoneTest = true;
    this.maxHeight = zone.heightThreshold;
    this.currentZoneIndex = zoneIndex;
    this.currentZone = zone;
    this.zoneTransition = 0;
    this.zoneTransitionTimer = 0;
    this.zoneAnnouncement = 0;
    this.lastSnapKey = '';
    this.inputLeft = false;
    this.inputRight = false;
    this.emitState();
  }

  pauseGame() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.emitState();
    }
  }

  resumeGame() {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.emitState();
    }
  }

  goToMenu() {
    this.state = 'menu';
    this.player = this.createPlayer();
    this.platforms = [];
    this.particles = [];
    this.powerups = [];
    this.enemies = [];
    this.coins = [];
    this.score = 0;
    this.coinCount = 0;
    this.rouletteReady = false;
    this.isZoneTest = false;
    this.maxHeight = 0;
    this.cameraY = 0;
    this.shake = 0;
    this.flash = 0;
    this.currentZone = ZONES[0];
    this.currentZoneIndex = 0;
    this.zoneTransition = 0;
    this.zoneTransitionTimer = 0;
    this.zoneAnnouncement = 0;
    this.inputLeft = false;
    this.inputRight = false;
    this.emitState();
  }

  private generateInitialPlatforms() {
    const basePlatform: Platform = {
      id: platformIdCounter++,
      x: GAME_WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: GAME_HEIGHT - 50,
      width: PLATFORM_WIDTH,
      height: PLATFORM_HEIGHT,
      type: 'normal',
      vx: 0,
      broken: false,
      breakTimer: 0,
      breakDelay: 0,
      springCompressed: 0,
      hasCoin: false,
      coinAngle: 0,
      iceSlip: false,
      wobble: 0,
    };
    this.platforms.push(basePlatform);

    let y = GAME_HEIGHT - 50;
    while (y > -200) {
      y -= Math.random() * (PLATFORM_SPACING_MAX - PLATFORM_SPACING_MIN) + PLATFORM_SPACING_MIN;
      this.spawnPlatform(y);
    }
    this.highestPlatformY = y;
  }

  private spawnPlatform(y: number) {
    const difficulty = Math.min(this.maxHeight / 5000, 1);
    const r = Math.random();
    let type: PlatformType = 'normal';

    if (r < 0.04 + difficulty * 0.06) type = 'spring';
    else if (r < 0.12 + difficulty * 0.08) type = 'moving';
    else if (r < 0.20 + difficulty * 0.12) type = 'breakable';
    else if (r < 0.26 + difficulty * 0.04) type = 'cloud';
    else if (r < 0.30 + difficulty * 0.06) type = 'ice';
    else type = 'normal';

    const width = type === 'moving' ? MOVING_PLATFORM_WIDTH : PLATFORM_WIDTH;
    const x = Math.random() * (GAME_WIDTH - width);

    const platform: Platform = {
      id: platformIdCounter++,
      x,
      y,
      width,
      height: PLATFORM_HEIGHT,
      type,
      vx: type === 'moving' ? (Math.random() < 0.5 ? -1.5 : 1.5) * (1 + difficulty) : 0,
      broken: false,
      breakTimer: 0,
      breakDelay: 0,
      springCompressed: 0,
      hasCoin: Math.random() < 0.15,
      coinAngle: 0,
      iceSlip: type === 'ice',
      wobble: 0,
    };
    this.platforms.push(platform);

    if (platform.hasCoin) {
      this.coins.push({
        x: platform.x + platform.width / 2,
        y: platform.y - 28,
        collected: false,
        angle: 0,
        bob: Math.random() * Math.PI * 2,
      });
    }

    if (Math.random() < 0.02 + difficulty * 0.03) {
      const types: PowerUpType['type'][] = ['jetpack', 'propeller', 'spring_shoes', 'shield'];
      const pType = types[Math.floor(Math.random() * types.length)];
      this.powerups.push({
        type: pType,
        x: platform.x + platform.width / 2 - 14,
        y: platform.y - 36,
        width: 28,
        height: 28,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    if (Math.random() < 0.015 + difficulty * 0.04) {
      this.enemies.push({
        id: enemyIdCounter++,
        x: Math.random() * (GAME_WIDTH - 40),
        y: y - 60,
        width: 36,
        height: 36,
        vx: (Math.random() < 0.5 ? -1 : 1) * (1 + difficulty * 0.5),
        type: Math.random() < 0.5 ? 'flyer' : 'walker',
        alive: true,
        deathTimer: 0,
        wobble: 0,
      });
    }
  }

  private lastSnapKey = '';

  private emitState() {
    if (!this.onStateChange) return;
    const snap: GameSnapshot = {
      state: this.state,
      score: this.score,
      coins: this.coinCount,
      height: Math.floor(this.maxHeight),
      lives: this.lives,
      hasJetpack: this.player.jetpackFuel > 0,
      hasPropeller: this.player.propellerFuel > 0,
      hasShield: this.player.invulnerable > 0,
      hasSpringShoes: this.player.jetpackFuel === 0 && this.player.propellerFuel === 0,
      jetpackFuel: this.player.jetpackFuel,
      propellerFuel: this.player.propellerFuel,
      zone: this.currentZone.id,
      zoneName: this.currentZone.name,
      zoneSubtitle: this.currentZone.subtitle,
      rouletteReady: this.rouletteReady,
      isZoneTest: this.isZoneTest,
    };
    const key = `${snap.state}|${snap.score}|${snap.coins}|${snap.height}|${snap.lives}|${snap.hasJetpack}|${snap.hasPropeller}|${snap.hasShield}|${snap.hasSpringShoes}|${snap.jetpackFuel.toFixed(3)}|${snap.propellerFuel.toFixed(3)}|${snap.zone}|${snap.rouletteReady}|${snap.isZoneTest}`;
    if (key === this.lastSnapKey) return;
    this.lastSnapKey = key;
    this.onStateChange(snap);
  }

  start() {
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }

  private loop = () => {
    const now = performance.now();
    let frameTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (frameTime > 0.25) frameTime = 0.25;
    this.accumulator += frameTime;
    while (this.accumulator >= this.dt) {
      this.update(this.dt);
      this.accumulator -= this.dt;
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.bgOffset += dt * 10;

    this.bgParticleTimer -= dt;
    if (this.bgParticleTimer <= 0) {
      this.bgParticles.push({
        x: Math.random() * GAME_WIDTH,
        y: GAME_HEIGHT + 5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.15),
        life: 6 + Math.random() * 4,
        maxLife: 10,
        size: Math.random() < 0.5 ? 1 : 2,
        color: Math.random() < 0.3 ? this.currentZone.particleColor : Math.random() < 0.5 ? this.currentZone.particleColor2 : '#f1f5f9',
      });
      this.bgParticleTimer = 0.3 + Math.random() * 0.5;
    }
    for (const bp of this.bgParticles) {
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.life -= dt;
    }
    this.bgParticles = this.bgParticles.filter(p => p.life > 0 && p.y > -10);

    if (this.shake > 0) this.shake *= 0.9;
    if (this.flash > 0) this.flash -= dt * 3;

    if (this.state !== 'playing') return;

    this.updatePlayer(dt);
    this.updatePlatforms(dt);
    this.updateEnemies(dt);
    this.updatePowerups(dt);
    this.updateCoins(dt);
    this.updateParticles(dt);
    this.updateCamera();
    this.checkZoneTransition();
    this.checkCollisions();
    this.cleanup();
    this.emitState();
  }

  private updatePlayer(dt: number) {
    const p = this.player;

    if (p.invulnerable > 0) p.invulnerable -= dt;
    if (p.hitFlash > 0) p.hitFlash -= dt * 3;

    let accel = MOVE_ACCEL;
    let maxSpeed = MOVE_MAX;
    let fric = p.vy < 0 ? AIR_FRICTION : FRICTION;

    if (p.jetpackFuel > 0) {
      p.vy = JETPACK_VELOCITY;
      p.jetpackFuel -= dt;
      if (p.jetpackFuel <= 0) {
        p.jetpackFuel = 0;
      }
      this.spawnJetpackParticles();
      if (Math.random() < 0.3) soundManager.play('jetpack');
    } else if (p.propellerFuel > 0) {
      p.vy = Math.min(p.vy + GRAVITY * 0.3, PROPELLER_VELOCITY);
      p.propellerFuel -= dt;
      if (p.propellerFuel <= 0) {
        p.propellerFuel = 0;
      }
      this.spawnPropellerParticles();
      if (Math.random() < 0.15) soundManager.play('propeller');
    } else {
      p.vy += GRAVITY;
    }

    if (this.inputLeft) {
      p.vx -= accel;
      p.facing = -1;
    }
    if (this.inputRight) {
      p.vx += accel;
      p.facing = 1;
    }
    if (!this.inputLeft && !this.inputRight) {
      p.vx *= fric;
    }
    p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));

    p.x += p.vx;
    p.y += p.vy;

    if (p.x + p.width < 0) p.x = GAME_WIDTH;
    if (p.x > GAME_WIDTH) p.x = -p.width;

    p.rotation = p.vx * 0.03;

    if (p.vy < 0) {
      p.stretch = Math.min(0.3, Math.abs(p.vy) * 0.02);
      p.squash = 0;
    } else {
      p.squash = Math.min(0.2, p.vy * 0.01);
      p.stretch = 0;
    }

    p.trail.push({ x: p.x + p.width / 2, y: p.y + p.height / 2, life: 1 });
    if (p.trail.length > 8) p.trail.shift();
    for (const t of p.trail) t.life -= dt * 3;
    p.trail = p.trail.filter(t => t.life > 0);

    const heightFromStart = GAME_HEIGHT - 120 - p.y;
    if (heightFromStart > this.maxHeight) {
      this.maxHeight = heightFromStart;
      this.score = Math.floor(this.maxHeight / HEIGHT_SCORE_DIVISOR);
    }

    if (p.y > this.cameraY + GAME_HEIGHT + 50) {
      this.fallOffScreen();
    }
  }

  private updatePlatforms(dt: number) {
    for (const plat of this.platforms) {
      if (plat.type === 'moving') {
        plat.x += plat.vx;
        if (plat.x <= 0) { plat.x = 0; plat.vx *= -1; }
        if (plat.x + plat.width >= GAME_WIDTH) { plat.x = GAME_WIDTH - plat.width; plat.vx *= -1; }
        plat.wobble = Math.sin(performance.now() * 0.003) * 1;
      }
      if (plat.type === 'cloud') {
        plat.wobble = Math.sin(performance.now() * 0.002 + plat.id) * 2;
      }
      if (plat.broken) {
        if (plat.breakDelay > 0) {
          plat.breakDelay -= dt;
        } else {
          plat.breakTimer += dt;
          plat.y += plat.breakTimer * 80;
        }
      }
      if (plat.springCompressed > 0) {
        plat.springCompressed -= dt * 4;
      }
    }
  }

  private updateEnemies(dt: number) {
    for (const e of this.enemies) {
      if (!e.alive) {
        e.deathTimer += dt;
        continue;
      }
      e.wobble += dt * 3;
      if (e.type === 'walker') {
        e.x += e.vx;
        if (e.x <= 0 || e.x + e.width >= GAME_WIDTH) e.vx *= -1;
      } else {
        e.x += e.vx;
        e.y += Math.sin(e.wobble) * 0.5;
        if (e.x <= 0 || e.x + e.width >= GAME_WIDTH) e.vx *= -1;
      }
    }
  }

  private updatePowerups(dt: number) {
    for (const pu of this.powerups) {
      pu.bobOffset += dt * 2;
    }
  }

  private updateCoins(dt: number) {
    for (const c of this.coins) {
      c.angle += dt * 4;
      c.bob += dt * 2;
    }
  }

  private updateParticles(dt: number) {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);
    if (this.particles.length > 200) {
      this.particles = this.particles.slice(-200);
    }
  }

  private updateCamera() {
    const target = this.player.y - GAME_HEIGHT * 0.4;
    if (target < this.cameraY) {
      this.cameraY = target;
    }
  }

  private checkZoneTransition() {
    const newIdx = getZoneIndex(this.maxHeight);
    if (newIdx !== this.currentZoneIndex) {
      this.currentZoneIndex = newIdx;
      this.currentZone = ZONES[newIdx];
      this.zoneTransition = 1;
      this.zoneTransitionTimer = 1.5;
      this.zoneAnnouncement = 3;
      this.flash = 0.6;
      this.flashColor = newIdx === 1 ? '#ff6600' : newIdx === 2 ? '#cc8833' : '#ffffff';
      this.shake = 8;
      soundManager.play('powerup');
    }
    if (this.zoneTransitionTimer > 0) {
      this.zoneTransitionTimer -= 1 / 60;
      this.zoneTransition = Math.max(0, this.zoneTransitionTimer / 1.5);
    }
    if (this.zoneAnnouncement > 0) {
      this.zoneAnnouncement -= 1 / 60;
    }
  }

  private checkCollisions() {
    const p = this.player;

    if (p.vy > 0) {
      for (const plat of this.platforms) {
        if (plat.broken) continue;
        const playerBottom = p.y + p.height;
        const playerRight = p.x + p.width;
        if (
          playerBottom >= plat.y &&
          playerBottom <= plat.y + plat.height + 8 &&
          playerRight > plat.x + 4 &&
          p.x < plat.x + plat.width - 4
        ) {
          this.onPlatformLand(plat);
          break;
        }
      }
    }

    for (const c of this.coins) {
      if (c.collected) continue;
      const dx = p.x + p.width / 2 - c.x;
      const dy = p.y + p.height / 2 - c.y;
      if (dx * dx + dy * dy < 30 * 30) {
        c.collected = true;
        this.coinCount++;
        if (this.coinCount >= ROULETTE_COST) {
          this.rouletteReady = true;
        }
        this.score = Math.floor(this.maxHeight / HEIGHT_SCORE_DIVISOR);
        soundManager.play('coin');
        this.spawnCoinParticles(c.x, c.y);
      }
    }

    for (const pu of this.powerups) {
      if (pu.collected) continue;
      const dx = p.x + p.width / 2 - (pu.x + pu.width / 2);
      const dy = p.y + p.height / 2 - (pu.y + pu.height / 2);
      if (Math.abs(dx) < (p.width + pu.width) / 2 && Math.abs(dy) < (p.height + pu.height) / 2) {
        pu.collected = true;
        this.collectPowerup(pu.type);
      }
    }

    for (const e of this.enemies) {
      if (!e.alive) continue;
      const dx = p.x + p.width / 2 - (e.x + e.width / 2);
      const dy = p.y + p.height / 2 - (e.y + e.height / 2);
      if (Math.abs(dx) < (p.width + e.width) / 2 - 4 && Math.abs(dy) < (p.height + e.height) / 2 - 4) {
        if (p.vy > 0 && p.y + p.height < e.y + e.height / 2) {
          e.alive = false;
          p.vy = JUMP_VELOCITY * 0.8;
          soundManager.play('hit');
          this.spawnEnemyDeathParticles(e.x + e.width / 2, e.y + e.height / 2);
          this.shake = 6;
          this.coinCount++;
          if (this.coinCount >= ROULETTE_COST) {
            this.rouletteReady = true;
          }
          this.score = Math.floor(this.maxHeight / HEIGHT_SCORE_DIVISOR);
          this.spawnCoinParticles(e.x + e.width / 2, e.y);
        } else if (p.invulnerable <= 0 && p.jetpackFuel <= 0 && p.propellerFuel <= 0) {
          this.hitPlayer();
        }
      }
    }
  }

  private onPlatformLand(plat: Platform) {
    const p = this.player;

    if (plat.type === 'breakable') {
      plat.broken = true;
      plat.breakDelay = 0.15;
      p.y = plat.y - p.height;
      p.vy = JUMP_VELOCITY;
      soundManager.play('break');
      this.spawnBreakParticles(plat.x + plat.width / 2, plat.y);
      p.squash = 0.3;
      p.stretch = 0;
      return;
    }

    if (plat.type === 'spring') {
      p.vy = SPRING_VELOCITY;
      plat.springCompressed = 1;
      soundManager.play('spring');
      this.spawnSpringParticles(plat.x + plat.width / 2, plat.y);
      this.shake = 3;
    } else if (plat.type === 'ice') {
      p.vy = JUMP_VELOCITY * 0.9;
      p.vx *= 1.3;
      soundManager.play('jump');
      this.spawnIceParticles(plat.x + plat.width / 2, plat.y);
    } else if (plat.type === 'cloud') {
      p.vy = JUMP_VELOCITY * 0.85;
      soundManager.play('jump');
      this.spawnCloudParticles(plat.x + plat.width / 2, plat.y);
    } else {
      p.vy = JUMP_VELOCITY;
      soundManager.play('jump');
      this.spawnJumpParticles(p.x + p.width / 2, p.y + p.height);
    }

    p.squash = 0.3;
    p.stretch = 0;
  }

  private collectPowerup(type: PowerUpType['type']) {
    const p = this.player;
    soundManager.play('powerup');
    this.flash = 0.5;
    this.flashColor = '#ffffff';

    switch (type) {
      case 'jetpack':
        p.jetpackFuel = 3;
        p.vy = JETPACK_VELOCITY;
        break;
      case 'propeller':
        p.propellerFuel = 4;
        break;
      case 'shield':
        p.invulnerable = 5;
        break;
      case 'spring_shoes':
        p.vy = SPRING_VELOCITY * 0.7;
        break;
      case 'extra_life':
        this.lives++;
        break;
    }
    this.spawnPowerupParticles(p.x + p.width / 2, p.y + p.height / 2);
  }

  private hitPlayer() {
    const p = this.player;
    if (p.invulnerable > 0) return;

    this.lives--;
    p.hitFlash = 1;
    p.invulnerable = 1.5;
    soundManager.play('hit');
    this.shake = 10;
    this.flash = 0.4;
    this.flashColor = '#ef4444';
    this.spawnHitParticles(p.x + p.width / 2, p.y + p.height / 2);

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      p.vy = JUMP_VELOCITY;
    }
  }

  private fallOffScreen() {
    const p = this.player;
    if (this.lives > 1) {
      this.lives--;
      p.hitFlash = 1;
      p.invulnerable = 2;
      p.vy = JUMP_VELOCITY;
      p.vx = 0;
      p.x = GAME_WIDTH / 2 - p.width / 2;
      p.y = this.cameraY + GAME_HEIGHT - 120;
      soundManager.play('hit');
      this.shake = 10;
      this.flash = 0.4;
      this.flashColor = '#ef4444';
      this.spawnHitParticles(p.x + p.width / 2, p.y + p.height / 2);
      this.emitState();
    } else {
      this.gameOver();
    }
  }

  private gameOver() {
    this.state = 'gameover';
    soundManager.play('gameover');
    this.emitState();
  }

  private cleanup() {
    const cullY = this.cameraY + GAME_HEIGHT + 100;
    this.platforms = this.platforms.filter(p => p.y < cullY && !(p.broken && p.breakDelay <= 0 && p.breakTimer > 1));
    this.enemies = this.enemies.filter(e => e.y < cullY && (!e.alive ? e.deathTimer < 0.5 : true));
    this.coins = this.coins.filter(c => c.y < cullY && !c.collected);
    this.powerups = this.powerups.filter(pu => pu.y < cullY && !pu.collected);

    while (this.highestPlatformY > this.cameraY - 200) {
      this.highestPlatformY -= Math.random() * (PLATFORM_SPACING_MAX - PLATFORM_SPACING_MIN) + PLATFORM_SPACING_MIN;
      this.spawnPlatform(this.highestPlatformY);
    }
  }

  private spawnJumpParticles(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        life: 0.4, maxLife: 0.4,
        color: '#ffffff',
        size: Math.random() * 3 + 1,
        gravity: 0.1,
        shape: 'circle',
      });
    }
  }

  private spawnBreakParticles(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 1,
        life: 0.6, maxLife: 0.6,
        color: '#fbbf24',
        size: Math.random() * 4 + 2,
        gravity: 0.2,
        shape: 'square',
      });
    }
  }

  private spawnSpringParticles(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 3 - 1,
        life: 0.5, maxLife: 0.5,
        color: '#f472b6',
        size: Math.random() * 3 + 2,
        gravity: 0.15,
        shape: 'star',
      });
    }
  }

  private spawnIceParticles(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2,
        life: 0.5, maxLife: 0.5,
        color: '#67e8f9',
        size: Math.random() * 3 + 1,
        gravity: 0.1,
        shape: 'spark',
      });
    }
  }

  private spawnCloudParticles(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1.5,
        life: 0.6, maxLife: 0.6,
        color: '#e0e7ff',
        size: Math.random() * 5 + 3,
        gravity: -0.02,
        shape: 'circle',
      });
    }
  }

  private spawnCoinParticles(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 4 - 1,
        life: 0.5, maxLife: 0.5,
        color: '#fcd34d',
        size: Math.random() * 3 + 2,
        gravity: 0.15,
        shape: 'star',
      });
    }
  }

  private spawnPowerupParticles(x: number, y: number) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * 4,
        vy: Math.sin(angle) * 4,
        life: 0.6, maxLife: 0.6,
        color: i % 2 === 0 ? '#67e8f9' : '#fbbf24',
        size: 3,
        gravity: 0,
        shape: 'star',
      });
    }
  }

  private spawnHitParticles(x: number, y: number) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 0.5, maxLife: 0.5,
        color: '#ef4444',
        size: Math.random() * 4 + 2,
        gravity: 0.1,
        shape: 'circle',
      });
    }
  }

  private spawnEnemyDeathParticles(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 0.5, maxLife: 0.5,
        color: '#ef4444',
        size: Math.random() * 4 + 2,
        gravity: 0.15,
        shape: 'square',
      });
    }
  }

  private spawnJetpackParticles() {
    const p = this.player;
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: p.x + p.width / 2 + (Math.random() - 0.5) * 10,
        y: p.y + p.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        life: 0.3, maxLife: 0.3,
        color: Math.random() < 0.5 ? '#fb923c' : '#fcd34d',
        size: Math.random() * 4 + 2,
        gravity: 0,
        shape: 'circle',
      });
    }
  }

  private spawnPropellerParticles() {
    const p = this.player;
    this.particles.push({
      x: p.x + p.width / 2 + (Math.random() - 0.5) * 20,
      y: p.y - 5,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1,
      life: 0.3, maxLife: 0.3,
      color: '#5eead4',
      size: Math.random() * 3 + 1,
      gravity: 0.05,
      shape: 'circle',
    });
  }

  pauseForRoulette() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.emitState();
    }
  }

  spinRoulette(result: PowerUpType['type']): void {
    this.coinCount -= ROULETTE_COST;
    this.rouletteReady = this.coinCount >= ROULETTE_COST;
    this.collectPowerup(result);
    this.emitState();
  }

  getSnapshot(): GameSnapshot {
    return {
      state: this.state,
      score: this.score,
      coins: this.coinCount,
      height: Math.floor(this.maxHeight),
      lives: this.lives,
      hasJetpack: this.player.jetpackFuel > 0,
      hasPropeller: this.player.propellerFuel > 0,
      hasShield: this.player.invulnerable > 0,
      hasSpringShoes: false,
      jetpackFuel: this.player.jetpackFuel,
      propellerFuel: this.player.propellerFuel,
      zone: this.currentZone.id,
      zoneName: this.currentZone.name,
      zoneSubtitle: this.currentZone.subtitle,
      rouletteReady: this.rouletteReady,
      isZoneTest: this.isZoneTest,
    };
  }
}
