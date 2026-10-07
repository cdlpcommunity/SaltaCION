import {
  PixelPlay, PixelRestart, PixelHome,
  pixelPrimaryButton, pixelSecondaryButton, pixelPanelStyle,
} from '@/components/pixelUI';

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
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />

      <div className="relative flex flex-col items-center gap-4 animate-[fadeIn_0.2s_ease-out] z-10">
        {/* Title plate */}
        <div className="px-8 py-3 flex items-center justify-center" style={pixelPanelStyle}>
          <h2 className="text-3xl font-black font-mono" style={{ color: '#FF5A36', textShadow: '3px 3px 0 #050a14' }}>
            PAUSA
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-52">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all hover:brightness-110 active:brightness-90"
            style={pixelPrimaryButton}
          >
            <PixelPlay size={18} />
            Continuar
          </button>
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-2.5 font-semibold transition-all hover:brightness-125 active:brightness-90"
            style={pixelSecondaryButton}
          >
            <PixelRestart size={16} />
            Reiniciar
          </button>
          <button
            onClick={onMenu}
            className="flex items-center justify-center gap-2 px-6 py-2.5 font-semibold transition-all hover:brightness-125 active:brightness-90"
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
