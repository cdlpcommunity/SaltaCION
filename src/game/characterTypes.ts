export interface CharacterCustomization {
  bodyColor: string;
  eyeStyle: EyeStyle;
  hairStyle: HairStyle;
  outfit: Outfit;
  outfitColor: string;
  accessory: Accessory;
  accessoryColor: string;
}

export type EyeStyle = 'normal' | 'happy' | 'cool' | 'angry' | 'cute' | 'sleepy';
export type HairStyle = 'none' | 'short' | 'long' | 'spiky' | 'mohawk' | 'bun';
export type Outfit = 'none' | 'cape' | 'hoodie' | 'suit' | 'dress' | 'armor';
export type Accessory = 'none' | 'hat' | 'headphones' | 'crown' | 'glasses' | 'bandana';

export const EYE_STYLES: { id: EyeStyle; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'happy', label: 'Feliz' },
  { id: 'cool', label: 'Cool' },
  { id: 'angry', label: 'Enojado' },
  { id: 'cute', label: 'Tierno' },
  { id: 'sleepy', label: 'Dormilón' },
];

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'none', label: 'Sin pelo' },
  { id: 'short', label: 'Corto' },
  { id: 'long', label: 'Largo' },
  { id: 'spiky', label: 'Erecto' },
  { id: 'mohawk', label: 'Mohawk' },
  { id: 'bun', label: 'Moño' },
];

export const OUTFITS: { id: Outfit; label: string }[] = [
  { id: 'none', label: 'Sin ropa' },
  { id: 'cape', label: 'Capa' },
  { id: 'hoodie', label: 'Sudadera' },
  { id: 'suit', label: 'Traje' },
  { id: 'dress', label: 'Vestido' },
  { id: 'armor', label: 'Armadura' },
];

export const ACCESSORIES: { id: Accessory; label: string }[] = [
  { id: 'none', label: 'Nada' },
  { id: 'hat', label: 'Sombrero' },
  { id: 'headphones', label: 'Auriculares' },
  { id: 'crown', label: 'Corona' },
  { id: 'glasses', label: 'Gafas' },
  { id: 'bandana', label: 'Bandana' },
];

export const BODY_COLORS = [
  '#fbbf24', '#FF5A36', '#22c55e', '#3b82f6', '#a78bfa',
  '#ec4899', '#14b8a6', '#f43f5e', '#f97316', '#eab308',
  '#06b6d4', '#84cc16',
];

export const OUTFIT_COLORS = [
  '#FF5A36', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f59e0b', '#10b981', '#6366f1', '#0F172A',
  '#f1f5f9', '#64748b',
];

export const ACCESSORY_COLORS = [
  '#FF5A36', '#ef4444', '#3b82f6', '#8b5cf6', '#fcd34d',
  '#14b8a6', '#ec4899', '#06b6d4', '#f1f5f9', '#0F172A',
  '#22c55e', '#a78bfa',
];

export const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  bodyColor: '#fbbf24',
  eyeStyle: 'normal',
  hairStyle: 'short',
  outfit: 'none',
  outfitColor: '#FF5A36',
  accessory: 'none',
  accessoryColor: '#FF5A36',
};
