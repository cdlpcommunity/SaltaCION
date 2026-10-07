import { useState, useEffect, useCallback } from 'react';
import { PixelFullscreen, PixelButton } from '@/components/pixelUI';

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
    <PixelButton
      onClick={toggle}
      title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 30, width: 32, height: 32 }}
    >
      <PixelFullscreen size={14} exit={isFullscreen} />
    </PixelButton>
  );
}
