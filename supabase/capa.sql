-- Rode no SQL Editor do Supabase: capa do perfil (foto_url já existe em schema.sql).
alter table profiles add column if not exists capa_url text;
