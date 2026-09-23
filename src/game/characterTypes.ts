export interface CharacterCustomization {
  bodyColor: string;
  eyeStyle: EyeStyle;
  mouthStyle: MouthStyle;
  hairStyle: HairStyle;
  outfit: Outfit;
  outfitColor: string;
  accessory: Accessory;
  accessoryColor: string;
}

export type EyeStyle =
  | 'normal' | 'happy' | 'cool' | 'angry' | 'cute' | 'sleepy'
  | 'wink' | 'surprised' | 'dizzy' | 'determined' | 'star' | 'heart'
  | 'laser' | 'cyber' | 'cat' | 'shadow';

export type MouthStyle =
  | 'smile' | 'neutral' | 'open' | 'frown' | 'tongue' | 'fangs'
  | 'small' | 'wide' | 'whistle' | 'zip';

export type HairStyle =
  | 'none' | 'short' | 'long' | 'spiky' | 'mohawk' | 'bun'
  | 'afro' | 'ponytail' | 'buzz' | 'curly' | 'bald' | 'topknot'
  | 'undercut' | 'waves' | 'messy' | 'wicked';

export type Outfit =
  | 'none' | 'cape' | 'hoodie' | 'suit' | 'dress' | 'armor'
  | 'vest' | 'tank' | 'jacket' | 'robe' | 'uniform' | 'tshirt'
  | 'overalls' | 'raincoat' | 'pajamas' | 'spiderman';

export type Accessory =
  | 'none' | 'hat' | 'headphones' | 'crown' | 'glasses' | 'bandana'
  | 'mask' | 'scarf' | 'visor' | 'halo' | 'horns' | 'antenna'
  | 'eyepatch' | 'mustache' | 'feather' | 'flower';

export const EYE_STYLES: { id: EyeStyle; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'happy', label: 'Feliz' },
  { id: 'cool', label: 'Cool' },
  { id: 'angry', label: 'Enojado' },
  { id: 'cute', label: 'Tierno' },
  { id: 'sleepy', label: 'Dormilón' },
  { id: 'wink', label: 'Guiño' },
  { id: 'surprised', label: 'Sorprendido' },
  { id: 'dizzy', label: 'Mareado' },
  { id: 'determined', label: 'Decidido' },
  { id: 'star', label: 'Estrella' },
  { id: 'heart', label: 'Corazón' },
  { id: 'laser', label: 'Láser' },
  { id: 'cyber', label: 'Cyber' },
  { id: 'cat', label: 'Gato' },
  { id: 'shadow', label: 'Sombras' },
];

export const MOUTH_STYLES: { id: MouthStyle; label: string }[] = [
  { id: 'smile', label: 'Sonrisa' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'open', label: 'Abierta' },
  { id: 'frown', label: 'Triste' },
  { id: 'tongue', label: 'Lengua' },
  { id: 'fangs', label: 'Colmillos' },
  { id: 'small', label: 'Pequeña' },
  { id: 'wide', label: 'Grande' },
  { id: 'whistle', label: 'Silbar' },
  { id: 'zip', label: 'Cerrada' },
];

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'none', label: 'Sin pelo' },
  { id: 'short', label: 'Corto' },
  { id: 'long', label: 'Largo' },
  { id: 'spiky', label: 'Erecto' },
  { id: 'mohawk', label: 'Mohawk' },
  { id: 'bun', label: 'Moño' },
  { id: 'afro', label: 'Afro' },
  { id: 'ponytail', label: 'Coleta' },
  { id: 'buzz', label: 'Rapado' },
  { id: 'curly', label: 'Rizado' },
  { id: 'bald', label: 'Calvo' },
  { id: 'topknot', label: 'Topknot' },
  { id: 'undercut', label: 'Undercut' },
  { id: 'waves', label: 'Ondas' },
  { id: 'messy', label: 'Despeinado' },
  { id: 'wicked', label: 'Malvado' },
];

export const OUTFITS: { id: Outfit; label: string; secret?: boolean }[] = [
  { id: 'none', label: 'Sin ropa' },
  { id: 'cape', label: 'Capa' },
  { id: 'hoodie', label: 'Sudadera' },
  { id: 'suit', label: 'Traje' },
  { id: 'dress', label: 'Vestido' },
  { id: 'armor', label: 'Armadura' },
  { id: 'vest', label: 'Chaleco' },
  { id: 'tank', label: 'Camiseta' },
  { id: 'jacket', label: 'Chaqueta' },
  { id: 'robe', label: 'Túnica' },
  { id: 'uniform', label: 'Uniforme' },
  { id: 'tshirt', label: 'Camiseta' },
  { id: 'overalls', label: 'Peto' },
  { id: 'raincoat', label: 'Impermeable' },
  { id: 'pajamas', label: 'Pijama' },
  { id: 'spiderman', label: 'Spiderman', secret: true },
];

export const ACCESSORIES: { id: Accessory; label: string }[] = [
  { id: 'none', label: 'Nada' },
  { id: 'hat', label: 'Sombrero' },
  { id: 'headphones', label: 'Auriculares' },
  { id: 'crown', label: 'Corona' },
  { id: 'glasses', label: 'Gafas' },
  { id: 'bandana', label: 'Bandana' },
  { id: 'mask', label: 'Máscara' },
  { id: 'scarf', label: 'Bufanda' },
  { id: 'visor', label: 'Visera' },
  { id: 'halo', label: 'Aureola' },
  { id: 'horns', label: 'Cuernos' },
  { id: 'antenna', label: 'Antena' },
  { id: 'eyepatch', label: 'Parche' },
  { id: 'mustache', label: 'Bigote' },
  { id: 'feather', label: 'Pluma' },
  { id: 'flower', label: 'Flor' },
];

export const BODY_COLORS = [
  '#fbbf24', '#FF5A36', '#22c55e', '#3b82f6', '#a78bfa',
  '#ec4899', '#14b8a6', '#f43f5e', '#f97316', '#eab308',
  '#06b6d4', '#84cc16', '#d946ef', '#8b5cf6', '#10b981',
  '#0ea5e9', '#f59e0b', '#ef4444', '#36d399', '#fb7185',
  '#c0a062', '#e2e8f0',
];

export const OUTFIT_COLORS = [
  '#FF5A36', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f59e0b', '#10b981', '#6366f1', '#0F172A',
  '#f1f5f9', '#64748b', '#dc2626', '#059669', '#7c3aed',
  '#db2777', '#0891b2', '#ca8a04', '#facc15', '#06b6d4',
  '#1e293b', '#475569',
];

export const ACCESSORY_COLORS = [
  '#FF5A36', '#ef4444', '#3b82f6', '#8b5cf6', '#fcd34d',
  '#14b8a6', '#ec4899', '#06b6d4', '#f1f5f9', '#0F172A',
  '#22c55e', '#a78bfa', '#f472b6', '#fbbf24', '#34d399',
  '#60a5fa', '#fb923c', '#c084fc', '#5eead4', '#fde047',
  '#e2e8f0', '#94a3b8',
];

export const SPIDERMAN_PASSWORD = 'Jasons26';

export function isOutfitUnlocked(outfit: Outfit, spidermanUnlocked: boolean): boolean {
  if (outfit === 'spiderman') return spidermanUnlocked;
  return true;
}

export const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  bodyColor: '#fbbf24',
  eyeStyle: 'normal',
  mouthStyle: 'smile',
  hairStyle: 'short',
  outfit: 'none',
  outfitColor: '#FF5A36',
  accessory: 'none',
  accessoryColor: '#FF5A36',
};
