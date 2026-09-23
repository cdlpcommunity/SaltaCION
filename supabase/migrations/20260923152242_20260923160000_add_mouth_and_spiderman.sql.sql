/*
# Add mouth_style and spiderman_unlocked to player_customizations

1. Modified Tables
- `player_customizations`
  - Add `mouth_style` (text, not null, default 'smile') — mouth style identifier: smile, neutral, open, frown, tongue, fangs, small, wide, whistle, zip
  - Add `spiderman_unlocked` (boolean, not null, default false) — whether the user has unlocked the secret Spiderman outfit via password
2. Notes
- No data loss — both columns added with safe defaults
- Existing rows get 'smile' as mouth_style and false for spiderman_unlocked
*/

ALTER TABLE player_customizations
  ADD COLUMN IF NOT EXISTS mouth_style text NOT NULL DEFAULT 'smile',
  ADD COLUMN IF NOT EXISTS spiderman_unlocked boolean NOT NULL DEFAULT false;
