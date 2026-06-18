-- Identifies a specific unit within a building: tower/block and apartment number.
-- A ready-to-move development can have several towers and many apartments, so the
-- broker needs to tell otherwise-identical listings apart.
--
-- Both are the broker's internal reference and are SENSITIVE: they are only ever
-- read by the authenticated admin and are never included in public API responses
-- or rendered on the public site.
--
-- Both are nullable and additive: existing rows keep working unchanged.

ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS torre TEXT;
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS numero_apartamento TEXT;
