/*
# Create one best score per account

1. New Tables
- `best_scores`
  - `user_id` (uuid, primary key, the account that owns the record)
  - `player_name` (text, the displayed username)
  - `score` (integer, the account's highest score)
  - `coins` (integer, coins collected in that best run)
  - `height` (integer, height reached in that best run)
  - `created_at` (timestamptz, when the best record was first stored)
  - `updated_at` (timestamptz, when the best record was last improved)
2. Data Migration
- Copies the highest existing score for each authenticated account from `scores`.
- Historical rows in `scores` are left untouched.
3. Security
- Enables RLS on `best_scores`.
- Allows everyone to read the public ranking.
- Allows signed-in users to insert, update, and delete only their own record.
4. Important Notes
- Guests cannot create rows because `user_id` is required and all write policies require authentication.
- The application only replaces a record when the new score is higher.
*/

CREATE TABLE IF NOT EXISTS best_scores (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  height integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE best_scores ENABLE ROW LEVEL SECURITY;

INSERT INTO best_scores (user_id, player_name, score, coins, height, created_at, updated_at)
SELECT DISTINCT ON (user_id)
  user_id,
  player_name,
  score,
  coins,
  height,
  created_at,
  created_at
FROM scores
WHERE user_id IS NOT NULL
ORDER BY user_id, score DESC, height DESC, created_at ASC
ON CONFLICT (user_id) DO NOTHING;

DROP POLICY IF EXISTS "public_select_best_scores" ON best_scores;
CREATE POLICY "public_select_best_scores"
ON best_scores FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_best_score" ON best_scores;
CREATE POLICY "insert_own_best_score"
ON best_scores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_best_score" ON best_scores;
CREATE POLICY "update_own_best_score"
ON best_scores FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_best_score" ON best_scores;
CREATE POLICY "delete_own_best_score"
ON best_scores FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_best_scores_score_desc ON best_scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_best_scores_updated_at ON best_scores (updated_at DESC);
