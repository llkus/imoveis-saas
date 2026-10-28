"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { SLUGS_RESERVADOS, slugify } from "@/lib/util";

type Estado = { erro?: string; aviso?: string } | null;

export async function entrar(_: Estado, form: FormData): Promise<Estado> {
  const db = await criarClienteServidor();
  const { error } = await db.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("senha") ?? ""),
  });
  if (error?.code === "email_not_confirmed") return { erro: "Confirme seu e-mail antes de entrar." };
  if (error) return { erro: "E-mail ou senha incorretos." };
  redirect("/painel");
}

export async function cadastrar(_: Estado, form: FormData): Promise<Estado> {
  const nome = String(form.get("nome") ?? "").trim();
  const slug = slugify(String(form.get("slug") ?? ""));
  const senha = String(form.get("senha") ?? "");
  if (!nome) return { erro: "Informe seu nome." };
  if (slug.length < 3) return { erro: "O endereço precisa ter pelo menos 3 letras." };
  if (SLUGS_RESERVADOS.includes(slug)) return { erro: "Esse endereço não está disponível." };
  if (senha.length < 6) return { erro: "A senha precisa ter pelo menos 6 caracteres." };

  const db = await criarClienteServidor();
  const { data: existente } = await db.from("profiles").select("id").eq("slug", slug).maybeSingle();
  if (existente) return { erro: "Esse endereço já está em uso. Escolha outro." };

  const { data, error } = await db.auth.signUp({
    email: String(form.get("email") ?? "").trim(),
    password: senha,
    options: { data: { nome, slug } },
  });
  if (error) return { erro: error.message };
  if (!data.session) return { aviso: "Conta criada! Confirme seu e-mail para entrar." };
  redirect("/painel");
}
