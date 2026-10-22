-- Esquema inicial (Supabase / Postgres)

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  slug text unique not null,
  nome text not null,
  creci text,
  whatsapp text,
  bio text,
  foto_url text,
  logo_url text,
  cor_primaria text default '#1d4ed8',
  dominio_proprio text unique,
  created_at timestamptz default now()
);

create table imoveis (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references profiles on delete cascade,
  slug text not null,
  titulo text not null,
  descricao text,
  tipo text,                       -- casa, apartamento, terreno...
  finalidade text default 'venda', -- venda | aluguel
  preco numeric(14,2),
  quartos int, banheiros int, vagas int,
  area_m2 numeric(10,2),
  endereco text, bairro text, cidade text, uf char(2),
  diferenciais text[] default '{}',
  video_url text,
  status text default 'ativo',     -- ativo | vendido | arquivado
  created_at timestamptz default now(),
  unique (corretor_id, slug)
);

create table imovel_fotos (
  id uuid primary key default gen_random_uuid(),
  imovel_id uuid not null references imoveis on delete cascade,
  url text not null,
  ordem int default 0,
  capa boolean default false
);

alter table profiles enable row level security;
alter table imoveis enable row level security;
alter table imovel_fotos enable row level security;

-- Leitura pública (páginas de portfólio)
create policy "perfis publicos" on profiles for select using (true);
create policy "imoveis publicos" on imoveis for select using (status <> 'arquivado');
create policy "fotos publicas" on imovel_fotos for select using (true);

-- Escrita apenas pelo dono
create policy "dono edita perfil" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "dono edita imoveis" on imoveis for all using (auth.uid() = corretor_id) with check (auth.uid() = corretor_id);
create policy "dono edita fotos" on imovel_fotos for all
  using (exists (select 1 from imoveis i where i.id = imovel_id and i.corretor_id = auth.uid()))
  with check (exists (select 1 from imoveis i where i.id = imovel_id and i.corretor_id = auth.uid()));
