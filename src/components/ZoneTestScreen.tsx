import { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { ZONES } from '@/game/zones';
import type { ZonePalette } from '@/game/zones';
import { soundManager } from '@/game/sound';

interface ZoneTestScreenProps {
  onBack: () => void;
  onSelectZone: (zoneIndex: number) => void;
}

const PASSWORD = '900932';

export function ZoneTestScreen({ onBack, onSelectZone }: ZoneTestScreenProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleTitleClick = () => {
    if (!unlocked) {
      setShowPasswordModal(true);
      soundManager.play('hit');
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === PASSWORD) {
      setUnlocked(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setError(false);
      soundManager.play('start');
    } else {
      setError(true);
      soundManager.play('hit');
      setTimeout(() => setError(false), 600);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setError(false);
  };

  const handleZoneClick = (zone: ZonePalette, index: number) => {
    if (!unlocked) return;
    onSelectZone(index);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center z-30 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1e293b 50%, #0F172A 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative w-full max-w-md px-4 py-6 flex flex-col items-center gap-4 z-10">
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 font-mono text-sm transition-colors"
          style={{
            color: '#F1F5F9',
            background: 'rgba(15,23,42,0.8)',
            border: '2px solid rgba(241,245,249,0.2)',
            borderRadius: '4px',
          }}
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        {/* Title */}
        <div className="mt-10 text-center cursor-pointer select-none" onClick={handleTitleClick}>
          <h1
            className="text-3xl font-mono font-black tracking-tight transition-transform hover:scale-105"
            style={{
              color: unlocked ? '#FF5A36' : '#F1F5F9',
              textShadow: '3px 3px 0 #0F172A, 6px 6px 0 rgba(241,245,249,0.1)',
            }}
          >
            Catálogo de Zonas
          </h1>
          <p className="text-[#F1F5F9]/40 text-xs mt-1 font-mono tracking-[0.2em]">
            {unlocked ? 'ACCESO CONCEDIDO' : 'BLOQUEADO · Toca el título 3 veces'}
          </p>
          {unlocked && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Check size={14} className="text-green-400" />
              <span className="text-green-400 text-xs font-mono">Desbloqueado</span>
            </div>
          )}
        </div>

        {/* Zone grid */}
        <div className="w-full grid grid-cols-1 gap-3 mt-2">
          {ZONES.map((zone, index) => {
            const isLocked = !unlocked;
            return (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone, index)}
                disabled={isLocked}
                className="relative flex items-center gap-3 p-3 transition-all text-left"
                style={{
                  background: isLocked
                    ? 'rgba(15,23,42,0.6)'
                    : 'rgba(15,23,42,0.9)',
                  border: `2px solid ${
                    isLocked
                      ? 'rgba(241,245,249,0.08)'
                      : `${zone.bgGradient[2]}55`
                  }`,
                  borderRadius: '4px',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.5 : 1,
                }}
              >
                {/* Zone preview thumbnail */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded relative overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, ${zone.bgGradient[0]}, ${zone.bgGradient[1]}, ${zone.bgGradient[2]}, ${zone.bgGradient[3]})`,
                    border: '1px solid rgba(241,245,249,0.1)',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${zone.ambientGlow}, transparent 70%)`,
                    }}
                  />
                  <div
                    className="absolute bottom-1 left-2 w-8 h-1.5 rounded-sm"
                    style={{ background: zone.platformNormal.top }}
                  />
                  <div
                    className="absolute bottom-3 left-4 w-6 h-1 rounded-sm"
                    style={{ background: zone.platformMoving.top }}
                  />
                  <div
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: zone.particleColor }}
                  />
                  <div
                    className="absolute top-4 left-2 w-1 h-1 rounded-full"
                    style={{ background: zone.particleColor2 }}
                  />
                </div>

                {/* Zone info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F1F5F9]/30 text-xs font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="font-mono font-bold text-sm truncate"
                      style={{ color: isLocked ? '#F1F5F9' : zone.particleColor }}
                    >
                      {zone.name}
                    </h3>
                  </div>
                  <p className="text-[#F1F5F9]/50 text-xs font-mono mt-0.5 truncate">
                    {zone.subtitle}
                  </p>
                  <p className="text-[#F1F5F9]/30 text-[10px] font-mono mt-0.5">
                    Altura: {zone.heightThreshold.toLocaleString()}
                  </p>
                </div>

                {/* Lock / Play icon */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <Lock size={18} className="text-[#F1F5F9]/30" />
                  ) : (
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded"
                      style={{
                        background: zone.particleColor,
                        color: '#0F172A',
                      }}
                    >
                      <Eye size={16} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="h-4" />
      </div>

      {/* Password modal */}
      {showPasswordModal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-40"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={handlePasswordCancel}
        >
          <div
            className="relative w-72 p-6 flex flex-col items-center gap-4 animate-[fadeIn_0.2s_ease-out]"
            style={{
              background: 'linear-gradient(180deg, #1e293b, #0F172A)',
              border: '2px solid rgba(255,90,54,0.4)',
              borderRadius: '6px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-[#FF5A36]" />
              <h2 className="text-[#F1F5F9] font-mono font-bold text-lg">
                Acceso Restringido
              </h2>
            </div>
            <p className="text-[#F1F5F9]/50 text-xs font-mono text-center">
              Introduce la contraseña para desbloquear el catálogo de zonas
            </p>

            <div className="w-full flex items-center gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePasswordSubmit();
                  if (e.key === 'Escape') handlePasswordCancel();
                }}
                autoFocus
                placeholder="Contraseña"
                className="flex-1 px-3 py-2 font-mono text-sm text-[#F1F5F9] outline-none"
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  border: `2px solid ${error ? '#ef4444' : 'rgba(241,245,249,0.2)'}`,
                  borderRadius: '4px',
                  animation: error ? 'shake 0.4s' : undefined,
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="w-9 h-9 flex items-center justify-center text-[#F1F5F9]/50 hover:text-[#F1F5F9] transition-colors"
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  border: '2px solid rgba(241,245,249,0.2)',
                  borderRadius: '4px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono">Contraseña incorrecta</p>
            )}

            <div className="flex gap-2 w-full">
              <button
                onClick={handlePasswordCancel}
                className="flex-1 px-4 py-2 font-mono text-sm font-semibold transition-colors"
                style={{
                  color: '#F1F5F9',
                  background: 'rgba(15,23,42,0.8)',
                  border: '2px solid rgba(241,245,249,0.2)',
                  borderRadius: '4px',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 px-4 py-2 font-mono text-sm font-bold transition-transform hover:scale-105"
                style={{
                  color: '#FFFFFF',
                  background: '#FF5A36',
                  border: '2px solid #0F172A',
                  borderRadius: '4px',
                  boxShadow: '0 3px 0 #0F172A',
                }}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
