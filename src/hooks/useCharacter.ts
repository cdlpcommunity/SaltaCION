import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DEFAULT_CUSTOMIZATION,
  type CharacterCustomization,
} from '@/game/characterTypes';

interface DbCustomization {
  body_color: string;
  eye_style: string;
  mouth_style: string | null;
  hair_style: string;
  outfit: string;
  outfit_color: string;
  accessory: string;
  accessory_color: string;
  spiderman_unlocked: boolean | null;
}

function dbToCustomization(db: DbCustomization): CharacterCustomization {
  return {
    bodyColor: db.body_color,
    eyeStyle: db.eye_style as CharacterCustomization['eyeStyle'],
    mouthStyle: (db.mouth_style ?? 'smile') as CharacterCustomization['mouthStyle'],
    hairStyle: db.hair_style as CharacterCustomization['hairStyle'],
    outfit: db.outfit as CharacterCustomization['outfit'],
    outfitColor: db.outfit_color,
    accessory: db.accessory as CharacterCustomization['accessory'],
    accessoryColor: db.accessory_color,
  };
}

function customizationToDb(c: CharacterCustomization): Record<string, string> {
  return {
    body_color: c.bodyColor,
    eye_style: c.eyeStyle,
    mouth_style: c.mouthStyle,
    hair_style: c.hairStyle,
    outfit: c.outfit,
    outfit_color: c.outfitColor,
    accessory: c.accessory,
    accessory_color: c.accessoryColor,
  };
}

export function useCharacter(userId: string | null) {
  const [customization, setCustomization] = useState<CharacterCustomization>(DEFAULT_CUSTOMIZATION);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [spidermanUnlocked, setSpidermanUnlocked] = useState(false);

  const fetchCustomization = useCallback(async () => {
    if (!userId) {
      setCustomization(DEFAULT_CUSTOMIZATION);
      setLoading(false);
      setNeedsSetup(false);
      setSpidermanUnlocked(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('player_customizations')
      .select('body_color, eye_style, mouth_style, hair_style, outfit, outfit_color, accessory, accessory_color, spiderman_unlocked')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      setCustomization(DEFAULT_CUSTOMIZATION);
      setNeedsSetup(true);
      setSpidermanUnlocked(false);
    } else {
      const dbRow = data as DbCustomization;
      setCustomization(dbToCustomization(dbRow));
      setNeedsSetup(false);
      setSpidermanUnlocked(dbRow.spiderman_unlocked === true);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCustomization();
  }, [fetchCustomization]);

  const saveCustomization = useCallback(
    async (c: CharacterCustomization): Promise<boolean> => {
      if (!userId) return false;
      const { error } = await supabase
        .from('player_customizations')
        .upsert({
        user_id: userId,
        ...customizationToDb(c),
        spiderman_unlocked: spidermanUnlocked,
        updated_at: new Date().toISOString(),
      });
      if (!error) {
        setCustomization(c);
        setNeedsSetup(false);
        return true;
      }
      return false;
    },
    [userId, spidermanUnlocked],
  );

  const unlockSpiderman = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;
    const { error } = await supabase
      .from('player_customizations')
      .upsert({
        user_id: userId,
        ...customizationToDb(customization),
        spiderman_unlocked: true,
        updated_at: new Date().toISOString(),
      });
    if (error) return false;

    setSpidermanUnlocked(true);
    return true;
  }, [userId, customization]);

  const markSetupDone = useCallback(() => {
    setNeedsSetup(false);
  }, [userId]);

  return {
    customization,
    loading,
    needsSetup,
    saveCustomization,
    refetch: fetchCustomization,
    markSetupDone,
    spidermanUnlocked,
    unlockSpiderman,
  };
}
