-- 008_add_sindicar_portais_to_imoveis.sql
-- Opt-out por imóvel da sindicação nos portais (feed VRSync — OLX/ZAP/Viva Real).
-- Default true: todos os imóveis ativos existentes entram no feed automaticamente;
-- desmarcar no admin remove o imóvel do feed.
ALTER TABLE imoveis
  ADD COLUMN IF NOT EXISTS sindicar_portais BOOLEAN NOT NULL DEFAULT true;
