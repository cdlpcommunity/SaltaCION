/*
# Create scores table for SaltaCIÓN leaderboard

1. New Tables
- `scores`
- `id` (uuid, primary key)
- `player_name` (text, not null, the player's display name)
- `score` (integer, not null, the final score)
- `coins` (integer, not null, total coins collected)
- `height` (integer, not null, max height reached)
- `created_at` (timestamptz, defaults to now)
2. Security
- Enable RLS on `scores`.
- Allow anon + authenticated CRUD because the game has no sign-in — scores are intentionally public/shared.
- Add index on score descending for leaderboard queries.
*/

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  height integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scores" ON scores;
CREATE POLICY "anon_select_scores"
ON scores FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scores" ON scores;
CREATE POLICY "anon_insert_scores"
ON scores FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scores" ON scores;
CREATE POLICY "anon_update_scores"
ON scores FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scores" ON scores;
CREATE POLICY "anon_delete_scores"
ON scores FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_scores_score_desc ON scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores (created_at DESC);
