import { Monitor, Smartphone, RefreshCw } from 'lucide-react';
import type { ViewMode } from '@/game/types';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  isMobile: boolean;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 p-1"
      style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}
    >
      <button
        onClick={() => onChange('desktop')}
        className="w-7 h-7 flex items-center justify-center transition-colors"
        style={{
          background: mode === 'desktop' ? 'rgba(255,90,54,0.3)' : 'transparent',
          borderRadius: '2px',
          color: mode === 'desktop' ? '#FF5A36' : 'rgba(241,245,249,0.4)',
        }}
        title="Vista PC"
      >
        <Monitor size={16} />
      </button>
      <button
        onClick={() => onChange('mobile')}
        className="w-7 h-7 flex items-center justify-center transition-colors"
        style={{
          background: mode === 'mobile' ? 'rgba(255,90,54,0.3)' : 'transparent',
          borderRadius: '2px',
          color: mode === 'mobile' ? '#FF5A36' : 'rgba(241,245,249,0.4)',
        }}
        title="Vista Móvil"
      >
        <Smartphone size={16} />
      </button>
      <button
        onClick={() => onChange('auto')}
        className="w-7 h-7 flex items-center justify-center transition-colors"
        style={{
          background: mode === 'auto' ? 'rgba(255,90,54,0.3)' : 'transparent',
          borderRadius: '2px',
          color: mode === 'auto' ? '#FF5A36' : 'rgba(241,245,249,0.4)',
        }}
        title="Automático"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}
