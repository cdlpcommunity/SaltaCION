import { useState, useEffect, useCallback } from 'react';
import { Maximize, Minimize } from 'lucide-react';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <button
      onClick={toggle}
      className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-8 h-8 flex items-center justify-center text-[#F1F5F9] transition-colors hover:bg-[#FF5A36]/20"
      style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}
      title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
    >
      {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
    </button>
  );
}
