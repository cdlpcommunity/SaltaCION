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
      const zAlpha = Math.sin(t * 2) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(241,245,249,${zAlpha})`;
      ctx.font = 'bold 8px monospace';
      ctx.fillText('z', hw + 2, eyeY - 2);
      ctx.font = 'bold 6px monospace';
      ctx.fillText('z', hw + 6, eyeY - 5);
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

  drawHair(ctx, customization.hairStyle, customization.bodyColor, hw, hh);

  drawEyes(ctx, customization.eyeStyle, hw, hh, t, facing);

  ctx.fillStyle = '#fb7185';
  ctx.fillRect(-hw + 4, -hh + 18, 4, 3);
  ctx.fillRect(hw - 8, -hh + 18, 4, 3);

  ctx.fillStyle = darkColor;
  ctx.fillRect(-4, -hh + 20, 8, 3);
  ctx.fillStyle = '#fb7185';
  ctx.fillRect(-3, -hh + 22, 6, 2);

  ctx.fillStyle = darkColor;
  ctx.fillRect(-hw + 4, hh - 8, 8, 6);
  ctx.fillRect(hw - 12, hh - 8, 8, 6);
  ctx.fillStyle = lightColor;
  ctx.fillRect(-hw + 5, hh - 7, 3, 2);
  ctx.fillRect(hw - 11, hh - 7, 3, 2);

  drawOutfit(ctx, customization.outfit, customization.outfitColor, hw, hh, w, h);

  drawAccessory(ctx, customization.accessory, customization.accessoryColor, hw, hh, t);
}
