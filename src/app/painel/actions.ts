"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirLicenca } from "@/lib/auth";
import { CATEGORIAS } from "@/lib/caracteristicas";
import { urlTourValida, videoEmbed } from "@/lib/midia";
import { caminhoNoBucket } from "@/lib/imagem";
import { supabaseUrl } from "@/lib/supabase/config";
import { criarClienteServidor } from "@/lib/supabase/server";
import { slugify } from "@/lib/util";

type Estado = { erro?: string; ok?: boolean } | null;

const texto = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const numero = (f: FormData, k: string) => {
  const v = texto(f, k).replace(/\./g, "").replace(",", ".");
  return v === "" ? null : Number(v);
};

const coordenada = (f: FormData, k: string) => {
  const v = texto(f, k);
  return v === "" ? null : Number(v);
};

// Junta as caixas marcadas com os itens digitados à mão, sem repetir.
function unirItens(marcados: FormDataEntryValue[], extras: string) {
  const todos = [...marcados.map(String), ...extras.split(/[\n,]/)].map((d) => d.trim()).filter(Boolean);
  return [...new Set(todos)];
}

const escolha = <T extends string>(valor: string, validos: readonly T[]) =>
  (validos as readonly string[]).includes(valor) ? (valor as T) : null;

function camposImovel(f: FormData) {
  const finalidade = escolha(texto(f, "finalidade"), ["venda", "aluguel", "ambos"] as const) ?? "venda";
  const condIsento = f.get("condominio_isento") === "on";
  const iptuIsento = f.get("iptu_isento") === "on";
  return {
    titulo: texto(f, "titulo"),
    descricao: texto(f, "descricao") || null,
    tipo: texto(f, "tipo") || null,
    uso: escolha(texto(f, "uso"), ["residencial", "comercial"] as const) ?? "residencial",
    categoria: texto(f, "categoria") || null,
    finalidade,
    preco: numero(f, "preco"),
    preco_aluguel: finalidade === "ambos" ? numero(f, "preco_aluguel") : null,
    quartos: numero(f, "quartos"),
    suites: numero(f, "suites"),
    banheiros: numero(f, "banheiros"),
    vagas: numero(f, "vagas"),
    andar: numero(f, "andar"),
    area_m2: numero(f, "area_m2"),
    area_total_m2: numero(f, "area_total_m2"),
    cep: texto(f, "cep").replace(/\D/g, "") || null,
    endereco: texto(f, "endereco") || null,
    numero: texto(f, "numero") || null,
    complemento: texto(f, "complemento") || null,
    mostrar_endereco: escolha(texto(f, "mostrar_endereco"), ["completo", "rua", "bairro"] as const) ?? "completo",
    bairro: texto(f, "bairro") || null,
    cidade: texto(f, "cidade") || null,
    uf: texto(f, "uf").toUpperCase().slice(0, 2) || null,
    latitude: coordenada(f, "latitude"),
    longitude: coordenada(f, "longitude"),
    diferenciais: unirItens(f.getAll("diferencial"), texto(f, "diferenciais_extra")),
    caracteristicas_condominio: unirItens(f.getAll("cond_carac"), texto(f, "cond_extra")),
    condominio_andares: numero(f, "condominio_andares"),
    condominio_unidades_andar: numero(f, "condominio_unidades_andar"),
    condominio_torres: numero(f, "condominio_torres"),
    ano_construcao: numero(f, "ano_construcao"),
    condominio_isento: condIsento,
    valor_condominio: condIsento ? null : numero(f, "valor_condominio"),
    iptu_isento: iptuIsento,
    valor_iptu: iptuIsento ? null : numero(f, "valor_iptu"),
    iptu_periodo: iptuIsento ? null : escolha(texto(f, "iptu_periodo"), ["mensal", "anual"] as const),
    video_url: texto(f, "video_url") || null,
    tour_url: texto(f, "tour_url") || null,
    status: ["vendido", "arquivado"].includes(texto(f, "status")) ? texto(f, "status") : "ativo",
  };
}

const LIMITES_NUMERICOS = [
  ["preco", "Valor", 1e11],
  ["preco_aluguel", "Valor do aluguel", 1e11],
  ["quartos", "Quartos", 99],
  ["suites", "Suítes", 99],
  ["banheiros", "Banheiros", 99],
  ["vagas", "Vagas", 99],
  ["andar", "Andar", 300],
  ["area_m2", "Área útil", 1e6],
  ["area_total_m2", "Área total", 1e6],
  ["condominio_andares", "Nº de andares", 300],
  ["condominio_unidades_andar", "Unidades por andar", 99],
  ["condominio_torres", "Nº de torres", 99],
  ["valor_condominio", "Condomínio", 1e8],
  ["valor_iptu", "IPTU", 1e8],
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
  if (c.ano_construcao !== null && (c.ano_construcao < 1800 || c.ano_construcao > new Date().getFullYear() + 10)) {
    return "Ano de construção inválido.";
  }
  if (c.categoria && !CATEGORIAS.includes(c.categoria)) return "Categoria inválida.";
  if (c.cep && c.cep.length !== 8) return "CEP inválido: use 8 dígitos.";
  if ((c.endereco?.length ?? 0) > 200 || (c.numero?.length ?? 0) > 20 || (c.complemento?.length ?? 0) > 100) {
    return "Endereço, número ou complemento muito longos.";
  }
  const { latitude: lat, longitude: lng } = c;
  if ((lat === null) !== (lng === null)) return "Localização incompleta: busque o endereço novamente.";
  if (lat !== null && lng !== null && !(Math.abs(lat) <= 90 && Math.abs(lng) <= 180)) {
    return "Localização inválida: busque o endereço novamente.";
  }
  for (const lista of [c.diferenciais, c.caracteristicas_condominio]) {
    if (lista.length > 40 || lista.some((d) => d.length > 60)) {
      return "Use até 40 características de no máximo 60 caracteres cada.";
    }
  }
  if (c.video_url && !videoEmbed(c.video_url))
    return "Vídeo: use um link público do YouTube ou do Instagram (reel ou post).";
  if (c.tour_url && !urlTourValida(c.tour_url)) return "Tour virtual: informe um link que comece com https://.";
  return null;
}

function invalidar(slugCorretor: string) {
  revalidatePath("/painel");
  revalidatePath(`/${slugCorretor}`, "layout");
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
  if (nome.length > 100 || texto(form, "bio").length > 1000)
    return { erro: "Nome (até 100) ou bio (até 1000 caracteres) muito longos." };
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

// Grava a foto de perfil ou a capa (já enviada ao Storage pelo navegador) e apaga a anterior.
export async function salvarImagemPerfil(campo: "foto_url" | "capa_url", url: string | null): Promise<Estado> {
  const { db, user, perfil } = await exigirLicenca();
  if (campo !== "foto_url" && campo !== "capa_url") return { erro: "Campo inválido." };
  if (url && !url.startsWith(`${supabaseUrl}/storage/v1/object/public/imoveis/${user.id}/`)) {
    return { erro: "Imagem inválida." };
  }

  const { data: atual } = await db
    .from("profiles")
    .select(campo)
    .eq("id", user.id)
    .single<Record<string, string | null>>();
  const { error } = await db
    .from("profiles")
    .update({ [campo]: url })
    .eq("id", user.id);
  if (error) return { erro: error.message };

  const antiga = atual?.[campo];
  const caminho = antiga && antiga !== url ? caminhoNoBucket(antiga) : null;
  if (caminho) await db.storage.from("imoveis").remove([caminho]);
  invalidar(perfil.slug);
  return { ok: true };
}
