"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirLicenca } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import { slugify } from "@/lib/util";

type Estado = { erro?: string; ok?: boolean } | null;

const texto = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const numero = (f: FormData, k: string) => {
  const v = texto(f, k).replace(/\./g, "").replace(",", ".");
  return v === "" ? null : Number(v);
};

function camposImovel(f: FormData) {
  return {
    titulo: texto(f, "titulo"),
    descricao: texto(f, "descricao") || null,
    tipo: texto(f, "tipo") || null,
    finalidade: texto(f, "finalidade") === "aluguel" ? "aluguel" : "venda",
    preco: numero(f, "preco"),
    quartos: numero(f, "quartos"),
    banheiros: numero(f, "banheiros"),
    vagas: numero(f, "vagas"),
    area_m2: numero(f, "area_m2"),
    bairro: texto(f, "bairro") || null,
    cidade: texto(f, "cidade") || null,
    uf: texto(f, "uf").toUpperCase().slice(0, 2) || null,
    diferenciais: texto(f, "diferenciais").split(/[\n,]/).map((d) => d.trim()).filter(Boolean),
    status: ["vendido", "arquivado"].includes(texto(f, "status")) ? texto(f, "status") : "ativo",
  };
}

const LIMITES_NUMERICOS = [
  ["preco", "Preço", 1e11],
  ["quartos", "Quartos", 99],
  ["banheiros", "Banheiros", 99],
  ["vagas", "Vagas", 99],
  ["area_m2", "Área", 1e6],
] as const;

// Devolve a mensagem do primeiro problema encontrado, ou null se estiver tudo certo.
function validarImovel(c: ReturnType<typeof camposImovel>) {
  if (!c.titulo) return "Informe o título do imóvel.";
  if (c.titulo.length > 120) return "O título pode ter no máximo 120 caracteres.";
  if ((c.descricao?.length ?? 0) > 5000) return "A descrição pode ter no máximo 5000 caracteres.";
  for (const [campo, nome, max] of LIMITES_NUMERICOS) {
    const v = c[campo];
    if (v !== null && (!Number.isFinite(v) || v < 0 || v > max)) return `${nome}: informe um número válido.`;
  }
  if (c.diferenciais.length > 30 || c.diferenciais.some((d) => d.length > 60)) {
    return "Use até 30 diferenciais de no máximo 60 caracteres cada.";
  }
  return null;
}

function invalidar(slugCorretor: string) {
  revalidatePath("/painel");
  revalidatePath(`/${slugCorretor}`, "layout");
}

function caminhoNoBucket(url: string) {
  const marca = "/imoveis/";
  const i = url.indexOf(marca);
  return i >= 0 ? decodeURIComponent(url.slice(i + marca.length)) : null;
}

export async function sair() {
  const db = await criarClienteServidor();
  await db.auth.signOut();
  redirect("/entrar");
}

export async function criarImovel(_: Estado, form: FormData): Promise<Estado> {
  const { db, user, perfil } = await exigirLicenca();
  const campos = camposImovel(form);
  const problema = validarImovel(campos);
  if (problema) return { erro: problema };

  const base = slugify(campos.titulo) || "imovel";
  let id: string | undefined;
  for (const slug of [base, `${base}-${Math.random().toString(36).slice(2, 6)}`]) {
    const { data, error } = await db
      .from("imoveis")
      .insert({ ...campos, slug, corretor_id: user.id })
      .select("id")
      .single();
    if (data) {
      id = data.id;
      break;
    }
    if (error?.code !== "23505") return { erro: error?.message ?? "Não foi possível salvar." };
  }
  if (!id) return { erro: "Não foi possível gerar um endereço único para o imóvel." };

  invalidar(perfil.slug);
  redirect(`/painel/imoveis/${id}`);
}

export async function atualizarImovel(id: string, _: Estado, form: FormData): Promise<Estado> {
  const { db, user, perfil } = await exigirLicenca();
  const campos = camposImovel(form);
  const problema = validarImovel(campos);
  if (problema) return { erro: problema };
  const { error } = await db.from("imoveis").update(campos).eq("id", id).eq("corretor_id", user.id);
  if (error) return { erro: error.message };
  invalidar(perfil.slug);
  return { ok: true };
}

export async function excluirImovel(id: string) {
  const { db, user, perfil } = await exigirLicenca();
  const { data: fotos } = await db.from("imovel_fotos").select("url").eq("imovel_id", id);
  const caminhos = (fotos ?? []).map((f) => caminhoNoBucket(f.url)).filter((c): c is string => !!c);
  if (caminhos.length) await db.storage.from("imoveis").remove(caminhos);
  await db.from("imoveis").delete().eq("id", id).eq("corretor_id", user.id);
  invalidar(perfil.slug);
  redirect("/painel");
}

export async function salvarPerfil(_: Estado, form: FormData): Promise<Estado> {
  const { db, user, perfil } = await exigirLicenca();
  const nome = texto(form, "nome");
  if (!nome) return { erro: "Informe seu nome." };
  if (nome.length > 100 || texto(form, "bio").length > 1000) return { erro: "Nome (até 100) ou bio (até 1000 caracteres) muito longos." };
  const cor = texto(form, "cor_primaria");
  const { error } = await db
    .from("profiles")
    .update({
      nome,
      creci: texto(form, "creci") || null,
      whatsapp: texto(form, "whatsapp").replace(/\D/g, "") || null,
      bio: texto(form, "bio") || null,
      cor_primaria: /^#[0-9a-f]{6}$/i.test(cor) ? cor : "#1d4ed8",
    })
    .eq("id", user.id);
  if (error) return { erro: error.message };
  invalidar(perfil.slug);
  return { ok: true };
}
