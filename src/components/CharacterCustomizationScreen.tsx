import { useState } from 'react';
import { Check, Shuffle, Save, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import {
  EYE_STYLES,
  MOUTH_STYLES,
  HAIR_STYLES,
  OUTFITS,
  ACCESSORIES,
  BODY_COLORS,
  OUTFIT_COLORS,
  ACCESSORY_COLORS,
  SPIDERMAN_PASSWORD,
  isOutfitUnlocked,
  type CharacterCustomization,
  type EyeStyle,
  type MouthStyle,
  type HairStyle,
  type Outfit,
  type Accessory,
} from '@/game/characterTypes';

interface CharacterCustomizationScreenProps {
  initial: CharacterCustomization;
  onSave: (c: CharacterCustomization) => Promise<boolean>;
  onCancel: () => void;
  title?: string;
  isFirstTime?: boolean;
  spidermanUnlocked?: boolean;
  onUnlockSpiderman?: () => Promise<boolean>;
}

type Category = 'body' | 'eyes' | 'mouth' | 'hair' | 'outfit' | 'accessory';

const CATEGORY_LABELS: Record<Category, string> = {
  body: 'Cuerpo',
  eyes: 'Ojos',
  mouth: 'Boca',
  hair: 'Pelo',
  outfit: 'Ropa',
  accessory: 'Accesorios',
};

const ALL_EYE_STYLES = EYE_STYLES;
const ALL_MOUTH_STYLES = MOUTH_STYLES;
const ALL_HAIR_STYLES = HAIR_STYLES;
const ALL_OUTFITS = OUTFITS;
const ALL_ACCESSORIES = ACCESSORIES;

export function CharacterCustomizationScreen({
  initial,
  onSave,
  onCancel,
  title = 'Personaliza tu personaje',
  isFirstTime = false,
  spidermanUnlocked = false,
  onUnlockSpiderman,
}: CharacterCustomizationScreenProps) {
  const [char, setChar] = useState<CharacterCustomization>(initial);
  const [category, setCategory] = useState<Category>('body');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const update = (patch: Partial<CharacterCustomization>) => {
    setChar((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const ok = await onSave(char);
    setSaving(false);
    if (!ok) {
      setError('No se pudo guardar. Intenta de nuevo.');
    }
  };

  const handleRandom = () => {
    const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const availableOutfits = ALL_OUTFITS.filter((o) => isOutfitUnlocked(o.id, spidermanUnlocked));
    setChar({
      bodyColor: random(BODY_COLORS),
      eyeStyle: random(ALL_EYE_STYLES).id as EyeStyle,
      mouthStyle: random(ALL_MOUTH_STYLES).id as MouthStyle,
      hairStyle: random(ALL_HAIR_STYLES).id as HairStyle,
      outfit: random(availableOutfits).id as Outfit,
      outfitColor: random(OUTFIT_COLORS),
      accessory: random(ALL_ACCESSORIES).id as Accessory,
      accessoryColor: random(ACCESSORY_COLORS),
    });
  };

  const handleUnlockSubmit = async () => {
    if (passwordInput.trim() !== SPIDERMAN_PASSWORD) {
      setPasswordError('Contraseña incorrecta.');
      return;
    }

    const unlocked = onUnlockSpiderman ? await onUnlockSpiderman() : true;
    if (!unlocked) {
      setPasswordError('No se pudo desbloquear el traje. Intenta de nuevo.');
      return;
    }

    setShowUnlockModal(false);
    setPasswordInput('');
    setPasswordError(null);
    setCategory('outfit');
  };

  const categories: Category[] = ['body', 'eyes', 'mouth', 'hair', 'outfit', 'accessory'];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 overflow-hidden px-4 py-4"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1e293b 50%, #334155 100%)' }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(241,245,249,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(241,245,249,0.15) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />

      <div className="absolute top-8 left-6 w-3 h-3 animate-[pulse-glow_3s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.3)' }} />
      <div className="absolute bottom-20 right-8 w-4 h-4 animate-[pulse-glow_5s_ease-in-out_infinite]" style={{ background: 'rgba(255,90,54,0.2)' }} />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-3 animate-[fadeIn_0.4s_ease-out] px-1">
        <h2 className="text-2xl font-black font-mono flex items-center gap-2" style={{ color: '#FF5A36', textShadow: '3px 3px 0 #0F172A' }}>
          {title}
        </h2>

        {/* Preview */}
        <div className="relative" style={{
          background: 'rgba(15,23,42,0.8)',
          borderRadius: '8px',
          border: '2px solid rgba(255,90,54,0.3)',
          padding: '12px',
        }}>
          <div className="flex items-center justify-center" style={{ minHeight: '100px' }}>
            <CharacterAvatar customization={char} size={100} animated />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 font-mono text-xs font-bold transition-all"
              style={{
                background: category === cat ? '#FF5A36' : 'rgba(15,23,42,0.8)',
                color: category === cat ? '#FFFFFF' : '#F1F5F9',
                border: `2px solid ${category === cat ? '#0F172A' : 'rgba(241,245,249,0.2)'}`,
                borderRadius: '4px',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Options Panel */}
        <div className="w-full" style={{
          background: 'rgba(15,23,42,0.6)',
          borderRadius: '6px',
          border: '2px solid rgba(241,245,249,0.1)',
          padding: '10px',
          minHeight: '80px',
        }}>
          {category === 'body' && (
            <ColorPicker
              label="Color de cuerpo"
              colors={BODY_COLORS}
              selected={char.bodyColor}
              onSelect={(c) => update({ bodyColor: c })}
            />
          )}
          {category === 'eyes' && (
            <OptionGrid
              options={ALL_EYE_STYLES}
              selected={char.eyeStyle}
              onSelect={(id) => update({ eyeStyle: id as EyeStyle })}
              char={char}
              previewType="eyes"
            />
          )}
          {category === 'mouth' && (
            <OptionGrid
              options={ALL_MOUTH_STYLES}
              selected={char.mouthStyle}
              onSelect={(id) => update({ mouthStyle: id as MouthStyle })}
              char={char}
              previewType="mouth"
            />
          )}
          {category === 'hair' && (
            <OptionGrid
              options={ALL_HAIR_STYLES}
              selected={char.hairStyle}
              onSelect={(id) => update({ hairStyle: id as HairStyle })}
              char={char}
              previewType="hair"
            />
          )}
          {category === 'outfit' && (
            <>
              <OptionGrid
                options={ALL_OUTFITS}
                selected={char.outfit}
                onSelect={(id) => {
                  if (id === 'spiderman' && !spidermanUnlocked) {
                    setShowUnlockModal(true);
                    return;
                  }
                  update({ outfit: id as Outfit });
                }}
                char={char}
                previewType="outfit"
                lockedItems={spidermanUnlocked ? [] : ['spiderman']}
              />
              {char.outfit !== 'none' && char.outfit !== 'spiderman' && (
                <ColorPicker
                  label="Color de ropa"
                  colors={OUTFIT_COLORS}
                  selected={char.outfitColor}
                  onSelect={(c) => update({ outfitColor: c })}
                />
              )}
            </>
          )}
          {category === 'accessory' && (
            <>
              <OptionGrid
                options={ALL_ACCESSORIES}
                selected={char.accessory}
                onSelect={(id) => update({ accessory: id as Accessory })}
                char={char}
                previewType="accessory"
              />
              {char.accessory !== 'none' && (
                <ColorPicker
                  label="Color de accesorio"
                  colors={ACCESSORY_COLORS}
                  selected={char.accessoryColor}
                  onSelect={(c) => update({ accessoryColor: c })}
                />
              )}
            </>
          )}
        </div>

        {error && (
          <div className="text-red-400 text-sm font-mono text-center px-2 py-1" style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)' }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          {!isFirstTime && (
            <button
              onClick={onCancel}
              className="flex items-center justify-center gap-1 px-4 py-2.5 font-mono font-bold text-sm transition-colors"
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: '#F1F5F9',
                border: '2px solid rgba(241,245,249,0.2)',
                borderRadius: '4px',
              }}
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <button
            onClick={handleRandom}
            className="flex items-center justify-center gap-1 px-4 py-2.5 font-mono font-bold text-sm transition-transform hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(15,23,42,0.8)',
              color: '#F1F5F9',
              border: '2px solid rgba(241,245,249,0.2)',
              borderRadius: '4px',
            }}
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-mono font-bold text-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              background: '#FF5A36',
              color: '#FFFFFF',
              border: '2px solid #0F172A',
              borderRadius: '4px',
              boxShadow: '0 4px 0 #0F172A',
            }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Spiderman Unlock Modal */}
      {showUnlockModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.9)' }}>
          <div className="w-full max-w-xs flex flex-col gap-4 p-6" style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0F172A 100%)',
            borderRadius: '10px',
            border: '2px solid rgba(220,38,38,0.4)',
          }}>
            <div className="flex flex-col items-center gap-2">
              <Lock size={32} color="#dc2626" />
              <h3 className="text-xl font-black font-mono" style={{ color: '#dc2626', textShadow: '2px 2px 0 #0F172A' }}>
                Traje Bloqueado
              </h3>
              <p className="text-sm font-mono text-center" style={{ color: '#F1F5F9' }}>
                Introduce la contraseña secreta para desbloquear el traje de Spiderman.
              </p>
            </div>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(null);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUnlockSubmit(); }}
              placeholder="Contraseña secreta"
              className="w-full px-3 py-2.5 font-mono text-sm text-center"
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: '#F1F5F9',
                border: '2px solid rgba(241,245,249,0.2)',
                borderRadius: '4px',
                outline: 'none',
              }}
              autoFocus
            />
            {passwordError && (
              <div className="text-red-400 text-xs font-mono text-center">{passwordError}</div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowUnlockModal(false); setPasswordInput(''); setPasswordError(null); }}
                className="flex-1 px-4 py-2.5 font-mono font-bold text-sm"
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  color: '#F1F5F9',
                  border: '2px solid rgba(241,245,249,0.2)',
                  borderRadius: '4px',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleUnlockSubmit}
                className="flex-1 px-4 py-2.5 font-mono font-bold text-sm"
                style={{
                  background: '#dc2626',
                  color: '#FFFFFF',
                  border: '2px solid #0F172A',
                  borderRadius: '4px',
                  boxShadow: '0 3px 0 #0F172A',
                }}
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPicker({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string;
  colors: string[];
  selected: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div>
      <div className="text-[#F1F5F9]/60 text-xs font-mono uppercase tracking-wider mb-2">{label}</div>
      <div className="grid grid-cols-6 gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{
              width: '32px',
              height: '32px',
              background: c,
              border: selected === c ? '3px solid #FFFFFF' : '2px solid rgba(241,245,249,0.2)',
              borderRadius: '4px',
            }}
          >
            {selected === c && <Check size={16} className="text-white drop-shadow-md" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
  char,
  previewType,
  lockedItems = [],
}: {
  options: { id: string; label: string; secret?: boolean }[];
  selected: string;
  onSelect: (id: string) => void;
  char: CharacterCustomization;
  previewType: string;
  lockedItems?: string[];
}) {
  return (
    <div>
      <div className="customization-options-scroll flex w-full gap-2 overflow-x-auto pb-2">
        {options.map((opt) => {
          const isLocked = lockedItems.includes(opt.id);
          const previewChar: CharacterCustomization = { ...char };
          if (previewType === 'eyes') previewChar.eyeStyle = opt.id as EyeStyle;
          if (previewType === 'mouth') previewChar.mouthStyle = opt.id as MouthStyle;
          if (previewType === 'hair') previewChar.hairStyle = opt.id as HairStyle;
          if (previewType === 'outfit') previewChar.outfit = opt.id as Outfit;
          if (previewType === 'accessory') previewChar.accessory = opt.id as Accessory;

          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="relative flex w-[104px] flex-none flex-col items-center gap-1 p-1.5 transition-all"
              style={{
                background: selected === opt.id ? 'rgba(255,90,54,0.2)' : 'rgba(15,23,42,0.6)',
                border: selected === opt.id ? '2px solid rgba(255,90,54,0.5)' : '2px solid rgba(241,245,249,0.1)',
                borderRadius: '4px',
              }}
            >
              {isLocked ? (
                <div className="flex items-center justify-center" style={{ width: 44, height: 44 }}>
                  <Lock size={20} color="#dc2626" />
                </div>
              ) : (
                <CharacterAvatar customization={previewChar} size={44} />
              )}
              <span className="text-[10px] font-mono" style={{ color: selected === opt.id ? '#FF5A36' : '#F1F5F9' }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
