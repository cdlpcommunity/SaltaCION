import type { CSSProperties, ReactNode } from 'react';

export const pixelPlateStyle: CSSProperties = {
  background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  border: '2px solid #050a14',
  borderRadius: '3px',
  boxShadow: '0 3px 0 #050a14, inset 0 2px 0 rgba(148,163,184,0.12), inset 0 -2px 0 rgba(0,0,0,0.35)',
  imageRendering: 'pixelated',
};

export const pixelButtonBase: CSSProperties = {
  background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  border: '2px solid #050a14',
  borderRadius: '3px',
  boxShadow: '0 3px 0 #050a14, inset 0 2px 0 rgba(148,163,184,0.12), inset 0 -2px 0 rgba(0,0,0,0.35)',
  imageRendering: 'pixelated',
};

export function PixelCoin({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="1" width="4" height="1" fill="#d97706" />
      <rect x="2" y="2" width="1" height="1" fill="#d97706" />
      <rect x="3" y="2" width="4" height="1" fill="#fcd34d" />
      <rect x="7" y="2" width="1" height="1" fill="#d97706" />
      <rect x="1" y="3" width="1" height="4" fill="#d97706" />
      <rect x="2" y="3" width="1" height="4" fill="#fcd34d" />
      <rect x="3" y="3" width="4" height="4" fill="#fcd34d" />
      <rect x="3" y="3" width="1" height="2" fill="#fef3c7" />
      <rect x="4" y="3" width="1" height="1" fill="#fef3c7" />
      <rect x="7" y="3" width="1" height="4" fill="#d97706" />
      <rect x="8" y="3" width="1" height="4" fill="#b45309" />
      <rect x="2" y="7" width="1" height="1" fill="#d97706" />
      <rect x="3" y="7" width="4" height="1" fill="#fcd34d" />
      <rect x="7" y="7" width="1" height="1" fill="#d97706" />
      <rect x="3" y="8" width="4" height="1" fill="#b45309" />
    </svg>
  );
}

export function PixelHeart({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="2" height="1" fill="#991b1b" />
      <rect x="6" y="2" width="2" height="1" fill="#991b1b" />
      <rect x="1" y="3" width="3" height="1" fill="#ef4444" />
      <rect x="2" y="3" width="1" height="1" fill="#fca5a5" />
      <rect x="4" y="3" width="2" height="1" fill="#ef4444" />
      <rect x="6" y="3" width="3" height="1" fill="#ef4444" />
      <rect x="7" y="3" width="1" height="1" fill="#fca5a5" />
      <rect x="1" y="4" width="8" height="1" fill="#ef4444" />
      <rect x="2" y="4" width="1" height="1" fill="#fca5a5" />
      <rect x="2" y="5" width="6" height="1" fill="#ef4444" />
      <rect x="3" y="6" width="4" height="1" fill="#dc2626" />
      <rect x="4" y="7" width="2" height="1" fill="#dc2626" />
      <rect x="4" y="7" width="1" height="1" fill="#991b1b" />
    </svg>
  );
}

export function PixelArrowUp({ size = 12, color = '#FF5A36' }: { size?: number; color?: string }) {
  const dark = '#7a2a16';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="1" width="2" height="1" fill={color} />
      <rect x="3" y="2" width="4" height="1" fill={color} />
      <rect x="4" y="2" width="2" height="1" fill={color} />
      <rect x="2" y="3" width="6" height="1" fill={color} />
      <rect x="3" y="3" width="4" height="1" fill={color} />
      <rect x="1" y="4" width="8" height="1" fill={color} />
      <rect x="2" y="4" width="6" height="1" fill={color} />
      <rect x="4" y="5" width="2" height="1" fill={color} />
      <rect x="4" y="6" width="2" height="1" fill={color} />
      <rect x="4" y="7" width="2" height="1" fill={dark} />
    </svg>
  );
}

export function PixelPause({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="2" height="6" fill="#F1F5F9" />
      <rect x="6" y="2" width="2" height="6" fill="#F1F5F9" />
      <rect x="2" y="2" width="1" height="6" fill="#cbd5e1" />
      <rect x="6" y="2" width="1" height="6" fill="#cbd5e1" />
    </svg>
  );
}

export function PixelSpeaker({ size = 14, muted = false }: { size?: number; muted?: boolean }) {
  const color = '#F1F5F9';
  const dark = '#94a3b8';
  const slash = '#ef4444';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="4" width="2" height="2" fill={color} />
      <rect x="3" y="3" width="2" height="4" fill={color} />
      <rect x="3" y="3" width="1" height="4" fill={dark} />
      {!muted && (
        <>
          <rect x="5" y="2" width="1" height="6" fill={color} />
          <rect x="6" y="3" width="1" height="4" fill={dark} />
          <rect x="7" y="4" width="1" height="2" fill={dark} />
        </>
      )}
      {muted && (
        <>
          <rect x="6" y="1" width="1" height="1" fill={slash} />
          <rect x="7" y="2" width="1" height="1" fill={slash} />
          <rect x="8" y="3" width="1" height="1" fill={slash} />
          <rect x="5" y="2" width="1" height="1" fill={slash} />
          <rect x="6" y="3" width="1" height="1" fill={slash} />
          <rect x="7" y="4" width="1" height="1" fill={slash} />
          <rect x="8" y="5" width="1" height="1" fill={slash} />
          <rect x="7" y="6" width="1" height="1" fill={slash} />
          <rect x="6" y="7" width="1" height="1" fill={slash} />
          <rect x="5" y="8" width="1" height="1" fill={slash} />
          <rect x="5" y="7" width="1" height="1" fill={slash} />
        </>
      )}
    </svg>
  );
}

export function PixelFullscreen({ size = 14, exit = false }: { size?: number; exit?: boolean }) {
  const color = '#F1F5F9';
  if (exit) {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="3" width="4" height="4" fill={color} />
        <rect x="2" y="4" width="1" height="2" fill={color} />
        <rect x="7" y="4" width="1" height="2" fill={color} />
        <rect x="4" y="2" width="2" height="1" fill={color} />
        <rect x="4" y="7" width="2" height="1" fill={color} />
        <rect x="3" y="3" width="1" height="1" fill="#cbd5e1" />
        <rect x="3" y="3" width="4" height="1" fill="#cbd5e1" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="1" width="3" height="1" fill={color} />
      <rect x="1" y="2" width="1" height="2" fill={color} />
      <rect x="6" y="1" width="3" height="1" fill={color} />
      <rect x="8" y="2" width="1" height="2" fill={color} />
      <rect x="1" y="7" width="1" height="2" fill={color} />
      <rect x="1" y="8" width="3" height="1" fill={color} />
      <rect x="6" y="8" width="3" height="1" fill={color} />
      <rect x="8" y="7" width="1" height="2" fill={color} />
    </svg>
  );
}

export function PixelButton({
  children,
  onClick,
  title,
  style,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  title?: string;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center transition-all hover:brightness-125 active:brightness-100 ${className ?? ''}`}
      style={{
        ...pixelButtonBase,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export const pixelPanelStyle: CSSProperties = {
  background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  border: '3px solid #050a14',
  borderRadius: '4px',
  boxShadow: '0 5px 0 #050a14, inset 0 3px 0 rgba(148,163,184,0.1), inset 0 -3px 0 rgba(0,0,0,0.4)',
  imageRendering: 'pixelated',
};

export function PixelPlay({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="1" width="2" height="8" fill={color} />
      <rect x="3" y="1" width="1" height="8" fill={color} />
      <rect x="4" y="2" width="2" height="6" fill={color} />
      <rect x="5" y="2" width="1" height="6" fill={color} />
      <rect x="6" y="3" width="2" height="4" fill={color} />
      <rect x="7" y="3" width="1" height="4" fill={color} />
      <rect x="8" y="4" width="1" height="2" fill={color} />
      <rect x="2" y="1" width="1" height="8" fill="rgba(0,0,0,0.2)" />
    </svg>
  );
}

export function PixelTrophy({ size = 16, color = '#fcd34d' }: { size?: number; color?: string }) {
  const dark = '#d97706';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="1" width="6" height="1" fill={color} />
      <rect x="1" y="2" width="1" height="2" fill={color} />
      <rect x="2" y="2" width="6" height="3" fill={color} />
      <rect x="8" y="2" width="1" height="2" fill={color} />
      <rect x="2" y="2" width="1" height="3" fill={dark} />
      <rect x="0" y="2" width="1" height="1" fill={dark} />
      <rect x="9" y="2" width="1" height="1" fill={dark} />
      <rect x="3" y="5" width="4" height="1" fill={color} />
      <rect x="3" y="5" width="1" height="1" fill={dark} />
      <rect x="3" y="6" width="4" height="1" fill={dark} />
      <rect x="2" y="7" width="6" height="1" fill={dark} />
      <rect x="3" y="7" width="4" height="1" fill={color} />
      <rect x="2" y="8" width="6" height="1" fill={dark} />
    </svg>
  );
}

export function PixelClose({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="2" height="2" fill={color} />
      <rect x="6" y="2" width="2" height="2" fill={color} />
      <rect x="3" y="3" width="1" height="1" fill={color} />
      <rect x="6" y="3" width="1" height="1" fill={color} />
      <rect x="4" y="4" width="2" height="2" fill={color} />
      <rect x="2" y="6" width="2" height="2" fill={color} />
      <rect x="6" y="6" width="2" height="2" fill={color} />
      <rect x="3" y="6" width="1" height="1" fill={color} />
      <rect x="6" y="6" width="1" height="1" fill={color} />
    </svg>
  );
}

export function PixelRestart({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  const dark = '#94a3b8';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="7" y="1" width="2" height="1" fill={color} />
      <rect x="6" y="2" width="3" height="1" fill={color} />
      <rect x="5" y="3" width="4" height="1" fill={color} />
      <rect x="4" y="4" width="5" height="1" fill={color} />
      <rect x="4" y="5" width="5" height="1" fill={color} />
      <rect x="5" y="6" width="4" height="1" fill={color} />
      <rect x="6" y="7" width="3" height="1" fill={color} />
      <rect x="7" y="8" width="2" height="1" fill={color} />
      <rect x="7" y="1" width="1" height="1" fill={dark} />
      <rect x="6" y="2" width="1" height="1" fill={dark} />
      <rect x="5" y="3" width="1" height="1" fill={dark} />
      <rect x="8" y="4" width="1" height="1" fill={dark} />
      <rect x="8" y="5" width="1" height="1" fill={dark} />
      <rect x="7" y="6" width="1" height="1" fill={dark} />
    </svg>
  );
}

export function PixelHome({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  const dark = '#94a3b8';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="1" width="2" height="1" fill={color} />
      <rect x="3" y="2" width="4" height="1" fill={color} />
      <rect x="2" y="3" width="6" height="1" fill={color} />
      <rect x="1" y="4" width="8" height="1" fill={color} />
      <rect x="1" y="5" width="8" height="4" fill={color} />
      <rect x="4" y="6" width="2" height="3" fill={dark} />
      <rect x="1" y="5" width="1" height="4" fill={dark} />
    </svg>
  );
}

export function PixelPalette({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="3" width="8" height="1" fill={color} />
      <rect x="1" y="4" width="8" height="3" fill={color} />
      <rect x="1" y="7" width="5" height="1" fill={color} />
      <rect x="2" y="8" width="3" height="1" fill={color} />
      <rect x="1" y="3" width="1" height="4" fill="#FF5A36" />
      <rect x="3" y="3" width="1" height="1" fill="#4ade80" />
      <rect x="5" y="3" width="1" height="1" fill="#60a5fa" />
      <rect x="7" y="3" width="1" height="1" fill="#fbbf24" />
      <rect x="2" y="5" width="1" height="1" fill="rgba(0,0,0,0.3)" />
      <rect x="6" y="6" width="1" height="1" fill="rgba(0,0,0,0.3)" />
    </svg>
  );
}

export function PixelLogout({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="2" width="5" height="1" fill={color} />
      <rect x="1" y="3" width="5" height="4" fill={color} />
      <rect x="1" y="7" width="5" height="1" fill={color} />
      <rect x="5" y="4" width="2" height="2" fill={color} />
      <rect x="7" y="3" width="1" height="4" fill={color} />
      <rect x="8" y="4" width="1" height="2" fill={color} />
      <rect x="2" y="2" width="1" height="6" fill="rgba(0,0,0,0.25)" />
      <rect x="7" y="3" width="1" height="1" fill="#94a3b8" />
    </svg>
  );
}

export function PixelSave({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  const dark = '#94a3b8';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="1" width="8" height="8" fill={color} />
      <rect x="1" y="1" width="8" height="1" fill={dark} />
      <rect x="2" y="2" width="5" height="2" fill="rgba(0,0,0,0.3)" />
      <rect x="3" y="3" width="3" height="1" fill={color} />
      <rect x="2" y="5" width="6" height="4" fill="rgba(0,0,0,0.2)" />
      <rect x="3" y="6" width="4" height="3" fill={color} />
      <rect x="4" y="7" width="2" height="2" fill="rgba(0,0,0,0.3)" />
      <rect x="1" y="1" width="1" height="8" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
}

export function PixelShuffle({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="2" width="3" height="1" fill={color} />
      <rect x="4" y="2" width="2" height="1" fill={color} />
      <rect x="6" y="3" width="1" height="1" fill={color} />
      <rect x="7" y="2" width="2" height="1" fill={color} />
      <rect x="7" y="3" width="1" height="1" fill={color} />
      <rect x="8" y="2" width="1" height="1" fill="rgba(0,0,0,0.3)" />
      <rect x="1" y="7" width="3" height="1" fill={color} />
      <rect x="4" y="7" width="2" height="1" fill={color} />
      <rect x="6" y="6" width="1" height="1" fill={color} />
      <rect x="7" y="7" width="2" height="1" fill={color} />
      <rect x="7" y="6" width="1" height="1" fill={color} />
    </svg>
  );
}

export function PixelBack({ size = 14, color = '#F1F5F9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="1" width="2" height="1" fill={color} />
      <rect x="3" y="2" width="2" height="1" fill={color} />
      <rect x="2" y="3" width="2" height="1" fill={color} />
      <rect x="1" y="4" width="2" height="2" fill={color} />
      <rect x="2" y="6" width="2" height="1" fill={color} />
      <rect x="3" y="7" width="2" height="1" fill={color} />
      <rect x="4" y="8" width="2" height="1" fill={color} />
      <rect x="1" y="4" width="1" height="2" fill="rgba(0,0,0,0.3)" />
    </svg>
  );
}

export function PixelCheck({ size = 14, color = '#4ade80' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="6" y="6" width="2" height="1" fill={color} />
      <rect x="5" y="7" width="2" height="1" fill={color} />
      <rect x="4" y="7" width="1" height="2" fill={color} />
      <rect x="3" y="8" width="2" height="1" fill={color} />
      <rect x="1" y="5" width="2" height="1" fill={color} />
      <rect x="2" y="6" width="2" height="1" fill={color} />
    </svg>
  );
}

export function PixelLock({ size = 14, color = '#94a3b8' }: { size?: number; color?: string }) {
  const dark = '#475569';
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="1" width="4" height="1" fill={color} />
      <rect x="2" y="2" width="1" height="3" fill={color} />
      <rect x="7" y="2" width="1" height="3" fill={color} />
      <rect x="3" y="2" width="4" height="1" fill={color} />
      <rect x="1" y="4" width="8" height="5" fill={dark} />
      <rect x="2" y="5" width="6" height="3" fill={color} />
      <rect x="4" y="6" width="2" height="2" fill={dark} />
      <rect x="1" y="4" width="1" height="5" fill="rgba(0,0,0,0.3)" />
    </svg>
  );
}

export function PixelUser({ size = 14, color = '#FF5A36' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="1" width="2" height="1" fill={color} />
      <rect x="3" y="2" width="4" height="2" fill={color} />
      <rect x="2" y="4" width="6" height="1" fill={color} />
      <rect x="1" y="5" width="8" height="4" fill={color} />
      <rect x="4" y="3" width="2" height="1" fill="#fef3c7" />
      <rect x="1" y="5" width="1" height="4" fill="rgba(0,0,0,0.2)" />
    </svg>
  );
}

export const pixelPrimaryButton: CSSProperties = {
  background: 'linear-gradient(180deg, #FF8A66 0%, #FF5A36 45%, #D83A18 100%)',
  color: '#FFFFFF',
  border: '2px solid #050a14',
  borderRadius: '4px',
  boxShadow: '0 5px 0 #050a14, inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.25)',
  fontFamily: 'monospace',
  textShadow: '1px 1px 0 #050a14',
  imageRendering: 'pixelated',
  letterSpacing: '0.05em',
};

export const pixelSecondaryButton: CSSProperties = {
  background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
  color: '#F1F5F9',
  border: '2px solid #050a14',
  borderRadius: '4px',
  boxShadow: '0 4px 0 #050a14, inset 0 2px 0 rgba(148,163,184,0.1), inset 0 -2px 0 rgba(0,0,0,0.3)',
  fontFamily: 'monospace',
  textShadow: '1px 1px 0 #050a14',
  imageRendering: 'pixelated',
};

export const pixelStar: CSSProperties = {
  display: 'inline-block',
  width: '12px',
  height: '12px',
  imageRendering: 'pixelated',
};
