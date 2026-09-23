/*
# Add DEFAULT auth.uid() to best_scores.user_id

1. Modified Tables
- `best_scores`
  - `user_id` now defaults to auth.uid() so upserts from the client
    work without explicitly sending user_id (same pattern as player_customizations).
2. Security
- No policy changes — existing policies already check auth.uid() = user_id.
3. Notes
- No data loss — only adds a column default.
- Existing rows are unaffected.
*/

ALTER TABLE best_scores
  ALTER COLUMN user_id SET DEFAULT auth.uid();
