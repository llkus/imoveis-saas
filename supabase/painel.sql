-- Rode no SQL Editor do Supabase DEPOIS do schema.sql.

-- Cria o perfil automaticamente no cadastro (slug e nome vêm do formulário)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, slug, nome)
  values (new.id, new.raw_user_meta_data->>'slug', coalesce(new.raw_user_meta_data->>'nome', 'Corretor'));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Bucket público de fotos; cada corretor só mexe na própria pasta (<user_id>/...)
insert into storage.buckets (id, name, public) values ('imoveis', 'imoveis', true)
  on conflict (id) do nothing;

create policy "fotos leitura" on storage.objects for select using (bucket_id = 'imoveis');
create policy "fotos envio" on storage.objects for insert to authenticated
  with check (bucket_id = 'imoveis' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "fotos edicao" on storage.objects for update to authenticated
  using (bucket_id = 'imoveis' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "fotos remocao" on storage.objects for delete to authenticated
  using (bucket_id = 'imoveis' and (storage.foldername(name))[1] = auth.uid()::text);
