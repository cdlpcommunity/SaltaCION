import { useState } from 'react';
import { RotateCcw, Trophy, Send, User, Lock, Home } from 'lucide-react';
import type { AuthUser } from '@/lib/supabase';

interface GameOverScreenProps {
  score: number;
  coins: number;
  height: number;
  onRestart: () => void;
  onSubmitScore: (name: string) => Promise<void>;
  onShowLeaderboard: () => void;
  onMenu: () => void;
  user: AuthUser | null;
}

export function GameOverScreen({ score, coins, height, onRestart, onSubmitScore, onShowLeaderboard, onMenu, user }: GameOverScreenProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    await onSubmitScore(user.username.slice(0, 12));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6"
      style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 50%, rgba(51,65,85,0.95) 100%)' }}
    >
      <div className="flex flex-col items-center gap-5 animate-[fadeIn_0.4s_ease-out]">
        <h2 className="text-3xl font-black font-mono"
          style={{ color: '#FF5A36', textShadow: '3px 3px 0 #0F172A' }}
        >
          GAME OVER
        </h2>

        <div className="flex gap-3">
          <div className="px-5 py-3 text-center" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px' }}>
            <div className="text-[#F1F5F9]/50 text-xs font-mono uppercase">Puntos</div>
            <div className="text-[#FF5A36] text-2xl font-bold font-mono">{score}</div>
          </div>
          <div className="px-5 py-3 text-center" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px' }}>
            <div className="text-[#F1F5F9]/50 text-xs font-mono uppercase">Monedas</div>
            <div className="text-[#F1F5F9] text-2xl font-bold font-mono">{coins}</div>
          </div>
          <div className="px-5 py-3 text-center" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px' }}>
            <div className="text-[#F1F5F9]/50 text-xs font-mono uppercase">Altura</div>
            <div className="text-[#F1F5F9] text-2xl font-bold font-mono">{height}</div>
          </div>
        </div>

        {!submitted ? (
          user ? (
            <div className="flex flex-col gap-2 w-56">
              <div className="flex items-center justify-center gap-2 px-4 py-2 font-mono text-sm" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(255,90,54,0.3)', borderRadius: '4px' }}>
                <User size={16} className="text-[#FF5A36]" />
                <span className="text-[#F1F5F9]/60">Enviando como</span>
                <span className="text-[#FF5A36] font-bold">{user.username}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-4 py-2 font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{
                  background: '#FF5A36', color: '#FFFFFF',
                  border: '2px solid #0F172A', borderRadius: '4px',
                  boxShadow: '0 3px 0 #0F172A', fontFamily: 'monospace',
                }}
              >
                <Send size={18} />
                {submitting ? 'Enviando...' : 'Enviar Puntuación'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-56">
              <div className="flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm text-center" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}>
                <Lock size={16} className="text-[#F1F5F9]/40" />
                <span className="text-[#F1F5F9]/50">Inicia sesión para guardar tu puntuación en el ranking</span>
              </div>
            </div>
          )
        ) : (
          <div className="text-sm font-mono font-bold animate-[fadeIn_0.3s_ease-out]" style={{ color: '#4ade80' }}>
            ¡Puntuación enviada!
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
            style={{
              background: '#FF5A36', color: '#FFFFFF',
              border: '2px solid #0F172A', borderRadius: '4px',
              boxShadow: '0 4px 0 #0F172A', fontFamily: 'monospace',
            }}
          >
            <RotateCcw size={20} />
            Reintentar
          </button>
          <button
            onClick={onShowLeaderboard}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors"
            style={{
              background: 'rgba(15,23,42,0.8)', color: '#F1F5F9',
              border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px', fontFamily: 'monospace',
            }}
          >
            <Trophy size={20} />
            Ranking
          </button>
          <button
            onClick={onMenu}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors"
            style={{
              background: 'rgba(15,23,42,0.8)', color: '#F1F5F9',
              border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px', fontFamily: 'monospace',
            }}
          >
            <Home size={20} />
            Menú
          </button>
        </div>
      </div>
    </div>
  );
}
