/*
# Add hair_style to player_customizations

1. Modified Tables
- `player_customizations`
  - Add `hair_style` (text, not null, default 'short') — hairstyle identifier: none, short, long, spiky, mohawk, bun
2. Notes
- No data loss — column added with a safe default
- Existing rows get 'short' as their hair_style
*/

ALTER TABLE player_customizations ADD COLUMN IF NOT EXISTS hair_style text NOT NULL DEFAULT 'short';