import type { CharacterCustomization } from './characterTypes';

export function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(255 * percent)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent)));
  const b = Math.max(0, Math.min(255, (num & 0xff) + Math.round(255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function drawEyes(
  ctx: CanvasRenderingContext2D,
  style: string,
  hw: number,
  hh: number,
  t: number,
  facing: number = 0,
) {
  const eyeY = -hh + 8;
  const eyeOffset = facing > 0 ? 2 : facing < 0 ? -2 : 0;

  switch (style) {
    case 'normal':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY, 7, 8);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY, 7, 8);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 2, 4, 5);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 2, 4, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 2, 2, 2);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 2, 2, 2);
      break;
    case 'happy':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 2, 5, 2);
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 3, 7, 2);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 2, 5, 2);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 3, 7, 2);
      break;
    case 'cool':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY + 2, 9, 5);
      ctx.fillRect(hw - 16 + eyeOffset, eyeY + 2, 9, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 3, 3, 1);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 3, 3, 1);
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY + 6, 9, 1);
      ctx.fillRect(hw - 16 + eyeOffset, eyeY + 6, 9, 1);
      break;
    case 'angry':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 1, 7, 7);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 1, 7, 7);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 3, 4, 4);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 3, 4, 4);
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY, 8, 2);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY, 8, 2);
      ctx.fillRect(-hw + 6 + eyeOffset, eyeY + 1, 3, 1);
      ctx.fillRect(hw - 9 + eyeOffset, eyeY + 1, 3, 1);
      break;
    case 'cute':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY + 1, 9, 9);
      ctx.fillRect(hw - 16 + eyeOffset, eyeY + 1, 9, 9);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 2, 7, 7);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 2, 7, 7);
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 5, 5, 3);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 5, 5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 3, 3, 3);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 3, 3, 3);
      ctx.fillRect(-hw + 12 + eyeOffset, eyeY + 6, 2, 2);
      ctx.fillRect(hw - 11 + eyeOffset, eyeY + 6, 2, 2);
      break;
    case 'sleepy':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 4, 7, 2);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 4, 7, 2);
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 5, 5, 1);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 5, 5, 1);
      {
        const zAlpha = Math.sin(t * 2) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(241,245,249,${zAlpha})`;
        ctx.font = 'bold 8px monospace';
        ctx.fillText('z', hw + 2, eyeY - 2);
        ctx.font = 'bold 6px monospace';
        ctx.fillText('z', hw + 6, eyeY - 5);
      }
      break;
    case 'wink':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY, 7, 8);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 2, 4, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 2, 2, 2);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 2, 5, 2);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 3, 7, 2);
      break;
    case 'surprised':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY + 1, 9, 9);
      ctx.fillRect(hw - 16 + eyeOffset, eyeY + 1, 9, 9);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 3, 5, 5);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 3, 5, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 4, 2, 2);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 4, 2, 2);
      break;
    case 'dizzy':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 3, 3, 1);
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 4, 1, 1);
      ctx.fillRect(-hw + 11 + eyeOffset, eyeY + 2, 1, 3);
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 5, 3, 1);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 3, 3, 1);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 4, 1, 1);
      ctx.fillRect(hw - 12 + eyeOffset, eyeY + 2, 1, 3);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 5, 3, 1);
      break;
    case 'determined':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY, 7, 8);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY, 7, 8);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 1, 4, 6);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 1, 4, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 5, 4, 2);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 5, 4, 2);
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY, 8, 1);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY, 8, 1);
      break;
    case 'star':
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY, 7, 8);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY, 7, 8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 1, 5, 6);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 1, 5, 6);
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 2, 3, 4);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 2, 3, 4);
      break;
    case 'heart':
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 1, 3, 2);
      ctx.fillRect(-hw + 12 + eyeOffset, eyeY + 1, 3, 2);
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 3, 7, 2);
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 5, 5, 1);
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 6, 3, 1);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 1, 3, 2);
      ctx.fillRect(hw - 11 + eyeOffset, eyeY + 1, 3, 2);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 3, 7, 2);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 5, 5, 1);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 6, 3, 1);
      break;
    case 'laser':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY, 7, 8);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY, 7, 8);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 3, 3, 2);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 3, 3, 2);
      {
        const flicker = Math.sin(t * 8) * 2;
        ctx.fillStyle = `rgba(239,68,68,${0.5 + flicker * 0.1})`;
        ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 6, 3, 8 + flicker);
        ctx.fillRect(hw - 13 + eyeOffset, eyeY + 6, 3, 8 + flicker);
      }
      break;
    case 'cyber':
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-hw + 7 + eyeOffset, eyeY + 1, 9, 7);
      ctx.fillRect(hw - 16 + eyeOffset, eyeY + 1, 9, 7);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 2, 7, 5);
      ctx.fillRect(hw - 15 + eyeOffset, eyeY + 2, 7, 5);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 3, 2, 3);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 3, 2, 3);
      ctx.fillStyle = 'rgba(6,182,212,0.5)';
      ctx.fillRect(-hw + 12 + eyeOffset, eyeY + 3, 2, 3);
      ctx.fillRect(hw - 11 + eyeOffset, eyeY + 3, 2, 3);
      break;
    case 'cat':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 8 + eyeOffset, eyeY + 1, 6, 8);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 1, 6, 8);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 2, 4, 6);
      ctx.fillRect(hw - 13 + eyeOffset, eyeY + 2, 4, 6);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-hw + 10 + eyeOffset, eyeY + 3, 2, 4);
      ctx.fillRect(hw - 12 + eyeOffset, eyeY + 3, 2, 4);
      break;
    case 'shadow':
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(-hw + 6 + eyeOffset, eyeY, 11, 9);
      ctx.fillRect(hw - 17 + eyeOffset, eyeY, 11, 9);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-hw + 9 + eyeOffset, eyeY + 3, 5, 3);
      ctx.fillRect(hw - 14 + eyeOffset, eyeY + 3, 5, 3);
      break;
  }
}

export function drawMouth(
  ctx: CanvasRenderingContext2D,
  style: string,
  hw: number,
  hh: number,
) {
  const mouthY = -hh + 20;

  switch (style) {
    case 'smile':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-4, mouthY, 8, 3);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(-3, mouthY + 2, 6, 2);
      break;
    case 'neutral':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-4, mouthY + 1, 8, 2);
      break;
    case 'open':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-5, mouthY, 10, 5);
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(-4, mouthY + 1, 8, 3);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(-3, mouthY + 3, 6, 1);
      break;
    case 'frown':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-4, mouthY + 2, 8, 2);
      ctx.fillRect(-3, mouthY + 4, 6, 1);
      ctx.fillRect(-2, mouthY + 5, 4, 1);
      break;
    case 'tongue':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-4, mouthY, 8, 3);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(-3, mouthY + 2, 6, 2);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(-2, mouthY + 4, 4, 3);
      break;
    case 'fangs':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-5, mouthY, 10, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, mouthY + 3, 2, 3);
      ctx.fillRect(2, mouthY + 3, 2, 3);
      break;
    case 'small':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-2, mouthY + 1, 4, 2);
      break;
    case 'wide':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-7, mouthY, 14, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, mouthY + 1, 12, 2);
      break;
    case 'whistle':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-3, mouthY + 1, 6, 2);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(-2, mouthY, 4, 2);
      break;
    case 'zip':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-5, mouthY + 1, 10, 1);
      ctx.fillRect(-3, mouthY + 2, 1, 1);
      ctx.fillRect(-1, mouthY + 2, 1, 1);
      ctx.fillRect(1, mouthY + 2, 1, 1);
      ctx.fillRect(3, mouthY + 2, 1, 1);
      break;
  }
}

export function drawHair(
  ctx: CanvasRenderingContext2D,
  style: string,
  bodyColor: string,
  hw: number,
  hh: number,
) {
  const hairColor = shadeColor(bodyColor, -0.4);

  switch (style) {
    case 'none':
    case 'bald':
      break;
    case 'short':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 6);
      ctx.fillRect(-hw, -hh + 2, 4, 6);
      ctx.fillRect(hw - 4, -hh + 2, 4, 6);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh, hw * 2 - 4, 2);
      break;
    case 'long':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 8);
      ctx.fillRect(-hw - 2, -hh + 2, 4, hh * 2 - 4);
      ctx.fillRect(hw - 2, -hh + 2, 4, hh * 2 - 4);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh, hw * 2 - 4, 3);
      break;
    case 'spiky':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh + 2, hw * 2, 4);
      for (let i = 0; i < 5; i++) {
        const sx = -hw + (i * (hw * 2)) / 4;
        ctx.fillRect(sx, -hh - 3, 3, 5);
      }
      ctx.fillRect(-hw, -hh + 2, 3, 4);
      ctx.fillRect(hw - 3, -hh + 2, 3, 4);
      break;
    case 'mohawk':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-3, -hh - 5, 6, 8);
      ctx.fillRect(-2, -hh - 3, 4, 6);
      ctx.fillStyle = shadeColor(hairColor, 0.2);
      ctx.fillRect(-2, -hh - 5, 2, 6);
      break;
    case 'bun':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 7);
      ctx.fillRect(-hw, -hh + 2, 4, 6);
      ctx.fillRect(hw - 4, -hh + 2, 4, 6);
      ctx.fillRect(-5, -hh - 5, 10, 5);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-3, -hh - 4, 6, 2);
      break;
    case 'afro':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw - 2, -hh - 3, hw * 2 + 4, 7);
      ctx.fillRect(-hw - 3, -hh, 3, 4);
      ctx.fillRect(hw, -hh, 3, 4);
      ctx.fillRect(-hw + 2, -hh - 4, 4, 2);
      ctx.fillRect(hw - 6, -hh - 4, 4, 2);
      ctx.fillRect(-2, -hh - 5, 4, 2);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw, -hh - 1, hw * 2, 2);
      break;
    case 'ponytail':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 7);
      ctx.fillRect(-hw, -hh + 2, 4, 6);
      ctx.fillRect(hw - 4, -hh + 2, 4, 6);
      ctx.fillRect(hw - 1, -hh + 1, 5, 14);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh, hw * 2 - 4, 2);
      break;
    case 'buzz':
      ctx.fillStyle = shadeColor(hairColor, 0.1);
      ctx.fillRect(-hw, -hh + 2, hw * 2, 4);
      ctx.fillRect(-hw, -hh + 4, 3, 3);
      ctx.fillRect(hw - 3, -hh + 4, 3, 3);
      break;
    case 'curly':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw - 1, -hh - 1, hw * 2 + 2, 6);
      ctx.fillRect(-hw - 2, -hh + 1, 3, 4);
      ctx.fillRect(hw - 1, -hh + 1, 3, 4);
      ctx.fillRect(-hw + 2, -hh - 3, 4, 3);
      ctx.fillRect(-hw + 8, -hh - 3, 4, 3);
      ctx.fillRect(hw - 12, -hh - 3, 4, 3);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh - 1, 3, 2);
      ctx.fillRect(hw - 5, -hh - 1, 3, 2);
      break;
    case 'topknot':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 5);
      ctx.fillRect(-hw, -hh + 2, 4, 5);
      ctx.fillRect(hw - 4, -hh + 2, 4, 5);
      ctx.fillRect(-4, -hh - 6, 8, 6);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-2, -hh - 5, 4, 3);
      break;
    case 'undercut':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 5);
      ctx.fillRect(-hw, -hh + 2, 5, 8);
      ctx.fillRect(hw - 5, -hh + 2, 5, 8);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh, hw * 2 - 4, 2);
      break;
    case 'waves':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh, hw * 2, 6);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh + 1, 5, 2);
      ctx.fillRect(-hw + 10, -hh + 1, 5, 2);
      ctx.fillRect(-hw, -hh + 3, 4, 3);
      ctx.fillRect(hw - 4, -hh + 3, 4, 3);
      break;
    case 'messy':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh + 1, hw * 2, 5);
      ctx.fillRect(-hw - 1, -hh - 2, 5, 4);
      ctx.fillRect(-hw + 6, -hh - 3, 4, 4);
      ctx.fillRect(hw - 10, -hh - 2, 4, 3);
      ctx.fillRect(hw - 5, -hh - 3, 5, 4);
      ctx.fillStyle = shadeColor(hairColor, 0.15);
      ctx.fillRect(-hw + 2, -hh + 1, 3, 2);
      break;
    case 'wicked':
      ctx.fillStyle = hairColor;
      ctx.fillRect(-hw, -hh + 2, hw * 2, 5);
      ctx.fillRect(-hw, -hh, 5, 4);
      ctx.fillRect(hw - 5, -hh, 5, 4);
      ctx.fillRect(-hw + 3, -hh - 2, 4, 3);
      ctx.fillRect(hw - 7, -hh - 2, 4, 3);
      ctx.fillStyle = shadeColor(hairColor, 0.2);
      ctx.fillRect(-hw + 4, -hh - 1, 2, 2);
      ctx.fillRect(hw - 6, -hh - 1, 2, 2);
      break;
  }
}

export function drawOutfit(
  ctx: CanvasRenderingContext2D,
  outfit: string,
  color: string,
  hw: number,
  hh: number,
  w: number,
  _h: number,
) {
  const dark = shadeColor(color, -0.25);
  const topY = -hh + 24;

  switch (outfit) {
    case 'none':
      break;
    case 'cape':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, topY, w - 4, 4);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 2, topY + 3, w - 4, 1);
      break;
    case 'hoodie':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillRect(-hw, hh - 12, w, 2);
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 2, topY - 2, w + 4, 4);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 2, topY + 1, w + 4, 1);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 4, hh - 20, w - 8, 5);
      break;
    case 'suit':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-4, topY, 8, hh - topY - 10);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-2, topY + 2, 4, hh - topY - 14);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, 6, 8);
      ctx.fillRect(hw - 6, topY, 6, 8);
      break;
    case 'dress':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 3, hh - 16, w + 6, 6);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 3, hh - 11, w + 6, 1);
      ctx.fillStyle = shadeColor(color, -0.4);
      ctx.fillRect(-hw, topY + 6, w, 2);
      break;
    case 'armor':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillRect(-hw, hh - 12, w, 2);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-hw + 2, topY + 2, 5, 5);
      ctx.fillRect(hw - 7, topY + 2, 5, 5);
      ctx.fillRect(-hw + 2, topY + 8, w - 4, 1);
      ctx.fillRect(-hw + 2, topY + 12, w - 4, 1);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 2, topY - 2, 5, 5);
      ctx.fillRect(hw - 3, topY - 2, 5, 5);
      ctx.fillStyle = shadeColor(color, 0.3);
      ctx.fillRect(-hw - 1, topY - 1, 3, 2);
      ctx.fillRect(hw - 2, topY - 1, 3, 2);
      break;
    case 'vest':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = shadeColor(color, -0.4);
      ctx.fillRect(-2, topY, 4, hh - topY - 10);
      break;
    case 'tank':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, topY + 2, w - 4, hh - topY - 12);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 2, topY + 2, w - 4, 2);
      break;
    case 'jacket':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = shadeColor(color, -0.4);
      ctx.fillRect(-hw, topY, 5, hh - topY - 10);
      ctx.fillRect(hw - 5, topY, 5, hh - topY - 10);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-1, topY, 2, hh - topY - 10);
      break;
    case 'robe':
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 2, topY, w + 4, hh - topY - 8);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 2, topY, w + 4, 2);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-2, topY, 4, hh - topY - 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-hw, topY + 4, w, 2);
      break;
    case 'uniform':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-hw + 3, topY + 2, w - 6, 3);
      ctx.fillStyle = shadeColor(color, -0.4);
      ctx.fillRect(-hw + 4, topY + 5, 3, hh - topY - 15);
      ctx.fillRect(hw - 7, topY + 5, 3, hh - topY - 15);
      break;
    case 'tshirt':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-hw + 4, topY + 4, w - 8, 4);
      break;
    case 'overalls':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = shadeColor(color, -0.4);
      ctx.fillRect(-hw + 2, topY + 2, 4, hh - topY - 12);
      ctx.fillRect(hw - 6, topY + 2, 4, hh - topY - 12);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-hw + 3, topY + 3, 2, 4);
      ctx.fillRect(hw - 5, topY + 3, 2, 4);
      break;
    case 'raincoat':
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 1, topY, w + 2, hh - topY - 8);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 1, topY, w + 2, 2);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-hw, topY + 4, w, 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-hw + 2, topY + 1, w - 4, 1);
      break;
    case 'pajamas':
      ctx.fillStyle = color;
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-hw + 3, topY + 3, 3, 2);
      ctx.fillRect(-hw + 9, topY + 5, 3, 2);
      ctx.fillRect(hw - 8, topY + 4, 3, 2);
      break;
    case 'spiderman':
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-hw, topY, w, hh - topY - 10);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw, topY, w, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-hw + 2, topY + 4, 3, 3);
      ctx.fillRect(hw - 5, topY + 4, 3, 3);
      ctx.fillRect(-hw + 2, topY + 10, w - 4, 1);
      ctx.fillRect(-hw + 2, topY + 14, w - 4, 1);
      ctx.fillRect(-1, topY + 4, 1, 4);
      ctx.fillRect(-1, topY + 12, 1, 4);
      ctx.fillRect(-hw + 4, topY + 8, w - 8, 1);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-hw + 1, topY + 6, 1, 3);
      ctx.fillRect(hw - 2, topY + 6, 1, 3);
      ctx.fillRect(-hw + 5, topY + 2, 1, 3);
      ctx.fillRect(hw - 6, topY + 2, 1, 3);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-3, topY + 8, 2, 2);
      ctx.fillRect(1, topY + 8, 2, 2);
      ctx.fillRect(-3, topY + 12, 2, 1);
      ctx.fillRect(1, topY + 12, 2, 1);
      break;
  }
}

export function drawAccessory(
  ctx: CanvasRenderingContext2D,
  accessory: string,
  color: string,
  hw: number,
  hh: number,
  _t: number,
) {
  const dark = shadeColor(color, -0.3);

  switch (accessory) {
    case 'none':
      break;
    case 'hat':
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 2, -hh - 6, hw * 2 + 4, 5);
      ctx.fillRect(-hw - 5, -hh - 2, hw * 2 + 10, 3);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 5, -hh - 1, hw * 2 + 10, 1);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-hw, -hh - 5, 4, 3);
      break;
    case 'headphones':
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 3, -hh + 2, 4, 8);
      ctx.fillRect(hw - 1, -hh + 2, 4, 8);
      ctx.fillRect(-hw - 1, -hh - 2, hw * 2 + 2, 3);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 3, -hh + 4, 4, 4);
      ctx.fillRect(hw - 1, -hh + 4, 4, 4);
      ctx.fillStyle = shadeColor(color, 0.3);
      ctx.fillRect(-hw - 2, -hh + 5, 2, 2);
      ctx.fillRect(hw, -hh + 5, 2, 2);
      break;
    case 'crown':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, -hh - 4, hw * 2 - 4, 4);
      ctx.fillRect(-hw + 2, -hh - 7, 3, 4);
      ctx.fillRect(-2, -hh - 8, 4, 5);
      ctx.fillRect(hw - 5, -hh - 7, 3, 4);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-1, -hh - 7, 2, 2);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-hw + 3, -hh - 3, 2, 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-1, -hh - 3, 2, 2);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(hw - 4, -hh - 3, 2, 2);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 2, -hh - 1, hw * 2 - 4, 1);
      break;
    case 'glasses':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 6, -hh + 9, 10, 7);
      ctx.fillRect(hw - 16, -hh + 9, 10, 7);
      ctx.fillRect(-hw + 6, -hh + 12, 10, 1);
      ctx.fillRect(hw - 16, -hh + 12, 10, 1);
      ctx.fillRect(-hw + 15, -hh + 11, hw * 2 - 30, 1);
      ctx.fillStyle = shadeColor(color, 0.4);
      ctx.fillRect(-hw + 7, -hh + 10, 3, 2);
      ctx.fillRect(hw - 15, -hh + 10, 3, 2);
      break;
    case 'bandana':
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 1, -hh + 2, hw * 2 + 2, 5);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 1, -hh + 6, hw * 2 + 2, 1);
      ctx.fillStyle = color;
      ctx.fillRect(hw, -hh + 3, 4, 6);
      ctx.fillRect(hw + 2, -hh + 5, 3, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 3, -hh + 3, 2, 2);
      ctx.fillRect(-hw + 8, -hh + 3, 2, 2);
      ctx.fillRect(-hw + 13, -hh + 3, 2, 2);
      break;
    case 'mask':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 5, -hh + 7, hw * 2 - 10, 8);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 5, -hh + 14, hw * 2 - 10, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw + 7, -hh + 9, 8, 4);
      ctx.fillRect(hw - 15, -hh + 9, 8, 4);
      break;
    case 'scarf':
      ctx.fillStyle = color;
      ctx.fillRect(-hw - 1, -hh + 24, hw * 2 + 2, 5);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw - 1, -hh + 28, hw * 2 + 2, 1);
      ctx.fillStyle = color;
      ctx.fillRect(hw - 2, -hh + 26, 5, 10);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-hw + 3, -hh + 25, 3, 2);
      ctx.fillRect(-hw + 10, -hh + 25, 3, 2);
      break;
    case 'visor':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 4, -hh + 8, hw * 2 - 8, 4);
      ctx.fillStyle = shadeColor(color, 0.4);
      ctx.fillRect(-hw + 5, -hh + 9, hw * 2 - 10, 2);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 4, -hh + 11, hw * 2 - 8, 1);
      break;
    case 'halo':
      {
        const glow = Math.sin(_t * 3) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(253,224,71,${glow})`;
        ctx.fillRect(-hw + 2, -hh - 8, hw * 2 - 4, 2);
        ctx.fillRect(-hw + 2, -hh - 7, 2, 1);
        ctx.fillRect(hw - 4, -hh - 7, 2, 1);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-hw + 3, -hh - 7, hw * 2 - 6, 1);
      }
      break;
    case 'horns':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, -hh - 6, 4, 6);
      ctx.fillRect(hw - 6, -hh - 6, 4, 6);
      ctx.fillStyle = dark;
      ctx.fillRect(-hw + 2, -hh - 6, 4, 2);
      ctx.fillRect(hw - 6, -hh - 6, 4, 2);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-hw + 3, -hh - 4, 2, 2);
      ctx.fillRect(hw - 5, -hh - 4, 2, 2);
      break;
    case 'antenna':
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-hw + 4, -hh - 8, 1, 8);
      ctx.fillRect(hw - 5, -hh - 8, 1, 8);
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, -hh - 10, 5, 3);
      ctx.fillRect(hw - 7, -hh - 10, 5, 3);
      ctx.fillStyle = shadeColor(color, 0.4);
      ctx.fillRect(-hw + 3, -hh - 9, 3, 1);
      ctx.fillRect(hw - 6, -hh - 9, 3, 1);
      break;
    case 'eyepatch':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 6, -hh + 7, 10, 8);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-hw + 7, -hh + 8, 8, 6);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-hw + 5, -hh + 10, 2, 2);
      ctx.fillRect(-hw + 16, -hh + 10, 2, 2);
      break;
    case 'mustache':
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-hw + 3, -hh + 18, 6, 2);
      ctx.fillRect(hw - 9, -hh + 18, 6, 2);
      ctx.fillRect(-hw + 5, -hh + 20, 4, 1);
      ctx.fillRect(hw - 9, -hh + 20, 4, 1);
      break;
    case 'feather':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, -hh - 8, 3, 10);
      ctx.fillRect(-hw + 5, -hh - 6, 3, 6);
      ctx.fillStyle = shadeColor(color, 0.2);
      ctx.fillRect(-hw + 3, -hh - 7, 1, 5);
      break;
    case 'flower':
      ctx.fillStyle = color;
      ctx.fillRect(-hw + 2, -hh - 6, 3, 3);
      ctx.fillRect(-hw + 5, -hh - 5, 3, 3);
      ctx.fillRect(-hw + 3, -hh - 3, 3, 3);
      ctx.fillRect(-hw + 6, -hh - 2, 3, 3);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-hw + 4, -hh - 4, 3, 3);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-hw + 4, -hh - 1, 1, 4);
      break;
  }
}

export function drawCharacterBody(
  ctx: CanvasRenderingContext2D,
  customization: CharacterCustomization,
  w: number,
  h: number,
  t: number,
  facing: number = 0,
) {
  const hw = w / 2;
  const hh = h / 2;

  const bodyColor = customization.bodyColor;
  const darkColor = shadeColor(bodyColor, -0.3);
  const lightColor = shadeColor(bodyColor, 0.25);

  if (customization.outfit === 'cape') {
    const capeTop = -hh + 24;
    ctx.fillStyle = customization.outfitColor;
    ctx.fillRect(-hw - 3, capeTop, 6, h - 28);
    ctx.fillRect(hw - 3, capeTop, 6, h - 28);
    ctx.fillStyle = shadeColor(customization.outfitColor, -0.2);
    ctx.fillRect(-hw - 3, hh - 6, 6, 4);
    ctx.fillRect(hw - 3, hh - 6, 6, 4);
  }

  ctx.fillStyle = darkColor;
  ctx.fillRect(-hw + 2, -hh + 4, w - 4, h - 4);

  ctx.fillStyle = bodyColor;
  ctx.fillRect(-hw, -hh, w, h - 2);

  ctx.fillStyle = lightColor;
  ctx.fillRect(-hw + 2, -hh + 2, w - 4, 3);
  ctx.fillRect(-hw + 2, -hh + 2, 3, h - 6);

  ctx.fillStyle = darkColor;
  ctx.fillRect(-hw, hh - 4, w, 4);

  if (customization.outfit === 'spiderman') {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-hw, -hh, w, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-hw + 4, -hh + 2, 3, 2);
    ctx.fillRect(hw - 7, -hh + 2, 3, 2);
    ctx.fillRect(-hw + 2, -hh + 5, 2, 1);
    ctx.fillRect(hw - 4, -hh + 5, 2, 1);
  } else {
    drawHair(ctx, customization.hairStyle, customization.bodyColor, hw, hh);
  }

  if (customization.outfit === 'spiderman') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-hw + 7, -hh + 7, 9, 8);
    ctx.fillRect(hw - 16, -hh + 7, 9, 8);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-hw + 9, -hh + 9, 5, 5);
    ctx.fillRect(hw - 14, -hh + 9, 5, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-hw + 10, -hh + 10, 3, 3);
    ctx.fillRect(hw - 13, -hh + 10, 3, 3);
  } else {
    drawEyes(ctx, customization.eyeStyle, hw, hh, t, facing);
  }

  if (customization.outfit === 'spiderman') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, -hh + 20, 6, 2);
  } else {
    drawMouth(ctx, customization.mouthStyle, hw, hh);
  }

  ctx.fillStyle = '#fb7185';
  ctx.fillRect(-hw + 4, -hh + 18, 4, 3);
  ctx.fillRect(hw - 8, -hh + 18, 4, 3);

  ctx.fillStyle = darkColor;
  ctx.fillRect(-hw + 4, hh - 8, 8, 6);
  ctx.fillRect(hw - 12, hh - 8, 8, 6);
  ctx.fillStyle = lightColor;
  ctx.fillRect(-hw + 5, hh - 7, 3, 2);
  ctx.fillRect(hw - 11, hh - 7, 3, 2);

  drawOutfit(ctx, customization.outfit, customization.outfitColor, hw, hh, w, h);

  drawAccessory(ctx, customization.accessory, customization.accessoryColor, hw, hh, t);
}
