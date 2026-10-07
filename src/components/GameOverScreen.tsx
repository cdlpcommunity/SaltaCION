import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { AuthUser } from '@/lib/supabase';
import {
  PixelRestart, PixelTrophy, PixelHome, PixelLock, PixelUser, PixelCheck, PixelArrowUp, PixelCoin,
  pixelPrimaryButton, pixelSecondaryButton, pixelPanelStyle,
} from '@/components/pixelUI';

interface GameOverScreenProps {
  coins: number;
  height: number;
  onRestart: () => void;
  onSubmitScore: (name: string) => Promise<void>;
  onShowLeaderboard: () => void;
  onMenu: () => void;
  user: AuthUser | null;
  isZoneTest: boolean;
}

export function GameOverScreen({ coins, height, onRestart, onSubmitScore, onShowLeaderboard, onMenu, user, isZoneTest }: GameOverScreenProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => {
    if (!user || isZoneTest) return;
    let active = true;
    setStatus('sending');
    onSubmitScore(user.username.slice(0, 12))
      .then(() => { if (active) setStatus('done'); })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [user, onSubmitScore, isZoneTest]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6"
      style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 50%, rgba(51,65,85,0.95) 100%)' }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />

      <div className="relative flex flex-col items-center gap-5 animate-[fadeIn_0.4s_ease-out] z-10">
        {/* Title */}
        <h2 className="text-3xl font-black font-mono"
          style={{ color: '#FF5A36', textShadow: '3px 3px 0 #050a14' }}
        >
          GAME OVER
        </h2>

        {/* Stats plates */}
        <div className="flex gap-3">
          <div className="px-5 py-3 text-center" style={{
            ...pixelPanelStyle,
            boxShadow: '0 4px 0 #050a14, inset 0 2px 0 rgba(255,90,54,0.15), inset 0 -2px 0 rgba(0,0,0,0.3)',
          }}>
            <div className="text-[#F1F5F9]/50 text-xs font-mono uppercase">Distancia</div>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <PixelArrowUp size={14} color="#FF5A36" />
              <span className="text-[#FF5A36] text-2xl font-black font-mono" style={{ textShadow: '2px 2px 0 #050a14' }}>{height}m</span>
            </div>
          </div>
          <div className="px-5 py-3 text-center" style={pixelPanelStyle}>
            <div className="text-[#F1F5F9]/50 text-xs font-mono uppercase">Monedas</div>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <PixelCoin size={14} />
              <span className="text-[#fcd34d] text-2xl font-black font-mono" style={{ textShadow: '2px 2px 0 #050a14' }}>{coins}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {isZoneTest ? (
          <div className="flex flex-col items-center gap-2 w-56">
            <div className="flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm text-center" style={pixelPanelStyle}>
              <PixelLock size={16} color="#94a3b8" />
              <span className="text-[#F1F5F9]/50">Modo de prueba de zonas — los récords no se guardan</span>
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col items-center gap-2 w-56">
            <div className="flex items-center justify-center gap-2 px-4 py-2 font-mono text-sm" style={{
              ...pixelPanelStyle,
              boxShadow: '0 3px 0 #050a14, inset 0 2px 0 rgba(255,90,54,0.12)',
            }}>
              <PixelUser size={16} />
              <span className="text-[#F1F5F9]/60">Registrando como</span>
              <span className="text-[#FF5A36] font-bold" style={{ textShadow: '1px 1px 0 #050a14' }}>{user.username}</span>
            </div>
            {status === 'sending' && (
              <div className="flex items-center gap-2 text-[#F1F5F9]/60 text-sm font-mono">
                <Loader2 size={16} className="animate-spin" />
                Guardando récord...
              </div>
            )}
            {status === 'done' && (
              <div className="flex items-center gap-2 text-sm font-mono font-bold animate-[fadeIn_0.3s_ease-out]" style={{ color: '#4ade80' }}>
                <PixelCheck size={16} />
                ¡Récord guardado!
              </div>
            )}
            {status === 'error' && (
              <div className="text-sm font-mono font-bold" style={{ color: '#f87171' }}>
                No se pudo guardar el récord
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-56">
            <div className="flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm text-center" style={pixelPanelStyle}>
              <PixelLock size={16} color="#94a3b8" />
              <span className="text-[#F1F5F9]/50">Inicia sesión para guardar tu récord en el ranking</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all hover:brightness-110 active:brightness-90"
            style={pixelPrimaryButton}
          >
            <PixelRestart size={18} />
            Reintentar
          </button>
          <button
            onClick={onShowLeaderboard}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all hover:brightness-125 active:brightness-90"
            style={pixelSecondaryButton}
          >
            <PixelTrophy size={16} />
            Ranking
          </button>
          <button
            onClick={onMenu}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all hover:brightness-125 active:brightness-90"
            style={pixelSecondaryButton}
          >
            <PixelHome size={16} />
            Menú
          </button>
        </div>
      </div>
    </div>
  );
}
