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

## Status
- [x] Planejamento e esquema do banco (`supabase/schema.sql`)
- [x] Projeto Next.js criado (App Router, TS, Tailwind)

