import { useRef, useEffect } from 'react';
import type { CharacterCustomization } from '@/game/characterTypes';
import { drawCharacterBody } from '@/game/characterDraw';

interface CharacterAvatarProps {
  customization: CharacterCustomization;
  size?: number;
  animated?: boolean;
}

export function CharacterAvatar({ customization, size = 80, animated = false }: CharacterAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pixelRatio = 2;
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingEnabled = false;

    let rafId = 0;

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const w = size * 0.5;
      const h = size * 0.55;

      const bob = animated ? Math.sin(t * 3) * 2 : 0;
      ctx.save();
      ctx.translate(cx, cy + bob);

      drawCharacterBody(ctx, customization, w, h, t);

      ctx.restore();
      if (animated) rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [customization, size, animated]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  );
}
