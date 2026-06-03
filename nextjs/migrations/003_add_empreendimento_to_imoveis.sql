-- Explicit development association for properties.
-- Lets a unit be attached to a development by name, instead of relying on the
-- listing title matching an exact pattern. Nullable and additive: existing rows
-- keep working through the title heuristic until backfilled.

ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS empreendimento TEXT;

CREATE INDEX IF NOT EXISTS idx_imoveis_empreendimento ON imoveis (empreendimento);
