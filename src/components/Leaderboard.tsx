import { X, Trophy } from 'lucide-react';
import type { ScoreEntry } from '@/lib/supabase';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { DEFAULT_CUSTOMIZATION, type CharacterCustomization } from '@/game/characterTypes';

interface LeaderboardProps {
  scores: ScoreEntry[];
  customizations: Record<string, CharacterCustomization>;
  loading: boolean;
  onClose: () => void;
}

export function Leaderboard({ scores, customizations, loading, onClose }: LeaderboardProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6"
      style={{ background: 'rgba(15,23,42,0.95)' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-black font-mono flex items-center gap-2"
            style={{ color: '#FF5A36', textShadow: '2px 2px 0 #0F172A' }}
          >
            <Trophy size={24} />
            Ranking
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#F1F5F9] transition-colors hover:text-[#FF5A36]"
            style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

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
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2.5 transition-all"
                style={{
                  background: i === 0
                    ? 'linear-gradient(90deg, rgba(255,90,54,0.15), rgba(255,90,54,0.05))'
                    : i === 1
                    ? 'rgba(241,245,249,0.08)'
                    : i === 2
                    ? 'rgba(255,90,54,0.05)'
                    : 'rgba(15,23,42,0.6)',
                  border: i === 0 ? '2px solid rgba(255,90,54,0.4)' : '2px solid rgba(241,245,249,0.1)',
                  borderRadius: '4px',
                }}
              >
                <div className="w-7 text-center font-mono font-bold" style={{
                  color: i === 0 ? '#FF5A36' : i === 1 ? '#F1F5F9' : i === 2 ? '#FF5A36' : 'rgba(241,245,249,0.4)',
                }}>
                  {i + 1}
                </div>
                <div className="flex-shrink-0" style={{
                  background: 'rgba(15,23,42,0.6)',
                  borderRadius: '4px',
                  border: '1px solid rgba(241,245,249,0.1)',
                }}>
                  <CharacterAvatar customization={cust} size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#F1F5F9] font-mono text-sm font-bold truncate">{entry.player_name}</div>
                  <div className="text-[#F1F5F9]/40 font-mono text-xs">
                    {entry.coins} monedas
                  </div>
                </div>
                <div className="font-mono font-bold text-lg" style={{ color: i === 0 ? '#FF5A36' : '#F1F5F9' }}>
                  {entry.height}m
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
