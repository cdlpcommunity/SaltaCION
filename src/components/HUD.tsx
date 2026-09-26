import { Pause, Volume2, VolumeX } from 'lucide-react';
import type { ZoneId } from '@/game/zones';

interface HUDProps {
  coins: number;
  height: number;
  lives: number;
  hasJetpack: boolean;
  hasPropeller: boolean;
  hasShield: boolean;
  jetpackFuel: number;
  propellerFuel: number;
  muted: boolean;
  onMute: () => void;
  onPause: () => void;
  onRoulette: () => void;
  rouletteReady: boolean;
  zoneName: string;
  zoneSubtitle: string;
  zone: ZoneId;
}

interface ZoneSignStyle {
  boardBg: string;
  boardShadow: string;
  innerBg: string;
  borderColor: string;
  innerShadow: string;
  outerShadow: string;
  titleColor: string;
  subtitleColor: string;
  barTop: string;
  barBottom: string;
  barInner: string;
  poleColor: string;
  poleAccent: string;
  chainColor: string;
  chainHighlight: string;
}

const ZONE_SIGN_STYLES: Record<ZoneId, ZoneSignStyle> = {
  innerCore: {
    boardBg: '#0B0F18',
    boardShadow: 'inset 0 -7px #7A382D',
    innerBg: 'linear-gradient(180deg, #C94452 0 62%, #9C2E3E 62% 100%)',
    borderColor: '#E5B84F',
    innerShadow: 'inset 0 -4px #B56A2D',
    outerShadow: '0 4px #D77A2D',
    titleColor: '#FFF7E6',
    subtitleColor: '#FFE0B2',
    barTop: '#C9B49E',
    barBottom: '#5B4A42',
    barInner: 'linear-gradient(#A18C7C 0 48%, #79665B 48% 100%)',
    poleColor: '#0B0F18',
    poleAccent: '#E6B84C',
    chainColor: '#8D7566',
    chainHighlight: '#0B0F18',
  },
  outerCore: {
    boardBg: '#1a0600',
    boardShadow: 'inset 0 -7px #8a3000',
    innerBg: 'linear-gradient(180deg, #ff6600 0 62%, #cc4400 62% 100%)',
    borderColor: '#ffcc00',
    innerShadow: 'inset 0 -4px #cc7700',
    outerShadow: '0 4px #ff5500',
    titleColor: '#fff5e0',
    subtitleColor: '#ffd9a0',
    barTop: '#cc8844',
    barBottom: '#553015',
    barInner: 'linear-gradient(#aa6633 0 48%, #664020 48% 100%)',
    poleColor: '#1a0600',
    poleAccent: '#ff9900',
    chainColor: '#aa5522',
    chainHighlight: '#1a0600',
  },
  mantle: {
    boardBg: '#1a0e02',
    boardShadow: 'inset 0 -7px #5a3a10',
    innerBg: 'linear-gradient(180deg, #8a6030 0 62%, #6a4820 62% 100%)',
    borderColor: '#cc9933',
    innerShadow: 'inset 0 -4px #7a5520',
    outerShadow: '0 4px #aa7730',
    titleColor: '#fff0d0',
    subtitleColor: '#e8d0a0',
    barTop: '#aa8855',
    barBottom: '#4a3520',
    barInner: 'linear-gradient(#886a40 0 48%, #5a4528 48% 100%)',
    poleColor: '#1a0e02',
    poleAccent: '#cc9933',
    chainColor: '#7a5a35',
    chainHighlight: '#1a0e02',
  },
  crust: {
    boardBg: '#1a1408',
    boardShadow: 'inset 0 -7px #6a5025',
    innerBg: 'linear-gradient(180deg, #a08050 0 62%, #806038 62% 100%)',
    borderColor: '#d4a868',
    innerShadow: 'inset 0 -4px #8a6838',
    outerShadow: '0 4px #b89050',
    titleColor: '#fff8e0',
    subtitleColor: '#f0dca8',
    barTop: '#b89868',
    barBottom: '#504028',
    barInner: 'linear-gradient(#9a7a48 0 48%, #6a5238 48% 100%)',
    poleColor: '#1a1408',
    poleAccent: '#d4a868',
    chainColor: '#8a7048',
    chainHighlight: '#1a1408',
  },
  troposphere: {
    boardBg: '#0a1a2a',
    boardShadow: 'inset 0 -7px #2a5870',
    innerBg: 'linear-gradient(180deg, #4080b0 0 62%, #2a6090 62% 100%)',
    borderColor: '#80c0e8',
    innerShadow: 'inset 0 -4px #3070a0',
    outerShadow: '0 4px #5090c0',
    titleColor: '#f0f8ff',
    subtitleColor: '#c0e0f8',
    barTop: '#7090b0',
    barBottom: '#2a4858',
    barInner: 'linear-gradient(#5080a0 0 48%, #385878 48% 100%)',
    poleColor: '#0a1a2a',
    poleAccent: '#80c0e8',
    chainColor: '#5080a0',
    chainHighlight: '#0a1a2a',
  },
  stratosphere: {
    boardBg: '#0a0820',
    boardShadow: 'inset 0 -7px #4030a0',
    innerBg: 'linear-gradient(180deg, #7060c0 0 62%, #5040a0 62% 100%)',
    borderColor: '#c0a0ff',
    innerShadow: 'inset 0 -4px #5038a0',
    outerShadow: '0 4px #6050b0',
    titleColor: '#f0e8ff',
    subtitleColor: '#d0c0f0',
    barTop: '#8878b0',
    barBottom: '#382868',
    barInner: 'linear-gradient(#6858a0 0 48%, #483880 48% 100%)',
    poleColor: '#0a0820',
    poleAccent: '#c0a0ff',
    chainColor: '#6858a0',
    chainHighlight: '#0a0820',
  },
  mesosphere: {
    boardBg: '#020810',
    boardShadow: 'inset 0 -7px #106080',
    innerBg: 'linear-gradient(180deg, #20a0c0 0 62%, #107090 62% 100%)',
    borderColor: '#40e0ff',
    innerShadow: 'inset 0 -4px #108098',
    outerShadow: '0 4px #2090b0',
    titleColor: '#e0f8ff',
    subtitleColor: '#a0e0f0',
    barTop: '#508898',
    barBottom: '#103848',
    barInner: 'linear-gradient(#307080 0 48%, #105060 48% 100%)',
    poleColor: '#020810',
    poleAccent: '#40e0ff',
    chainColor: '#307080',
    chainHighlight: '#020810',
  },
  exosphere: {
    boardBg: '#020410',
    boardShadow: 'inset 0 -7px #103060',
    innerBg: 'linear-gradient(180deg, #2050a0 0 62%, #103080 62% 100%)',
    borderColor: '#60a0e0',
    innerShadow: 'inset 0 -4px #103870',
    outerShadow: '0 4px #205090',
    titleColor: '#e0e8ff',
    subtitleColor: '#a0c0e0',
    barTop: '#406088',
    barBottom: '#102040',
    barInner: 'linear-gradient(#204878 0 48%, #103060 48% 100%)',
    poleColor: '#020410',
    poleAccent: '#60a0e0',
    chainColor: '#204878',
    chainHighlight: '#020410',
  },
  orbit: {
    boardBg: '#080004',
    boardShadow: 'inset 0 -7px #804010',
    innerBg: 'linear-gradient(180deg, #cc8020 0 62%, #aa6010 62% 100%)',
    borderColor: '#ffd040',
    innerShadow: 'inset 0 -4px #aa6010',
    outerShadow: '0 4px #cc7020',
    titleColor: '#fff8e0',
    subtitleColor: '#ffe0a0',
    barTop: '#aa8040',
    barBottom: '#402010',
    barInner: 'linear-gradient(#886020 0 48%, #604010 48% 100%)',
    poleColor: '#080004',
    poleAccent: '#ffd040',
    chainColor: '#886020',
    chainHighlight: '#080004',
  },
  interstellar: {
    boardBg: '#040010',
    boardShadow: 'inset 0 -7px #5030a0',
    innerBg: 'linear-gradient(180deg, #8050d0 0 62%, #5030a0 62% 100%)',
    borderColor: '#c080ff',
    innerShadow: 'inset 0 -4px #6030b0',
    outerShadow: '0 4px #8050d0',
    titleColor: '#f0e0ff',
    subtitleColor: '#d0b0f0',
    barTop: '#6048a0',
    barBottom: '#201038',
    barInner: 'linear-gradient(#503890 0 48%, #302068 48% 100%)',
    poleColor: '#040010',
    poleAccent: '#c080ff',
    chainColor: '#503890',
    chainHighlight: '#040010',
  },
  milkyWay: {
    boardBg: '#020010',
    boardShadow: 'inset 0 -7px #1050a0',
    innerBg: 'linear-gradient(180deg, #3080d0 0 62%, #1050a0 62% 100%)',
    borderColor: '#60a0ff',
    innerShadow: 'inset 0 -4px #2070b0',
    outerShadow: '0 4px #3080d0',
    titleColor: '#e0f0ff',
    subtitleColor: '#a0c0f0',
    barTop: '#4068a0',
    barBottom: '#102840',
    barInner: 'linear-gradient(#205088 0 48%, #103868 48% 100%)',
    poleColor: '#020010',
    poleAccent: '#60a0ff',
    chainColor: '#205088',
    chainHighlight: '#020010',
  },
  observableUniverse: {
    boardBg: '#020008',
    boardShadow: 'inset 0 -7px #103870',
    innerBg: 'linear-gradient(180deg, #2070b0 0 62%, #104080 62% 100%)',
    borderColor: '#4080e0',
    innerShadow: 'inset 0 -4px #105890',
    outerShadow: '0 4px #2070b0',
    titleColor: '#e0e8ff',
    subtitleColor: '#98b8e0',
    barTop: '#284878',
    barBottom: '#081830',
    barInner: 'linear-gradient(#183868 0 48%, #082848 48% 100%)',
    poleColor: '#020008',
    poleAccent: '#4080e0',
    chainColor: '#183868',
    chainHighlight: '#020008',
  },
  multiverse: {
    boardBg: '#080008',
    boardShadow: 'inset 0 -7px #802070',
    innerBg: 'linear-gradient(180deg, #c040a0 0 62%, #802070 62% 100%)',
    borderColor: '#e040c0',
    innerShadow: 'inset 0 -4px #902080',
    outerShadow: '0 4px #c040a0',
    titleColor: '#ffe0f0',
    subtitleColor: '#e0a0d0',
    barTop: '#804068',
    barBottom: '#301020',
    barInner: 'linear-gradient(#602050 0 48%, #401038 48% 100%)',
    poleColor: '#080008',
    poleAccent: '#e040c0',
    chainColor: '#602050',
    chainHighlight: '#080008',
  },
  hyperspace: {
    boardBg: '#000200',
    boardShadow: 'inset 0 -7px #605010',
    innerBg: 'linear-gradient(180deg, #a09030 0 62%, #806820 62% 100%)',
    borderColor: '#e0c040',
    innerShadow: 'inset 0 -4px #887020',
    outerShadow: '0 4px #a08830',
    titleColor: '#fff8d0',
    subtitleColor: '#e8d898',
    barTop: '#887840',
    barBottom: '#302810',
    barInner: 'linear-gradient(#605028 0 48%, #403818 48% 100%)',
    poleColor: '#000200',
    poleAccent: '#e0c040',
    chainColor: '#605028',
    chainHighlight: '#000200',
  },
  empyrean: {
    boardBg: '#020000',
    boardShadow: 'inset 0 -7px #805010',
    innerBg: 'linear-gradient(180deg, #e0a040 0 62%, #b07020 62% 100%)',
    borderColor: '#ffd060',
    innerShadow: 'inset 0 -4px #b07820',
    outerShadow: '0 4px #d09030',
    titleColor: '#fff5d8',
    subtitleColor: '#f0d098',
    barTop: '#a07838',
    barBottom: '#402808',
    barInner: 'linear-gradient(#806020 0 48%, #604010 48% 100%)',
    poleColor: '#020000',
    poleAccent: '#ffd060',
    chainColor: '#806020',
    chainHighlight: '#020000',
  },
  apeiron: {
    boardBg: '#000000',
    boardShadow: 'inset 0 -7px #401080',
    innerBg: 'linear-gradient(180deg, #6020a0 0 62%, #401080 62% 100%)',
    borderColor: '#a040c0',
    innerShadow: 'inset 0 -4px #502090',
    outerShadow: '0 4px #6020a0',
    titleColor: '#e0c8ff',
    subtitleColor: '#b890d0',
    barTop: '#503080',
    barBottom: '#180830',
    barInner: 'linear-gradient(#382060 0 48%, #201040 48% 100%)',
    poleColor: '#000000',
    poleAccent: '#a040c0',
    chainColor: '#382060',
    chainHighlight: '#000000',
  },
  motorInmovil: {
    boardBg: '#000000',
    boardShadow: 'inset 0 -7px #808040',
    innerBg: 'linear-gradient(180deg, #e8e080 0 62%, #b0a850 62% 100%)',
    borderColor: '#ffffa0',
    innerShadow: 'inset 0 -4px #b0a850',
    outerShadow: '0 4px #c0b860',
    titleColor: '#fffef0',
    subtitleColor: '#f0e8c0',
    barTop: '#a0a068',
    barBottom: '#383820',
    barInner: 'linear-gradient(#807840 0 48%, #585020 48% 100%)',
    poleColor: '#000000',
    poleAccent: '#ffffa0',
    chainColor: '#807840',
    chainHighlight: '#000000',
  },
};

const JETPACK_MAX_FUEL = 3;
const PROPELLER_MAX_FUEL = 4;

export function HUD({ coins, height, lives, hasJetpack, hasPropeller, hasShield, jetpackFuel, propellerFuel, muted, onMute, onPause, onRoulette, rouletteReady, zoneName, zoneSubtitle, zone }: HUDProps) {
  const s = ZONE_SIGN_STYLES[zone] ?? ZONE_SIGN_STYLES.innerCore;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex items-start justify-between p-3">
        <div className="flex flex-col gap-1">
          <div className="px-3 py-1.5" style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}>
            <span className="text-[#F1F5F9] font-mono text-lg font-bold">{height}m</span>
          </div>
          <div className="flex gap-1.5">
            <div className="px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,90,54,0.3)', borderRadius: '3px' }}>
              <span className="text-[#FF5A36] text-xs">●</span>
              <span className="text-[#F1F5F9] font-mono text-xs font-bold">{coins}</span>
            </div>
            {lives > 1 && (
              <div className="px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '3px' }}>
                <span className="text-[#ef4444] text-xs">❤</span>
                <span className="text-[#F1F5F9] font-mono text-xs font-bold">{lives}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="flex gap-1.5">
            <button
              onClick={onMute}
              className="w-8 h-8 flex items-center justify-center text-[#F1F5F9] transition-colors hover:bg-[#FF5A36]/20"
              style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={onPause}
              className="w-8 h-8 flex items-center justify-center text-[#F1F5F9] transition-colors hover:bg-[#FF5A36]/20"
              style={{ background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(241,245,249,0.15)', borderRadius: '4px' }}
            >
              <Pause size={16} />
            </button>
          </div>

          {/* ====== ZONE SIGN ====== */}
          <div
            key={zoneName}
            className="relative w-[188px] h-[130px] animate-[zoneEnter_0.7s_ease-out]"
          >
            {/* Wind-sway group: top bar + mount + hanging sign all sway together */}
            <div className="absolute inset-0 origin-top">

              {/* --- top bar --- */}
              <div
                className="absolute right-[-2px] top-0 w-[182px] h-[12px]"
                style={{ background: s.boardBg, boxShadow: `inset 0 3px ${s.barTop}, inset 0 -3px ${s.barBottom}` }}
              />
              <div
                className="absolute right-[-2px] top-[3px] w-[182px] h-[6px]"
                style={{ background: s.barInner }}
              />

              {/* --- right vertical mount pole --- */}
              <div
                className="absolute right-[-3px] top-[-3px] z-10 w-[7px] h-[21px] rounded-full"
                style={{ background: s.poleColor }}
              />
              <div
                className="absolute right-[-3px] top-[1px] z-20 w-[4px] h-[9px]"
                style={{ background: s.poleAccent, boxShadow: `inset 1px 1px ${s.poleAccent}` }}
              />

              {/* --- chains --- */}
              <div className="absolute left-[34px] top-[12px] w-[5px] h-[26px] origin-top animate-[ropeSway_2.8s_ease-in-out_infinite]" style={{ background: s.chainHighlight }} />
              <div className="absolute left-[36px] top-[16px] w-[2px] h-[19px] origin-top animate-[ropeSway_2.8s_ease-in-out_infinite]" style={{ background: s.chainColor }} />
              <div className="absolute right-[34px] top-[12px] w-[5px] h-[26px] origin-top animate-[ropeSway_2.8s_ease-in-out_infinite]" style={{ background: s.chainHighlight }} />
              <div className="absolute right-[36px] top-[16px] w-[2px] h-[19px] origin-top animate-[ropeSway_2.8s_ease-in-out_infinite]" style={{ background: s.chainColor }} />

              {/* --- hanging sign board --- */}
              <div
                className="absolute right-0 top-[36px] w-[170px] h-[90px] animate-[signSway_4s_ease-in-out_infinite]"
                style={{ background: s.boardBg, boxShadow: s.boardShadow }}
              />
              <div
                className="absolute right-[5px] top-[41px] w-[160px] h-[78px] px-3 py-4 text-center animate-[signSway_4s_ease-in-out_infinite]"
                style={{
                  background: s.innerBg,
                  border: `4px solid ${s.borderColor}`,
                  boxShadow: `${s.innerShadow}, ${s.outerShadow}`,
                }}
              >
                <div className="font-mono text-[10px] font-black uppercase tracking-wide leading-tight" style={{ color: s.titleColor }}>
                  {zoneName}
                </div>
                <div className="font-mono text-[8px] mt-1 leading-tight" style={{ color: s.subtitleColor }}>
                  {zoneSubtitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {rouletteReady && (
        <div className="px-3 mt-1 pointer-events-auto">
          <button
            onClick={onRoulette}
            className="relative flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm transition-transform hover:scale-105 active:scale-95 animate-[pulse-glow_1.5s_ease-in-out_infinite]"
            style={{
              background: 'linear-gradient(180deg, #FF8A66 0%, #FF5A36 45%, #D83A18 100%)',
              color: '#FFFFFF',
              border: '2px solid #0F172A',
              borderRadius: '4px',
              boxShadow: '0 5px 0 #0F172A, 0 7px 10px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.25)',
              fontFamily: 'monospace',
              textShadow: '2px 2px 0 #0F172A',
              imageRendering: 'pixelated',
              letterSpacing: '0.05em',
            }}
          >
            {/* Pixel-art dice icon */}
            <span className="inline-block w-4 h-4 relative" style={{ imageRendering: 'pixelated' }}>
              <span className="absolute inset-0" style={{
                background: '#FFFFFF',
                border: '1px solid #0F172A',
                borderRadius: '2px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
              }} />
              <span className="absolute top-[2px] left-[2px] w-[3px] h-[3px]" style={{ background: '#0F172A' }} />
              <span className="absolute bottom-[2px] right-[2px] w-[3px] h-[3px]" style={{ background: '#0F172A' }} />
              <span className="absolute top-[2px] right-[2px] w-[3px] h-[3px]" style={{ background: '#0F172A' }} />
              <span className="absolute bottom-[2px] left-[2px] w-[3px] h-[3px]" style={{ background: '#0F172A' }} />
            </span>
            ¡GIRAR RULETA!
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1 px-3 mt-1">
        {hasJetpack && (
          <div className="w-32 h-2 overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '2px' }}>
            <div
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)', width: `${(jetpackFuel / JETPACK_MAX_FUEL) * 100}%` }}
            />
          </div>
        )}
        {hasPropeller && (
          <div className="w-32 h-2 overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(20,184,166,0.4)', borderRadius: '2px' }}>
            <div
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #14b8a6, #5eead4)', width: `${(propellerFuel / PROPELLER_MAX_FUEL) * 100}%` }}
            />
          </div>
        )}
        {hasShield && (
          <div className="flex items-center gap-1">
            <span className="text-cyan-300 text-xs font-mono">🛡 Escudo</span>
          </div>
        )}
      </div>
    </div>
  );
}
