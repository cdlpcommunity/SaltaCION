import { useState, useRef } from 'react';
import { soundManager } from '@/game/sound';
import type { AuthUser } from '@/lib/supabase';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import type { CharacterCustomization } from '@/game/characterTypes';
import {
  PixelPlay, PixelTrophy, PixelPalette, PixelLogout, PixelSpeaker, PixelArrowUp,
  pixelPrimaryButton, pixelSecondaryButton, pixelPanelStyle,
} from '@/components/pixelUI';

interface MenuScreenProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
  onShowCustomization: () => void;
  highScore: number;
  user: AuthUser | null;
  customization: CharacterCustomization;
  onSignOut: () => void;
  onSecretUnlock: () => void;
}

export function MenuScreen({ onStart, onShowLeaderboard, onShowCustomization, highScore, user, customization, onSignOut, onSecretUnlock }: MenuScreenProps) {
  const [muted, setMuted] = useState(soundManager.isMuted());
  const titleTapCount = useRef(0);
  const titleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = () => {
    titleTapCount.current += 1;
    if (titleTapTimer.current) clearTimeout(titleTapTimer.current);
    titleTapTimer.current = setTimeout(() => { titleTapCount.current = 0; }, 600);
    if (titleTapCount.current >= 3) {
      titleTapCount.current = 0;
      if (titleTapTimer.current) clearTimeout(titleTapTimer.current);
      onSecretUnlock();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1e293b 50%, #334155 100%)' }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />

      {/* Floating pixel stars */}
      <div className="absolute top-8 left-6 w-3 h-3 animate-[pulse-glow_3s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.3)', imageRendering: 'pixelated' }} />
      <div className="absolute top-16 right-10 w-2 h-2 animate-[pulse-glow_4s_ease-in-out_infinite]" style={{ background: 'rgba(241,245,249,0.2)' }} />
      <div className="absolute bottom-20 left-12 w-4 h-4 animate-[pulse-glow_5s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.2)' }} />
      <div className="absolute bottom-32 right-8 w-2 h-2 animate-[pulse-glow_4s_ease-in-out_infinite]" style={{ background: 'rgba(241,245,249,0.15)' }} />

      {/* Top-right: user card + mute */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2 px-2.5 py-1.5" style={{
            ...pixelPanelStyle,
            boxShadow: '0 3px 0 #050a14, inset 0 2px 0 rgba(255,90,54,0.15), inset 0 -2px 0 rgba(0,0,0,0.3)',
          }}>
            <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '2px', border: '1px solid rgba(241,245,249,0.08)' }}>
              <CharacterAvatar customization={customization} size={26} />
            </div>
            <span className="text-[#F1F5F9] font-mono text-sm font-bold" style={{ textShadow: '1px 1px 0 #050a14' }}>{user.username}</span>
          </div>
        )}
        <button
          onClick={() => { const m = !muted; setMuted(m); soundManager.setMuted(m); }}
          className="w-10 h-10 flex items-center justify-center transition-all hover:brightness-125"
          style={{ ...pixelSecondaryButton, width: 40, height: 40 }}
        >
          <PixelSpeaker size={18} muted={muted} />
        </button>
      </div>

      <div className="relative flex flex-col items-center gap-5 px-6 animate-[fadeIn_0.5s_ease-out] z-10">
        {/* Title */}
        <div className="text-center">
          <div className="relative" style={{ fontFamily: 'monospace', fontWeight: 900 }}>
            <h1
              onClick={handleTitleClick}
              className="text-5xl sm:text-6xl tracking-tight relative cursor-pointer select-none"
              style={{
                color: '#FF5A36',
                textShadow: '4px 4px 0 #0F172A, 8px 8px 0 rgba(241,245,249,0.12)',
                letterSpacing: '-0.02em',
                imageRendering: 'pixelated',
              }}
            >
              <span>Salta</span><span className="relative text-white">CIÓN<span className="absolute left-[43%] top-[56%] h-[6px] w-[25%] -translate-y-1/2 bg-[#FF5A36]" /></span>
            </h1>
          </div>
          <p className="text-[#F1F5F9]/50 text-sm mt-3 font-mono tracking-[0.3em]">
            SALTA · SALTA · SALTA
          </p>
        </div>

        {/* High score plate */}
        {highScore > 0 && (
          <div className="flex items-center gap-2 px-4 py-2" style={{
            ...pixelPanelStyle,
            boxShadow: '0 4px 0 #050a14, inset 0 2px 0 rgba(255,90,54,0.12), inset 0 -2px 0 rgba(0,0,0,0.3)',
          }}>
            <PixelArrowUp size={12} color="#FF5A36" />
            <span className="text-[#F1F5F9]/80 text-sm font-mono" style={{ textShadow: '1px 1px 0 #050a14' }}>
              Récord: <span className="text-[#FF5A36] font-bold">{highScore}m</span>
            </span>
          </div>
        )}

        {/* Menu buttons */}
        <div className="flex flex-col gap-2.5 w-56">
          <button
            onClick={onStart}
            className="relative flex items-center justify-center gap-2 px-6 py-3 font-bold text-lg transition-all hover:brightness-110 active:brightness-90"
            style={pixelPrimaryButton}
          >
            <PixelPlay size={20} />
            JUGAR
          </button>
          {user && (
            <button
              onClick={onShowCustomization}
              className="flex items-center justify-center gap-2 px-6 py-2.5 font-semibold transition-all hover:brightness-125 active:brightness-90"
              style={pixelSecondaryButton}
            >
              <PixelPalette size={16} />
              Personalizar
            </button>
          )}
          <button
            onClick={onShowLeaderboard}
            className="flex items-center justify-center gap-2 px-6 py-2.5 font-semibold transition-all hover:brightness-125 active:brightness-90"
            style={pixelSecondaryButton}
          >
            <PixelTrophy size={16} />
            Ranking
          </button>
          {user && (
            <button
              onClick={onSignOut}
              className="flex items-center justify-center gap-2 px-6 py-2 font-semibold transition-all hover:brightness-125 active:brightness-90"
              style={{
                ...pixelSecondaryButton,
                background: 'transparent',
                boxShadow: 'none',
                border: '2px solid rgba(241,245,249,0.08)',
              }}
            >
              <PixelLogout size={14} />
              Cerrar sesión
            </button>
          )}
        </div>

        {/* Controls hint */}
        <div className="mt-2 text-center max-w-xs">
          <p className="text-[#F1F5F9]/40 text-xs font-mono leading-relaxed">
            PC: Flechas / A-D para moverse<br />
            Móvil: Botones en pantalla<br />
            Espacio para empezar
          </p>
        </div>
      </div>
    </div>
  );
}
