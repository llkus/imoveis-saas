-- Rode no SQL Editor do Supabase (pode rodar de novo): lista de corretores com e-mail e busca, só para admin.
-- O e-mail fica em auth.users; esta função o devolve apenas quando quem chama é admin (eh_admin()).
create or replace function public.admin_listar_corretores(busca text default '')
returns table (
  id uuid,
  slug text,
  nome text,
  email text,
  is_admin boolean,
  licenca_ativa boolean,
  licenca_expira_em date,
  created_at timestamptz,
  total bigint
)
language sql stable security definer set search_path = public, auth as $$
  with termo as (
    select '%' || replace(replace(replace(trim(coalesce(busca, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%' as padrao,
           trim(coalesce(busca, '')) = '' as vazio
  )
  select p.id, p.slug, p.nome, u.email::text, p.is_admin, p.licenca_ativa, p.licenca_expira_em, p.created_at,
         count(*) over ()
  from profiles p
  join auth.users u on u.id = p.id
  cross join termo t
  where public.eh_admin()
    and (t.vazio or u.email ilike t.padrao or p.nome ilike t.padrao or p.slug ilike t.padrao)
  order by p.licenca_ativa, p.nome
  limit 100;
$$;

revoke all on function public.admin_listar_corretores(text) from public, anon;
grant execute on function public.admin_listar_corretores(text) to authenticated;
