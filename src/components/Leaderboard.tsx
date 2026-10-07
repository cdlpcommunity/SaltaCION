import type { ScoreEntry } from '@/lib/supabase';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { DEFAULT_CUSTOMIZATION, type CharacterCustomization } from '@/game/characterTypes';
import {
  PixelTrophy, PixelClose, PixelCoin, PixelArrowUp,
  pixelPanelStyle, pixelSecondaryButton,
} from '@/components/pixelUI';

interface LeaderboardProps {
  scores: ScoreEntry[];
  customizations: Record<string, CharacterCustomization>;
  loading: boolean;
  onClose: () => void;
}

export function Leaderboard({ scores, customizations, loading, onClose }: LeaderboardProps) {
  const medalColors = ['#FF5A36', '#F1F5F9', '#fbbf24'];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6"
      style={{ background: 'rgba(15,23,42,0.95)' }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-4 animate-[fadeIn_0.3s_ease-out] z-10">
        {/* Title row */}
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-black font-mono flex items-center gap-2"
            style={{ color: '#FF5A36', textShadow: '3px 3px 0 #0F172A' }}
          >
            <PixelTrophy size={22} />
            Ranking
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-all hover:brightness-125"
            style={{ ...pixelSecondaryButton, width: 32, height: 32 }}
          >
            <PixelClose size={14} />
          </button>
        </div>

        {/* Scores list */}
        <div className="w-full flex flex-col gap-1.5 max-h-[400px] overflow-y-auto px-1" style={{ scrollbarWidth: 'none' }}>
          {loading && (
            <div className="text-[#F1F5F9]/50 text-center py-8 font-mono text-sm">Cargando...</div>
          )}
          {!loading && scores.length === 0 && (
            <div className="text-[#F1F5F9]/50 text-center py-8 font-mono text-sm">
              ¡Sé el primero en jugar!
            </div>
          )}
          {!loading && scores.map((entry, i) => {
            const cust = entry.user_id ? customizations[entry.user_id] ?? DEFAULT_CUSTOMIZATION : DEFAULT_CUSTOMIZATION;
            const isTop3 = i < 3;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2.5 transition-all"
                style={{
                  background: isTop3
                    ? `linear-gradient(180deg, ${medalColors[i]}15 0%, ${medalColors[i]}08 100%)`
                    : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                  border: isTop3
                    ? `2px solid ${medalColors[i]}66`
                    : '2px solid #050a14',
                  borderRadius: '4px',
                  boxShadow: isTop3
                    ? `0 3px 0 #050a14, inset 0 2px 0 ${medalColors[i]}22`
                    : '0 3px 0 #050a14, inset 0 1px 0 rgba(148,163,184,0.06)',
                  imageRendering: 'pixelated',
                }}
              >
                {/* Rank number */}
                <div className="w-7 text-center font-mono font-black text-lg" style={{
                  color: medalColors[i],
                  textShadow: isTop3 ? `1px 1px 0 #050a14` : 'none',
                }}>
                  {i + 1}
                </div>
                {/* Avatar */}
                <div className="flex-shrink-0" style={{
                  background: 'rgba(15,23,42,0.6)',
                  borderRadius: '3px',
                  border: '1px solid rgba(241,245,249,0.08)',
                  boxShadow: '0 2px 0 #050a14',
                }}>
                  <CharacterAvatar customization={cust} size={40} />
                </div>
                {/* Name + coins */}
                <div className="flex-1 min-w-0">
                  <div className="text-[#F1F5F9] font-mono text-sm font-bold truncate" style={{ textShadow: '1px 1px 0 #050a14' }}>
                    {entry.player_name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <PixelCoin size={9} />
                    <span className="text-[#fcd34d]/70 font-mono text-xs">{entry.coins}</span>
                  </div>
                </div>
                {/* Height */}
                <div className="flex items-center gap-1">
                  <PixelArrowUp size={10} color={medalColors[i]} />
                  <span className="font-mono font-black text-base" style={{ color: medalColors[i], textShadow: '1px 1px 0 #050a14' }}>
                    {entry.height}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
