# Imóveis SaaS

Plataforma para corretores autônomos gerenciarem imóveis (fotos + descrição completa)
e compartilharem um portfólio/landing page com clientes, inclusive em domínio próprio.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth, Postgres, Storage)
- Deploy: Vercel

## MVP
1. Cadastro/login do corretor e perfil
2. Painel de imóveis (CRUD, upload e ordenação de fotos)
3. Portfólio público `/{corretor}`
4. Landing page do imóvel `/{corretor}/{imovel}`
5. (Fase 2) Domínio próprio por corretor

## Configuração
1. Crie um projeto no Supabase e rode no SQL Editor, nesta ordem: `supabase/schema.sql`, `supabase/painel.sql`, `supabase/licencas.sql`.
2. Copie `.env.local.example` para `.env.local` e preencha URL e anon key (Project Settings > API).
3. `npm run dev`, crie sua conta em `/entrar` e torne-se admin com o SQL comentado no fim de `licencas.sql`.

Sem as variáveis de ambiente o site roda com dados de exemplo.

## Como funciona
- Login com Supabase Auth: a sessão é um JWT em cookie; o `src/proxy.ts` valida e renova o token.
- Licença por corretor (`profiles.licenca_ativa` + `licenca_expira_em`). Sem licença válida o painel é bloqueado (`/licenca`), o portfólio público some e o banco recusa escrita (RLS).
- `/admin`: o administrador ativa, define vencimento ou revoga a licença de cada corretor.
