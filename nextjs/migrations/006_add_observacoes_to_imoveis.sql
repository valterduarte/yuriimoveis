-- Free-text internal notes about a property: where the keys are, who to call to
-- schedule a visit, owner remarks, etc. This is the broker's private memo and is
-- SENSITIVE / admin-only: parseImovel strips it from every public response and it
-- is never rendered on the public site (mirrors torre/numero_apartamento).
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS observacoes TEXT;
