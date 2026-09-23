import { useEffect, useRef, useState } from 'react';
import type { PowerUpType } from '@/game/types';
import { soundManager } from '@/game/sound';

interface RouletteScreenProps {
  onResult: (item: PowerUpType['type']) => void;
}

interface RouletteItem {
  type: PowerUpType['type'];
  label: string;
  color: string;
  colorDark: string;
  colorLight: string;
  weight: number;
}

const ITEMS: RouletteItem[] = [
  { type: 'shield', label: 'Escudo', color: '#22d3ee', colorDark: '#0e7490', colorLight: '#a5f3fc', weight: 60 },
  { type: 'jetpack', label: 'Cohete', color: '#818cf8', colorDark: '#3730a3', colorLight: '#c7d2fe', weight: 15 },
  { type: 'propeller', label: 'Aspas', color: '#2dd4bf', colorDark: '#0f766e', colorLight: '#99f6e4', weight: 15 },
  { type: 'extra_life', label: 'Vida+', color: '#f87171', colorDark: '#991b1b', colorLight: '#fca5a5', weight: 10 },
];

const WHEEL_SIZE = 360;
const PIXEL = 4;

function weightedRandom(): number {
  const total = ITEMS.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < ITEMS.length; i++) {
    r -= ITEMS[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + Math.round(255 * amt)));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amt)));
  const b = Math.max(0, Math.min(255, (n & 0xff) + Math.round(255 * amt)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function drawPixelCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: string) {
  ctx.fillStyle = color;
  const r2 = radius * radius;
  for (let py = -radius; py <= radius; py += PIXEL) {
    for (let px = -radius; px <= radius; px += PIXEL) {
      if (px * px + py * py <= r2) {
        ctx.fillRect(cx + px, cy + py, PIXEL, PIXEL);
      }
    }
  }
}

function drawPixelRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, color: string) {
  ctx.fillStyle = color;
  const o2 = outerR * outerR;
  const i2 = innerR * innerR;
  for (let py = -outerR; py <= outerR; py += PIXEL) {
    for (let px = -outerR; px <= outerR; px += PIXEL) {
      const d2 = px * px + py * py;
      if (d2 <= o2 && d2 >= i2) {
        ctx.fillRect(cx + px, cy + py, PIXEL, PIXEL);
      }
    }
  }
}

function drawPixelArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number, color: string) {
  ctx.fillStyle = color;
  const normalizeAngle = (angle: number) => ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const normalizedStart = normalizeAngle(startAngle);
  const normalizedEnd = normalizeAngle(endAngle);
  const o2 = outerR * outerR;
  const i2 = innerR * innerR;
  for (let py = -outerR; py <= outerR; py += PIXEL) {
    for (let px = -outerR; px <= outerR; px += PIXEL) {
      const d2 = px * px + py * py;
      if (d2 <= o2 && d2 >= i2) {
        const angle = normalizeAngle(Math.atan2(py, px));
        if (normalizedStart < normalizedEnd
          ? (angle >= normalizedStart && angle < normalizedEnd)
          : (angle >= normalizedStart || angle < normalizedEnd)) {
          ctx.fillRect(cx + px, cy + py, PIXEL, PIXEL);
        }
      }
    }
  }
}

function drawPixelIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, type: string, color: string, colorDark: string, colorLight: string) {
  const s = size;
  const p = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(cx + x, cy + y, w, h);
  };

  switch (type) {
    case 'shield':
      // Shield shape - pixel art
      p(-s * 0.5, -s * 0.5, s, s * 0.25, colorDark);
      p(-s * 0.4, -s * 0.4, s * 0.8, s * 0.2, color);
      p(-s * 0.3, -s * 0.2, s * 0.6, s * 0.15, color);
      p(-s * 0.2, -s * 0.05, s * 0.4, s * 0.15, colorLight);
      p(-s * 0.15, s * 0.1, s * 0.3, s * 0.1, color);
      p(-s * 0.1, s * 0.2, s * 0.2, s * 0.08, colorDark);
      // Highlight
      p(-s * 0.35, -s * 0.35, s * 0.15, s * 0.1, colorLight);
      break;
    case 'jetpack':
      // Rocket - pixel art
      p(-s * 0.15, -s * 0.5, s * 0.3, s * 0.2, colorLight);
      p(-s * 0.1, -s * 0.3, s * 0.2, s * 0.4, color);
      p(-s * 0.2, -s * 0.1, s * 0.1, s * 0.25, colorDark);
      p(s * 0.1, -s * 0.1, s * 0.1, s * 0.25, colorDark);
      p(-s * 0.15, s * 0.15, s * 0.3, s * 0.2, colorDark);
      p(-s * 0.1, s * 0.35, s * 0.2, s * 0.1, '#fb923c');
      p(-s * 0.05, s * 0.45, s * 0.1, s * 0.08, '#fcd34d');
      // Window
      p(-s * 0.05, -s * 0.25, s * 0.1, s * 0.1, '#a5f3fc');
      break;
    case 'propeller':
      // Helicopter blades - pixel art
      p(-s * 0.5, -s * 0.05, s, s * 0.1, color);
      p(-s * 0.05, -s * 0.5, s * 0.1, s, color);
      p(-s * 0.3, -s * 0.3, s * 0.6, s * 0.6, colorDark);
      p(-s * 0.2, -s * 0.2, s * 0.4, s * 0.4, color);
      p(-s * 0.1, -s * 0.1, s * 0.2, s * 0.2, colorLight);
      // Blade highlights
      p(-s * 0.45, -s * 0.04, s * 0.9, s * 0.03, colorLight);
      p(-s * 0.04, -s * 0.45, s * 0.03, s * 0.9, colorLight);
      break;
    case 'extra_life':
      // Heart - pixel art
      p(-s * 0.4, -s * 0.3, s * 0.35, s * 0.25, colorDark);
      p(s * 0.05, -s * 0.3, s * 0.35, s * 0.25, colorDark);
      p(-s * 0.45, -s * 0.2, s * 0.9, s * 0.3, color);
      p(-s * 0.35, s * 0.1, s * 0.7, s * 0.15, color);
      p(-s * 0.25, s * 0.25, s * 0.5, s * 0.1, colorDark);
      p(-s * 0.15, s * 0.35, s * 0.3, s * 0.08, colorDark);
      // Highlight
      p(-s * 0.3, -s * 0.2, s * 0.12, s * 0.08, colorLight);
      p(s * 0.1, -s * 0.2, s * 0.08, s * 0.06, colorLight);
      break;
  }
}

export function RouletteScreen({ onResult }: RouletteScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const spinStartRef = useRef(0);
  const spinDurationRef = useRef(0);
  const startRotationRef = useRef(0);
  const rafRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tick, setTick] = useState(0);
  const lastTickAngleRef = useRef(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pr = 2;
    canvas.width = WHEEL_SIZE * pr;
    canvas.height = WHEEL_SIZE * pr;
    ctx.scale(pr, pr);
    ctx.imageSmoothingEnabled = false;

    const cx = WHEEL_SIZE / 2;
    const cy = WHEEL_SIZE / 2;
    const outerR = WHEEL_SIZE / 2 - 10;
    const midR = outerR - 18;
    const innerR = midR - 80;

    const draw = () => {
      ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

      const rotation = rotationRef.current;
      const segAngle = (Math.PI * 2) / ITEMS.length;

      // Outer beveled ring (2.5D frame)
      drawPixelRing(ctx, cx, cy, outerR, outerR - 4, '#0F172A');
      drawPixelRing(ctx, cx, cy, outerR - 4, outerR - 8, '#1e293b');
      // Top highlight on outer ring
      for (let py = -outerR; py <= 0; py += PIXEL) {
        for (let px = -outerR; px <= outerR; px += PIXEL) {
          const d2 = px * px + py * py;
          if (d2 <= (outerR - 4) * (outerR - 4) && d2 >= (outerR - 8) * (outerR - 8)) {
            const t = 1 - (-py / outerR);
            ctx.fillStyle = `rgba(255,255,255,${t * 0.15})`;
            ctx.fillRect(cx + px, cy + py, PIXEL, PIXEL);
          }
        }
      }

      // Segments
      for (let i = 0; i < ITEMS.length; i++) {
        const item = ITEMS[i];
        const startA = rotation + i * segAngle - Math.PI / 2;
        const endA = startA + segAngle;

        // Segment fill (bright base)
        drawPixelArc(ctx, cx, cy, innerR, midR, startA, endA, item.color);

        // Inner highlight band (top half of each segment for 2.5D)
        drawPixelArc(ctx, cx, cy, innerR + 10, midR - 6, startA, endA, item.colorLight);

        // Bright top edge
        const midA = (startA + endA) / 2;
        for (let r = innerR; r <= midR; r += PIXEL) {
          const hx = Math.cos(midA) * r;
          const hy = Math.sin(midA) * r;
          const topAngle = midA - Math.PI / 2;
          const tx = hx + Math.cos(topAngle) * 3;
          const ty = hy + Math.sin(topAngle) * 3;
          ctx.fillStyle = item.colorLight;
          ctx.fillRect(cx + tx, cy + ty, PIXEL, PIXEL);
        }

        // Divider lines between segments
        for (let r = innerR; r <= midR; r += PIXEL) {
          const dx = Math.cos(startA) * r;
          const dy = Math.sin(startA) * r;
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(cx + dx, cy + dy, PIXEL, PIXEL);
        }

        // Pixel icon at segment center (upper portion)
        const iconR = (innerR + midR) / 2 - 6;
        const iconA = startA + segAngle / 2;
        const iconX = cx + Math.cos(iconA) * iconR;
        const iconY = cy + Math.sin(iconA) * iconR;
        ctx.save();
        ctx.translate(iconX, iconY);
        ctx.rotate(iconA + Math.PI / 2);
        drawPixelIcon(ctx, 0, 0, 40, item.type, item.color, item.colorDark, item.colorLight);
        ctx.restore();

        // Horizontal label for quick reading in every segment
        const labelR = (innerR + midR) / 2 + 22;
        const labelA = startA + segAngle / 2;
        const labelX = cx + Math.cos(labelA) * labelR;
        const labelY = cy + Math.sin(labelA) * labelR;
        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 5;
        ctx.strokeText(item.label, 0, 0);
        ctx.fillText(item.label, 0, 0);
        ctx.restore();
      }

      // Inner hub (smaller so segments are more visible)
      drawPixelCircle(ctx, cx, cy, innerR - 2, '#0F172A');
      drawPixelCircle(ctx, cx, cy, innerR - 6, '#1e293b');
      drawPixelCircle(ctx, cx, cy, innerR - 12, '#FF5A36');
      drawPixelCircle(ctx, cx, cy, innerR - 16, '#E04420');
      // Hub highlight
      for (let py = -(innerR - 16); py <= 0; py += PIXEL) {
        for (let px = -(innerR - 16); px <= (innerR - 16); px += PIXEL) {
          const d2 = px * px + py * py;
          if (d2 <= (innerR - 16) * (innerR - 16)) {
            const t = 1 - (-py / (innerR - 16));
            ctx.fillStyle = `rgba(255,255,255,${t * 0.2})`;
            ctx.fillRect(cx + px, cy + py, PIXEL, PIXEL);
          }
        }
      }
      // Hub center dot
      drawPixelCircle(ctx, cx, cy, 5, '#0F172A');
      drawPixelCircle(ctx, cx, cy, 2, '#FF5A36');

      // Pointer (fixed at top, pointing down into wheel)
      const ptrBaseY = 2;
      const ptrTipY = 18;
      ctx.fillStyle = '#0F172A';
      // Pointer shadow
      ctx.fillRect(cx - 10, ptrBaseY - 2, 20, 6);
      ctx.fillRect(cx - 7, ptrBaseY + 4, 14, 8);
      ctx.fillRect(cx - 4, ptrBaseY + 12, 8, 6);
      // Pointer body
      ctx.fillStyle = '#FF5A36';
      ctx.fillRect(cx - 8, ptrBaseY, 16, 4);
      ctx.fillRect(cx - 6, ptrBaseY + 4, 12, 6);
      ctx.fillRect(cx - 4, ptrBaseY + 10, 8, 6);
      ctx.fillRect(cx - 2, ptrBaseY + 16, 4, 4);
      // Pointer highlight
      ctx.fillStyle = '#FF7A56';
      ctx.fillRect(cx - 7, ptrBaseY, 4, 3);
      ctx.fillRect(cx - 5, ptrBaseY + 4, 3, 4);
      // Pointer dark edge
      ctx.fillStyle = '#E04420';
      ctx.fillRect(cx + 4, ptrBaseY, 4, 3);
      ctx.fillRect(cx + 3, ptrBaseY + 4, 3, 4);
      ctx.fillRect(cx + 2, ptrBaseY + 10, 2, 4);


    };

    draw();

    // Spin animation loop
    if (spinning) {
      const animate = () => {
        const elapsed = (performance.now() - spinStartRef.current) / 1000;
        const duration = spinDurationRef.current;
        const t = Math.min(elapsed / duration, 1);
        // Ease out with slight overshoot
        const eased = 1 - Math.pow(1 - t, 4);
        rotationRef.current = startRotationRef.current + (targetRotationRef.current - startRotationRef.current) * eased;

        // Tick sound based on rotation segments passing the pointer
        const currentAngle = rotationRef.current;
        const segAngle = (Math.PI * 2) / ITEMS.length;
        const tickDiff = Math.abs(currentAngle - lastTickAngleRef.current);
        if (tickDiff >= segAngle) {
          lastTickAngleRef.current = currentAngle;
          soundManager.play('rouletteTick');
          setTick(t2 => t2 + 1);
        }

        draw();

        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // Snap to exact target
          rotationRef.current = targetRotationRef.current;
          draw();
          setSpinning(false);
          setResultIndex(currentResultRef.current);
          setShowResult(true);
          soundManager.play('rouletteWin');
          timeoutRef.current = setTimeout(() => {
            if (currentResultRef.current !== null) {
              onResult(ITEMS[currentResultRef.current].type);
            }
          }, 1800);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spinning, tick]);

  const currentResultRef = useRef<number | null>(null);

  const spin = () => {
    if (spinning) return;
    currentResultRef.current = weightedRandom();
    const winner = currentResultRef.current;

    // Calculate target rotation so the winner segment center lands at the top pointer
    const segAngle = (Math.PI * 2) / ITEMS.length;
    const winnerCenter = winner * segAngle + segAngle / 2 - Math.PI / 2;
    const targetAtPointer = -Math.PI / 2 - winnerCenter;
    const fullSpins = 5 * Math.PI * 2;
    const target = targetAtPointer + fullSpins;

    startRotationRef.current = rotationRef.current;
    targetRotationRef.current = target;
    spinStartRef.current = performance.now();
    spinDurationRef.current = 3.5;
    lastTickAngleRef.current = rotationRef.current;

    soundManager.play('rouletteSpin');
    setSpinning(true);
    setResultIndex(null);
    setShowResult(false);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      style={{ background: 'rgba(8,12,24,0.95)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255,90,54,0.1), transparent 60%)',
      }} />

      {/* Floating pixel particles */}
      <div className="absolute top-12 left-10 w-2 h-2 animate-[pulse-glow_3s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.4)' }} />
      <div className="absolute top-20 right-14 w-3 h-3 animate-[pulse-glow_4s_ease-in-out_infinite]" style={{ background: 'rgba(241,245,249,0.15)' }} />
      <div className="absolute bottom-16 left-16 w-2 h-2 animate-[pulse-glow_5s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.3)' }} />
      <div className="absolute bottom-24 right-12 w-3 h-3 animate-[pulse-glow_3.5s_ease-in-out_infinite]" style={{ background: 'rgba(241,245,249,0.1)' }} />

      <div className="relative flex flex-col items-center gap-4 px-6 animate-[fadeIn_0.3s_ease-out]">
        {/* Title */}
        <h2 className="text-2xl font-black font-mono text-[#FF5A36]"
          style={{ textShadow: '3px 3px 0 #0F172A, 6px 6px 0 rgba(241,245,249,0.08)' }}
        >
          RULETA DE OBJETOS
        </h2>
        <p className="text-[#F1F5F9]/50 text-xs font-mono tracking-wider text-center">
          Cuesta 10 monedas · Gira para recibir un objeto al azar
        </p>

        {/* Wheel canvas with 2.5D frame */}
        <div
          className="relative"
          style={{
            padding: '8px',
            background: 'linear-gradient(180deg, #334155 0%, #1e293b 50%, #0F172A 100%)',
            border: '3px solid #0F172A',
            borderRadius: '6px',
            boxShadow: '0 8px 0 #0F172A, 0 12px 24px rgba(0,0,0,0.6), inset 0 3px 0 rgba(255,255,255,0.15), inset 0 -3px 0 rgba(0,0,0,0.4)',
            imageRendering: 'pixelated',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Result display */}
        {showResult && resultIndex !== null && (
          <div className="flex flex-col items-center gap-2 animate-[fadeIn_0.4s_ease-out]">
            <span className="text-[#F1F5F9]/60 text-xs font-mono tracking-wider">¡CONSEGUISTE!</span>
            <div
              className="flex items-center gap-3 px-6 py-3"
              style={{
                background: `linear-gradient(180deg, ${ITEMS[resultIndex].colorDark} 0%, ${ITEMS[resultIndex].colorDark} 100%)`,
                border: `3px solid ${ITEMS[resultIndex].color}`,
                borderRadius: '4px',
                boxShadow: `0 5px 0 #0F172A, 0 0 24px ${ITEMS[resultIndex].color}66, inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.3)`,
                imageRendering: 'pixelated',
              }}
            >
              <span
                className="font-mono font-black text-xl"
                style={{
                  color: ITEMS[resultIndex].colorLight,
                  textShadow: `2px 2px 0 ${ITEMS[resultIndex].colorDark}, 0 0 12px ${ITEMS[resultIndex].color}88`,
                }}
              >
                {ITEMS[resultIndex].label}
              </span>
            </div>
          </div>
        )}

        {/* Spin button */}
        {!showResult && (
          <button
            onClick={spin}
            disabled={spinning}
            className="relative flex items-center justify-center gap-2 px-12 py-3.5 font-bold text-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(180deg, #FF7A56 0%, #FF5A36 40%, #E04420 100%)',
              color: '#FFFFFF',
              borderRadius: '4px',
              border: '3px solid #0F172A',
              boxShadow: '0 6px 0 #0F172A, 0 10px 16px rgba(0,0,0,0.5), inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -3px 0 rgba(0,0,0,0.25)',
              fontFamily: 'monospace',
              textShadow: '2px 2px 0 #0F172A',
              imageRendering: 'pixelated',
              letterSpacing: '0.1em',
            }}
          >
            {spinning ? 'GIRANDO...' : 'GIRAR'}
          </button>
        )}

        {/* Probability legend */}
        {!showResult && !spinning && (
          <div className="flex gap-2 flex-wrap justify-center max-w-[300px]">
            {ITEMS.map((item) => (
              <div key={item.type} className="flex items-center gap-1.5 px-2.5 py-1" style={{
                background: 'rgba(15,23,42,0.9)',
                border: `2px solid ${item.color}44`,
                borderRadius: '3px',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}>
                <div className="w-2 h-2" style={{ background: item.color, imageRendering: 'pixelated' }} />
                <span className="text-[10px] font-mono font-bold" style={{ color: item.color }}>
                  {item.weight}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
