-- Rode no SQL Editor do Supabase: localização exata do imóvel (endereco já existe em schema.sql).
alter table imoveis
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;
