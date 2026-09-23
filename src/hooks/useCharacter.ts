import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DEFAULT_CUSTOMIZATION,
  type CharacterCustomization,
} from '@/game/characterTypes';

interface DbCustomization {
  body_color: string;
  eye_style: string;
  hair_style: string;
  outfit: string;
  outfit_color: string;
  accessory: string;
  accessory_color: string;
}

function dbToCustomization(db: DbCustomization): CharacterCustomization {
  return {
    bodyColor: db.body_color,
    eyeStyle: db.eye_style as CharacterCustomization['eyeStyle'],
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

  const fetchCustomization = useCallback(async () => {
    if (!userId) {
      setCustomization(DEFAULT_CUSTOMIZATION);
      setLoading(false);
      setNeedsSetup(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('player_customizations')
      .select('body_color, eye_style, hair_style, outfit, outfit_color, accessory, accessory_color')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      setCustomization(DEFAULT_CUSTOMIZATION);
      setNeedsSetup(true);
    } else {
      setCustomization(dbToCustomization(data as DbCustomization));
      setNeedsSetup(false);
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
        .upsert({ user_id: userId, ...customizationToDb(c), updated_at: new Date().toISOString() });
      if (!error) {
        setCustomization(c);
        setNeedsSetup(false);
        return true;
      }
      return false;
    },
    [userId],
  );

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
  };
}
