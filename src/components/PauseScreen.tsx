import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export function PauseScreen({ onResume, onRestart, onMenu }: PauseScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20"
      style={{ background: 'rgba(15,23,42,0.9)' }}
    >
      <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.2s_ease-out]">
        <h2 className="text-3xl font-black font-mono" style={{ color: '#FF5A36', textShadow: '3px 3px 0 #0F172A' }}>
          PAUSA
        </h2>
        <div className="flex flex-col gap-3 w-48">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 px-6 py-3 font-bold transition-transform hover:scale-105 active:scale-95"
            style={{
              background: '#FF5A36',
              color: '#FFFFFF',
              border: '2px solid #0F172A',
              borderRadius: '4px',
              boxShadow: '0 4px 0 #0F172A',
              fontFamily: 'monospace',
            }}
          >
            <Play size={20} fill="currentColor" />
            Continuar
          </button>
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors"
            style={{
              background: 'rgba(15,23,42,0.8)',
              color: '#F1F5F9',
              border: '2px solid rgba(241,245,249,0.2)',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          >
            <RotateCcw size={20} />
            Reiniciar
          </button>
          <button
            onClick={onMenu}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors"
            style={{
              background: 'rgba(15,23,42,0.8)',
              color: '#F1F5F9',
              border: '2px solid rgba(241,245,249,0.2)',
              borderRadius: '4px',
              fontFamily: 'monospace',
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
