import { useState } from 'react';
import { Check, Shuffle, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import {
  EYE_STYLES,
  HAIR_STYLES,
  OUTFITS,
  ACCESSORIES,
  BODY_COLORS,
  OUTFIT_COLORS,
  ACCESSORY_COLORS,
  DEFAULT_CUSTOMIZATION,
  type CharacterCustomization,
  type EyeStyle,
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
}

type Category = 'body' | 'eyes' | 'hair' | 'outfit' | 'accessory';

const CATEGORY_LABELS: Record<Category, string> = {
  body: 'Cuerpo',
  eyes: 'Ojos',
  hair: 'Pelo',
  outfit: 'Ropa',
  accessory: 'Accesorios',
};

const ALL_EYE_STYLES = EYE_STYLES;
const ALL_HAIR_STYLES = HAIR_STYLES;
const ALL_OUTFITS = OUTFITS;
const ALL_ACCESSORIES = ACCESSORIES;

export function CharacterCustomizationScreen({
  initial,
  onSave,
  onCancel,
  title = 'Personaliza tu personaje',
  isFirstTime = false,
}: CharacterCustomizationScreenProps) {
  const [char, setChar] = useState<CharacterCustomization>(initial);
  const [category, setCategory] = useState<Category>('body');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setChar({
      bodyColor: random(BODY_COLORS),
      eyeStyle: random(ALL_EYE_STYLES).id as EyeStyle,
      hairStyle: random(ALL_HAIR_STYLES).id as HairStyle,
      outfit: random(ALL_OUTFITS).id as Outfit,
      outfitColor: random(OUTFIT_COLORS),
      accessory: random(ALL_ACCESSORIES).id as Accessory,
      accessoryColor: random(ACCESSORY_COLORS),
    });
  };

  const categories: Category[] = ['body', 'eyes', 'hair', 'outfit', 'accessory'];

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

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-3 animate-[fadeIn_0.4s_ease-out] max-h-full overflow-y-auto px-1" style={{ scrollbarWidth: 'none' }}>
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
                onSelect={(id) => update({ outfit: id as Outfit })}
                char={char}
                previewType="outfit"
              />
              {char.outfit !== 'none' && (
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
}: {
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
  char: CharacterCustomization;
  previewType: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const previewChar: CharacterCustomization = { ...char };
          if (previewType === 'eyes') previewChar.eyeStyle = opt.id as EyeStyle;
          if (previewType === 'hair') previewChar.hairStyle = opt.id as HairStyle;
          if (previewType === 'outfit') previewChar.outfit = opt.id as Outfit;
          if (previewType === 'accessory') previewChar.accessory = opt.id as Accessory;

          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="flex flex-col items-center gap-1 p-1.5 transition-all"
              style={{
                background: selected === opt.id ? 'rgba(255,90,54,0.2)' : 'rgba(15,23,42,0.6)',
                border: selected === opt.id ? '2px solid rgba(255,90,54,0.5)' : '2px solid rgba(241,245,249,0.1)',
                borderRadius: '4px',
              }}
            >
              <CharacterAvatar customization={previewChar} size={44} />
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
