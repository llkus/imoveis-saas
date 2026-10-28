import { redirect } from "next/navigation";
import { criarClienteServidor } from "./supabase/server";

export type Perfil = {
  id: string;
  slug: string;
  nome: string;
  is_admin: boolean;
  licenca_ativa: boolean;
  licenca_expira_em: string | null;
};

export function licencaValida(p: Pick<Perfil, "licenca_ativa" | "licenca_expira_em">) {
  const hoje = new Date().toISOString().slice(0, 10);
  return p.licenca_ativa && (!p.licenca_expira_em || p.licenca_expira_em >= hoje);
}

// Exige login e devolve o cliente (já com o JWT da sessão) e o perfil do usuário.
export async function exigirUsuario() {
  const db = await criarClienteServidor();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/entrar");
  const { data: perfil } = await db
    .from("profiles")
    .select("id, slug, nome, is_admin, licenca_ativa, licenca_expira_em")
    .eq("id", data.user.id)
    .single<Perfil>();
  if (!perfil) redirect("/entrar");
  return { db, user: data.user, perfil };
}

export async function exigirLicenca() {
  const sessao = await exigirUsuario();
  if (!licencaValida(sessao.perfil)) redirect("/licenca");
  return sessao;
}

export async function exigirAdmin() {
  const sessao = await exigirUsuario();
  if (!sessao.perfil.is_admin) redirect("/painel");
  return sessao;
}
