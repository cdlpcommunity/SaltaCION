/*
# Create player_customizations table

1. New Tables
- `player_customizations`
  - `user_id` (uuid, primary key, references auth.users, NOT NULL, defaults to auth.uid())
  - `body_color` (text, not null, hex color for the character body)
  - `eye_style` (text, not null, eye style identifier: normal, happy, cool, angry, cute, sleepy)
  - `outfit` (text, not null, outfit identifier: none, cape, hoodie, suit, dress, armor)
  - `outfit_color` (text, not null, hex color for the outfit)
  - `accessory` (text, not null, accessory identifier: none, hat, headphones, crown, glasses, bandana)
  - `accessory_color` (text, not null, hex color for the accessory)
  - `updated_at` (timestamptz, defaults to now)
2. Security
- Enable RLS on `player_customizations`.
- SELECT: public (anon + authenticated) so the leaderboard can display avatars for all users
- INSERT/UPDATE/DELETE: only authenticated users can manage their own customization
3. Notes
- One row per user (user_id is the primary key)
- The leaderboard joins scores with player_customizations to show each player's avatar
*/

CREATE TABLE IF NOT EXISTS player_customizations (
  user_id uuid PRIMARY KEY NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  body_color text NOT NULL DEFAULT '#fbbf24',
  eye_style text NOT NULL DEFAULT 'normal',
  outfit text NOT NULL DEFAULT 'none',
  outfit_color text NOT NULL DEFAULT '#FF5A36',
  accessory text NOT NULL DEFAULT 'none',
  accessory_color text NOT NULL DEFAULT '#FF5A36',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE player_customizations ENABLE ROW LEVEL SECURITY;

-- SELECT is public so leaderboard can show avatars for everyone
DROP POLICY IF EXISTS "anon_select_customizations" ON player_customizations;
CREATE POLICY "anon_select_customizations"
ON player_customizations FOR SELECT
TO anon, authenticated USING (true);

-- INSERT: only authenticated users, only for themselves
DROP POLICY IF EXISTS "insert_own_customization" ON player_customizations;
CREATE POLICY "insert_own_customization"
ON player_customizations FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- UPDATE: only authenticated users, only their own row
DROP POLICY IF EXISTS "update_own_customization" ON player_customizations;
CREATE POLICY "update_own_customization"
ON player_customizations FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE: only authenticated users, only their own row
DROP POLICY IF EXISTS "delete_own_customization" ON player_customizations;
CREATE POLICY "delete_own_customization"
ON player_customizations FOR DELETE
TO authenticated USING (auth.uid() = user_id);