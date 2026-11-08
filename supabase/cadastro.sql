-- Rode no SQL Editor do Supabase (pode rodar de novo sem problema): campos extras do cadastro de imóvel.
-- Já inclui latitude/longitude (localizacao.sql). video_url e endereco já existem em schema.sql.
alter table imoveis
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists uso text not null default 'residencial',         -- residencial | comercial
  add column if not exists categoria text,                                  -- Padrão | Duplex | Triplex
  add column if not exists suites int,
  add column if not exists andar int,
  add column if not exists area_total_m2 numeric(10,2),                     -- area_m2 passa a ser a área útil
  add column if not exists cep text,
  add column if not exists numero text,
  add column if not exists complemento text,
  add column if not exists mostrar_endereco text not null default 'completo', -- completo | rua | bairro
  add column if not exists caracteristicas_condominio text[] not null default '{}',
  add column if not exists condominio_andares int,
  add column if not exists condominio_unidades_andar int,
  add column if not exists condominio_torres int,
  add column if not exists ano_construcao int,
  add column if not exists preco_aluguel numeric(14,2),                     -- só quando finalidade = 'ambos'
  add column if not exists valor_condominio numeric(12,2),
  add column if not exists condominio_isento boolean not null default false,
  add column if not exists valor_iptu numeric(12,2),
  add column if not exists iptu_isento boolean not null default false,
  add column if not exists iptu_periodo text,                               -- mensal | anual
  add column if not exists tour_url text;
