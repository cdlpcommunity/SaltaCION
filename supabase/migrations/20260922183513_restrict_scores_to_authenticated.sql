/*
# Restrict score submission to authenticated users only

1. Security Changes
- UPDATE INSERT policy on `scores`: remove anon role, only authenticated users can insert
- Guest (anon) users can still READ the leaderboard but cannot submit scores
2. Notes
- Existing guest scores remain in the table
- No data is lost — only the INSERT policy role changes
*/

DROP POLICY IF EXISTS "anon_insert_scores" ON scores;
CREATE POLICY "authenticated_insert_scores"
ON scores FOR INSERT
TO authenticated
WITH CHECK (true);
