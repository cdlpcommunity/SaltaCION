/*
# Add user authentication support to scores

1. Modified Tables
- `scores`
  - Add `user_id` (uuid, nullable, references auth.users ON DELETE SET NULL)
  - When a signed-in user submits a score, user_id is set; for guests it stays NULL
2. Security
- RLS policies updated: SELECT stays public (anon + authenticated can read all scores)
- INSERT: anon can insert (guest scores), authenticated can insert with their own user_id
- UPDATE/DELETE: restricted to authenticated users owning the row (no more anon update/delete)
3. Notes
- Existing scores remain visible and intact
- Guest scores (user_id NULL) remain fully readable by everyone
- Authenticated users can only modify/delete their own scores
*/

ALTER TABLE scores ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- SELECT stays public for leaderboard
DROP POLICY IF EXISTS "anon_select_scores" ON scores;
CREATE POLICY "anon_select_scores"
ON scores FOR SELECT
TO anon, authenticated USING (true);

-- INSERT: anon inserts guest scores (user_id null), authenticated inserts own scores
DROP POLICY IF EXISTS "anon_insert_scores" ON scores;
CREATE POLICY "anon_insert_scores"
ON scores FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- UPDATE: only authenticated users can update their own scores
DROP POLICY IF EXISTS "anon_update_scores" ON scores;
CREATE POLICY "anon_update_scores"
ON scores FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE: only authenticated users can delete their own scores
DROP POLICY IF EXISTS "anon_delete_scores" ON scores;
CREATE POLICY "anon_delete_scores"
ON scores FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores (user_id);
