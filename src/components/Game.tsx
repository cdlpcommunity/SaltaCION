import { useEffect, useState, useRef, useCallback } from 'react';
import { GameEngine } from '@/game/engine';
import { Renderer } from '@/game/renderer';
import { soundManager } from '@/game/sound';
import type { GameSnapshot, ViewMode } from '@/game/types';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/hooks/useAuth';
import { useCharacter } from '@/hooks/useCharacter';
import { MenuScreen } from '@/components/MenuScreen';
import { GameOverScreen } from '@/components/GameOverScreen';
import { HUD } from '@/components/HUD';
import { MobileControls } from '@/components/MobileControls';
import { ViewToggle } from '@/components/ViewToggle';
import { FullscreenButton } from '@/components/FullscreenButton';
import { PauseScreen } from '@/components/PauseScreen';
import { RouletteScreen } from '@/components/RouletteScreen';
import { Leaderboard } from '@/components/Leaderboard';
import { AuthScreen } from '@/components/AuthScreen';
import { CharacterCustomizationScreen } from '@/components/CharacterCustomizationScreen';
import { ZoneTestScreen } from '@/components/ZoneTestScreen';
import { DEFAULT_CUSTOMIZATION } from '@/game/characterTypes';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot>({
    state: 'menu', score: 0, coins: 0, height: 0, lives: 1,
    hasJetpack: false, hasPropeller: false, hasShield: false, hasSpringShoes: false,
    jetpackFuel: 0, propellerFuel: 0,
    zone: 'innerCore', zoneName: 'Núcleo Interno', zoneSubtitle: 'La Semilla de Hierro',
    rouletteReady: false,
    isZoneTest: false,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('auto');
  const [isMobile, setIsMobile] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showZoneTest, setShowZoneTest] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { scores, customizations, loading: lbLoading, submitScore, refetch } = useLeaderboard();
  const { customization, loading: charLoading, needsSetup, saveCustomization, spidermanUnlocked, unlockSpiderman } = useCharacter(user?.id ?? null);

  const effectiveView = viewMode === 'auto' ? (isMobile ? 'mobile' : 'desktop') : viewMode;
  const showMobileControls = effectiveView === 'mobile';

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!authLoading) setAuthReady(true);
  }, [authLoading]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new GameEngine();
    engine.setOnStateChange(setSnapshot);
    const renderer = new Renderer(canvasRef.current);
    engineRef.current = engine;
    rendererRef.current = renderer;
    engine.start();

    let rafId = 0;
    const renderLoop = () => {
      renderer.render(engine);
      rafId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(rafId);
      engine.stop();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, down: boolean) => {
      const engine = engineRef.current;
      if (!engine) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        engine.inputLeft = down;
        if (down) e.preventDefault();
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        engine.inputRight = down;
        if (down) e.preventDefault();
      }
      if (down && e.key === ' ') {
        if (engine.state === 'menu') engine.startGame();
        else if (engine.state === 'gameover') {
          engine.startGame();
        }
        else if (engine.state === 'paused') engine.resumeGame();
        e.preventDefault();
      }
      if (down && (e.key === 'p' || e.key === 'P' || e.key === 'Escape')) {
        if (engine.state === 'playing') engine.pauseGame();
        else if (engine.state === 'paused') engine.resumeGame();
      }
    };
    const kd = (e: KeyboardEvent) => handleKey(e, true);
    const ku = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, []);

  const handleStart = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.inputLeft = false;
      engine.inputRight = false;
      engine.startGame();
    }
  }, []);

  const handlePause = useCallback(() => {
    engineRef.current?.pauseGame();
  }, []);

  const handleResume = useCallback(() => {
    engineRef.current?.resumeGame();
  }, []);

  const handleRestart = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.inputLeft = false;
      engine.inputRight = false;
      engine.startGame();
    }
  }, []);

  const handleMenu = useCallback(() => {
    engineRef.current?.goToMenu();
  }, []);

  const handleSecretUnlock = useCallback(() => {
    setShowZoneTest(true);
  }, []);

  const handleZoneTest = useCallback((zoneIndex: number) => {
    setShowZoneTest(false);
    const engine = engineRef.current;
    if (engine) {
      engine.inputLeft = false;
      engine.inputRight = false;
      engine.startZoneTest(zoneIndex);
    }
  }, []);

  const handleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    soundManager.setMuted(newMuted);
  }, [muted]);

  const handleRoulette = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.pauseForRoulette();
    setShowRoulette(true);
  }, []);

  const handleRouletteResult = useCallback((item: 'jetpack' | 'propeller' | 'spring_shoes' | 'shield' | 'extra_life') => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.spinRoulette(item);
    engine.resumeGame();
    setShowRoulette(false);
  }, []);

  const handleSubmitScore = useCallback(async (name: string) => {
    await submitScore(name, snapshot.score, snapshot.coins, snapshot.height);
  }, [submitScore, snapshot.score, snapshot.coins, snapshot.height]);

  const setMobileInput = useCallback((left: boolean, right: boolean) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.inputLeft = left;
    engine.inputRight = right;
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setCustomization(customization);
    }
  }, [customization]);

  const handleSignUp = useCallback(async (username: string, password: string) => {
    const result = await signUp(username, password);
    if (!result.error) {
      setJustSignedUp(true);
    }
    return result;
  }, [signUp]);

  const handleSaveCustomization = useCallback(async (c: typeof DEFAULT_CUSTOMIZATION) => {
    const ok = await saveCustomization(c);
    if (ok) {
      setShowCustomization(false);
      setJustSignedUp(false);
    }
    return ok;
  }, [saveCustomization]);

  const handleCancelCustomization = useCallback(() => {
    setShowCustomization(false);
  }, []);

  const showAuthScreen = authReady && !user && snapshot.state === 'menu' && !showLeaderboard && !showCustomization && !showZoneTest;

  const showFirstTimeCustomization = user && justSignedUp && needsSetup && !charLoading && !showLeaderboard;
  const showMenuCustomization = showCustomization && user && !showFirstTimeCustomization;

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center select-none touch-none"
      style={{ background: '#0F172A' }}
    >
      <div
        className="relative shadow-2xl"
        style={isMobile ? {
          width: '100vw',
          height: '100dvh',
          maxWidth: 'none',
        } : {
          width: 'min(100vw, calc(100vh * 400 / 600))',
          height: 'min(100vh, calc(100vw * 600 / 400))',
          maxWidth: '500px',
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ imageRendering: 'pixelated' }}
        />

        {snapshot.state === 'playing' && (
          <HUD
            score={snapshot.score}
            coins={snapshot.coins}
            height={snapshot.height}
            hasJetpack={snapshot.hasJetpack}
            hasPropeller={snapshot.hasPropeller}
            hasShield={snapshot.hasShield}
            jetpackFuel={snapshot.jetpackFuel}
            propellerFuel={snapshot.propellerFuel}
            muted={muted}
            onMute={handleMute}
            onPause={handlePause}
            onRoulette={handleRoulette}
            rouletteReady={snapshot.rouletteReady}
            zoneName={snapshot.zoneName}
            zoneSubtitle={snapshot.zoneSubtitle}
            zone={snapshot.zone}
          />
        )}

        {snapshot.state === 'playing' && showMobileControls && (
          <MobileControls onInput={setMobileInput} />
        )}

        {showAuthScreen && (
          <AuthScreen
            onGuestPlay={handleStart}
            onSignIn={signIn}
            onSignUp={handleSignUp}
            onSecretUnlock={handleSecretUnlock}
          />
        )}

        {!showAuthScreen && !showFirstTimeCustomization && !showMenuCustomization && !showZoneTest && snapshot.state === 'menu' && (
          <MenuScreen
            onStart={handleStart}
            onShowLeaderboard={() => { refetch(); setShowLeaderboard(true); }}
            onShowCustomization={() => setShowCustomization(true)}
            highScore={scores[0]?.score ?? 0}
            user={user}
            customization={customization}
            onSignOut={signOut}
            onSecretUnlock={handleSecretUnlock}
          />
        )}

        {showZoneTest && (
          <ZoneTestScreen
            onBack={() => setShowZoneTest(false)}
            onSelectZone={handleZoneTest}
          />
        )}

        {showFirstTimeCustomization && (
          <CharacterCustomizationScreen
            initial={customization}
            onSave={handleSaveCustomization}
            onCancel={handleCancelCustomization}
            title="¡Crea tu personaje!"
            isFirstTime
            spidermanUnlocked={spidermanUnlocked}
            onUnlockSpiderman={unlockSpiderman}
          />
        )}

        {showMenuCustomization && (
          <CharacterCustomizationScreen
            initial={customization}
            onSave={handleSaveCustomization}
            onCancel={handleCancelCustomization}
            title="Personaliza tu personaje"
            spidermanUnlocked={spidermanUnlocked}
            onUnlockSpiderman={unlockSpiderman}
          />
        )}

        {snapshot.state === 'paused' && !showRoulette && (
          <PauseScreen onResume={handleResume} onRestart={handleRestart} onMenu={handleMenu} />
        )}

        {showRoulette && (
          <RouletteScreen onResult={handleRouletteResult} />
        )}

        {snapshot.state === 'gameover' && (
          <GameOverScreen
            score={snapshot.score}
            coins={snapshot.coins}
            height={snapshot.height}
            onRestart={handleRestart}
            onSubmitScore={handleSubmitScore}
            onShowLeaderboard={() => { refetch(); setShowLeaderboard(true); }}
            onMenu={handleMenu}
            user={user}
            isZoneTest={snapshot.isZoneTest}
          />
        )}

        {showLeaderboard && (
          <Leaderboard
            scores={scores}
            customizations={customizations}
            loading={lbLoading}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        <FullscreenButton />
        <ViewToggle mode={viewMode} onChange={setViewMode} isMobile={isMobile} />
      </div>
    </div>
  );
}
