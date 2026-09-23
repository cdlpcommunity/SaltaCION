import { useState, useEffect, useCallback } from 'react';
import { supabase, type ScoreEntry } from '@/lib/supabase';
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

export function useLeaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [customizations, setCustomizations] = useState<Record<string, CharacterCustomization>>({});
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('best_scores')
      .select('user_id, player_name, score, coins, height, updated_at')
      .order('score', { ascending: false });
    if (error || !data) {
      setScores([]);
      setLoading(false);
      return;
    }

    const mapped: ScoreEntry[] = (data as (Omit<ScoreEntry, 'id' | 'created_at' | 'user_id'> & { user_id: string; updated_at: string })[]).map((row) => ({
      id: row.user_id,
      player_name: row.player_name,
      score: row.score,
      coins: row.coins,
      height: row.height,
      user_id: row.user_id,
      created_at: row.updated_at,
    }));
    setScores(mapped);

    const userIds = mapped
      .map((s) => s.user_id)
      .filter((id): id is string => id !== null);

    if (userIds.length > 0) {
      const { data: custData } = await supabase
        .from('player_customizations')
        .select('user_id, body_color, eye_style, hair_style, outfit, outfit_color, accessory, accessory_color')
        .in('user_id', userIds);

      if (custData) {
        const map: Record<string, CharacterCustomization> = {};
        for (const row of custData as (DbCustomization & { user_id: string })[]) {
          map[row.user_id] = dbToCustomization(row);
        }
        setCustomizations(map);
      }
    }

    setLoading(false);
  }, []);

  const submitScore = useCallback(async (name: string, score: number, coins: number, height: number) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return false;

    const { data: existing } = await supabase
      .from('best_scores')
      .select('score')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing && (existing as { score: number }).score >= score) {
      return true;
    }

    const { error } = await supabase
      .from('best_scores')
      .upsert({
        user_id: userId,
        player_name: name,
        score,
        coins,
        height,
        updated_at: new Date().toISOString(),
      });
    if (!error) {
      await fetchScores();
    }
    return !error;
  }, [fetchScores]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return { scores, customizations, loading, submitScore, refetch: fetchScores };
}
