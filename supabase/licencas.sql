-- Rode no SQL Editor do Supabase DEPOIS de schema.sql e painel.sql.
-- Controle de licença por corretor + papel de administrador.

alter table profiles
  add column if not exists is_admin boolean not null default false,
  add column if not exists licenca_ativa boolean not null default false,
  add column if not exists licenca_expira_em date;

-- Licença vale quando ativa e dentro do prazo (sem prazo = sem vencimento)
create or replace function public.licenca_valida(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = uid and licenca_ativa and (licenca_expira_em is null or licenca_expira_em >= current_date)
  );
$$;

create or replace function public.eh_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- Corretor nunca altera a própria licença nem vira admin.
-- auth.uid() nulo = SQL Editor / service role, que podem tudo.
create or replace function public.proteger_campos_licenca() returns trigger
language plpgsql as $$
begin
  if auth.uid() is null or public.eh_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.is_admin := false;
    new.licenca_ativa := false;
    new.licenca_expira_em := null;
  elsif (new.is_admin, new.licenca_ativa, new.licenca_expira_em)
        is distinct from (old.is_admin, old.licenca_ativa, old.licenca_expira_em) then
    raise exception 'Sem permissão para alterar a licença';
  end if;
  return new;
end $$;

drop trigger if exists proteger_licenca on profiles;
create trigger proteger_licenca before insert or update on profiles
  for each row execute function public.proteger_campos_licenca();

-- Leitura pública só de corretores licenciados
drop policy if exists "perfis publicos" on profiles;
create policy "perfis visiveis" on profiles for select
  using (public.licenca_valida(id) or id = auth.uid() or public.eh_admin());

create policy "admin gerencia perfis" on profiles for all
  using (public.eh_admin()) with check (public.eh_admin());

-- Imóveis: públicos só com licença válida; escrita só com licença válida
drop policy if exists "imoveis publicos" on imoveis;
create policy "imoveis publicos" on imoveis for select
  using (status <> 'arquivado' and public.licenca_valida(corretor_id));

drop policy if exists "dono edita imoveis" on imoveis;
create policy "dono edita imoveis" on imoveis for all
  using (auth.uid() = corretor_id and public.licenca_valida(auth.uid()))
  with check (auth.uid() = corretor_id and public.licenca_valida(auth.uid()));

-- Upload de fotos também exige licença
drop policy if exists "fotos envio" on storage.objects;
create policy "fotos envio" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'imoveis'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.licenca_valida(auth.uid())
  );

-- Depois de criar sua conta no site, torne-se admin (troque o e-mail):
-- update profiles set is_admin = true, licenca_ativa = true
--   where id = (select id from auth.users where email = 'seu@email.com');
