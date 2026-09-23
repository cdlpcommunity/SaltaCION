type SoundName = 'jump' | 'spring' | 'break' | 'coin' | 'powerup' | 'hit' | 'gameover' | 'start' | 'jetpack' | 'propeller' | 'rouletteTick' | 'rouletteSpin' | 'rouletteWin';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.3;
    }
  }

  isMuted() {
    return this.muted;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.5, slideTo?: number) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume = 0.3, filterFreq = 1000) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start();
  }

  play(name: SoundName) {
    switch (name) {
      case 'jump':
        this.playTone(400, 0.12, 'square', 0.3, 600);
        break;
      case 'spring':
        this.playTone(300, 0.25, 'square', 0.4, 1200);
        setTimeout(() => this.playTone(800, 0.15, 'square', 0.3, 1400), 80);
        break;
      case 'break':
        this.playNoise(0.2, 0.25, 800);
        this.playTone(200, 0.15, 'sawtooth', 0.2, 80);
        break;
      case 'coin':
        this.playTone(880, 0.08, 'square', 0.3);
        setTimeout(() => this.playTone(1320, 0.12, 'square', 0.25), 60);
        break;
      case 'powerup':
        this.playTone(523, 0.1, 'square', 0.3);
        setTimeout(() => this.playTone(659, 0.1, 'square', 0.3), 80);
        setTimeout(() => this.playTone(784, 0.15, 'square', 0.3), 160);
        break;
      case 'hit':
        this.playNoise(0.15, 0.35, 400);
        this.playTone(150, 0.2, 'sawtooth', 0.3, 50);
        break;
      case 'gameover':
        this.playTone(440, 0.2, 'square', 0.3, 220);
        setTimeout(() => this.playTone(220, 0.3, 'square', 0.3, 110), 200);
        setTimeout(() => this.playTone(110, 0.5, 'square', 0.3, 55), 500);
        break;
      case 'start':
        this.playTone(523, 0.1, 'square', 0.3);
        setTimeout(() => this.playTone(659, 0.1, 'square', 0.3), 100);
        setTimeout(() => this.playTone(784, 0.1, 'square', 0.3), 200);
        setTimeout(() => this.playTone(1047, 0.2, 'square', 0.3), 300);
        break;
      case 'jetpack':
        this.playNoise(0.3, 0.15, 2000);
        this.playTone(100, 0.3, 'sawtooth', 0.15, 200);
        break;
      case 'propeller':
        this.playTone(200, 0.15, 'square', 0.15, 400);
        break;
      case 'rouletteTick':
        this.playTone(1200, 0.04, 'square', 0.2);
        break;
      case 'rouletteSpin':
        this.playTone(300, 0.08, 'sawtooth', 0.15, 600);
        break;
      case 'rouletteWin':
        this.playTone(523, 0.1, 'square', 0.3);
        setTimeout(() => this.playTone(659, 0.1, 'square', 0.3), 100);
        setTimeout(() => this.playTone(784, 0.1, 'square', 0.3), 200);
        setTimeout(() => this.playTone(1047, 0.25, 'square', 0.3), 300);
        break;
    }
  }
}

export const soundManager = new SoundManager();
