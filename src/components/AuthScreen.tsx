import { useState, useRef } from 'react';
import { User, UserPlus, LogIn, Gamepad2, Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onGuestPlay: () => void;
  onSignIn: (username: string, password: string) => Promise<{ error: string | null }>;
  onSignUp: (username: string, password: string) => Promise<{ error: string | null }>;
  onSecretUnlock: () => void;
}

type Mode = 'choose' | 'signin' | 'signup';

export function AuthScreen({ onGuestPlay, onSignIn, onSignUp, onSecretUnlock }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('choose');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const titleTapCount = useRef(0);
  const titleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = () => {
    titleTapCount.current += 1;

    if (titleTapTimer.current) clearTimeout(titleTapTimer.current);
    titleTapTimer.current = setTimeout(() => {
      titleTapCount.current = 0;
    }, 600);

    if (titleTapCount.current >= 3) {
      titleTapCount.current = 0;
      if (titleTapTimer.current) clearTimeout(titleTapTimer.current);
      onSecretUnlock();
    }
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password) return;
    setError(null);
    setLoading(true);
    const result = mode === 'signin'
      ? await onSignIn(username.trim().toLowerCase(), password)
      : await onSignUp(username.trim().toLowerCase(), password);
    setLoading(false);
    if (result.error) setError(result.error);
  };

  if (mode === 'choose') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1e293b 50%, #334155 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }} />

        <div className="absolute top-8 left-6 w-3 h-3 animate-[pulse-glow_3s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.3)' }} />
        <div className="absolute top-16 right-10 w-2 h-2 animate-[pulse-glow_4s_ease-in-out_infinite]" style={{ background: 'rgba(241,245,249,0.2)' }} />
        <div className="absolute bottom-20 left-12 w-4 h-4 animate-[pulse-glow_5s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.2)' }} />

        <div className="relative flex flex-col items-center gap-6 px-6 animate-[fadeIn_0.5s_ease-out] z-10">
          <div className="text-center">
            <h1
              onClick={handleTitleClick}
              className="text-5xl sm:text-6xl tracking-tight cursor-pointer select-none"
              style={{
                color: '#FF5A36',
                textShadow: '4px 4px 0 #0F172A, 8px 8px 0 rgba(241,245,249,0.15)',
                fontFamily: 'monospace', fontWeight: 900, letterSpacing: '-0.02em',
              }}
            >
              <span>Salta</span><span className="relative text-white">CIÓN<span className="absolute left-[43%] top-[56%] h-[6px] w-[25%] -translate-y-1/2 bg-[#FF5A36]" /></span>
            </h1>
            <p className="text-[#F1F5F9]/50 text-sm mt-3 font-mono tracking-[0.3em]">
              SALTA · SALTA · SALTA
            </p>
          </div>

          <div className="flex flex-col gap-3 w-60">
            <button
              onClick={onGuestPlay}
              className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-lg transition-transform hover:scale-105 active:scale-95"
              style={{
                background: '#FF5A36', color: '#FFFFFF', borderRadius: '4px',
                border: '2px solid #0F172A', boxShadow: '0 4px 0 #0F172A, 0 6px 8px rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
              }}
            >
              <Gamepad2 size={22} />
              Jugar como invitado
            </button>
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors hover:border-[#FF5A36]/50"
              style={{
                background: 'rgba(15,23,42,0.8)', color: '#F1F5F9',
                border: '2px solid rgba(241,245,249,0.3)', borderRadius: '4px', fontFamily: 'monospace',
              }}
            >
              <LogIn size={20} />
              Iniciar sesión
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors hover:border-[#FF5A36]/50"
              style={{
                background: 'rgba(15,23,42,0.8)', color: '#F1F5F9',
                border: '2px solid rgba(241,245,249,0.3)', borderRadius: '4px', fontFamily: 'monospace',
              }}
            >
              <UserPlus size={20} />
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1e293b 50%, #334155 100%)' }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />

      <div className="relative flex flex-col items-center gap-5 px-6 animate-[fadeIn_0.4s_ease-out] z-10 w-64">
        <h2 className="text-3xl font-black font-mono flex items-center gap-2" style={{ color: '#FF5A36', textShadow: '3px 3px 0 #0F172A' }}>
          {mode === 'signin' ? <><LogIn size={26} /> Iniciar sesión</> : <><UserPlus size={26} /> Crear cuenta</>}
        </h2>

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[#F1F5F9]/60 text-xs font-mono uppercase tracking-wider">Nombre de usuario</label>
            <div className="flex items-center gap-2 px-3" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px' }}>
              <User size={16} className="text-[#F1F5F9]/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre..."
                maxLength={20}
                className="flex-1 py-2.5 font-mono bg-transparent outline-none"
                style={{ color: '#F1F5F9' }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#F1F5F9]/60 text-xs font-mono uppercase tracking-wider">Contraseña</label>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 flex items-center px-3" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 font-mono bg-transparent outline-none"
                  style={{ color: '#F1F5F9' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="w-11 flex items-center justify-center text-[#F1F5F9]/60 hover:text-[#F1F5F9] transition-colors"
                style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.2)', borderRadius: '4px' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm font-mono text-center px-2 py-1" style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!username.trim() || !password || loading}
            className="flex items-center justify-center gap-2 px-4 py-3 font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 mt-1"
            style={{
              background: '#FF5A36', color: '#FFFFFF',
              border: '2px solid #0F172A', borderRadius: '4px',
              boxShadow: '0 4px 0 #0F172A', fontFamily: 'monospace',
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (mode === 'signin' ? <LogIn size={20} /> : <UserPlus size={20} />)}
            {loading ? 'Cargando...' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
          </button>

          <button
            onClick={() => { setMode('choose'); setError(null); setUsername(''); setPassword(''); }}
            className="text-[#F1F5F9]/50 text-sm font-mono hover:text-[#FF5A36] transition-colors text-center"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
