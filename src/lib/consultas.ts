import type { Corretor, Imovel } from "./dados";
import { getCorretorExemplo, getImoveisExemplo } from "./exemplo";
import { supabaseConfigurado } from "./supabase/config";
import { criarClientePublico } from "./supabase/publico";

type PerfilRow = {
  id: string;
  slug: string;
  nome: string;
  creci: string | null;
  whatsapp: string | null;
  bio: string | null;
  cor_primaria: string | null;
};

type FotoRow = { url: string; ordem: number | null; capa: boolean | null };

export type ImovelRow = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  tipo: string | null;
  finalidade: string | null;
  preco: number | null;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_m2: number | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  diferenciais: string[] | null;
  status: string | null;
  imovel_fotos?: FotoRow[];
};

function perfilParaCorretor(p: PerfilRow): Corretor {
  return {
    slug: p.slug,
    nome: p.nome,
    creci: p.creci ?? "",
    whatsapp: (p.whatsapp ?? "").replace(/\D/g, ""),
    bio: p.bio ?? "",
    corPrimaria: p.cor_primaria ?? "#1d4ed8",
  };
}

function rowParaImovel(r: ImovelRow): Imovel {
  const fotos = [...(r.imovel_fotos ?? [])]
    .sort((a, b) => Number(b.capa) - Number(a.capa) || (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((f) => f.url);
  return {
    slug: r.slug,
    titulo: r.titulo,
    descricao: r.descricao ?? "",
    tipo: r.tipo ?? "",
    finalidade: r.finalidade === "aluguel" ? "aluguel" : "venda",
    preco: Number(r.preco ?? 0),
    quartos: r.quartos ?? 0,
    banheiros: r.banheiros ?? 0,
    vagas: r.vagas ?? 0,
    areaM2: Number(r.area_m2 ?? 0),
    bairro: r.bairro ?? "",
    cidade: r.cidade ?? "",
    uf: r.uf ?? "",
    diferenciais: r.diferenciais ?? [],
    fotos,
    status: r.status === "vendido" ? "vendido" : "ativo",
  };
}

const SELECT_IMOVEL = "*, imovel_fotos(url, ordem, capa)";

export async function getCorretor(slug: string): Promise<Corretor | null> {
  if (!supabaseConfigurado) return getCorretorExemplo(slug);
  const { data } = await criarClientePublico().from("profiles").select("*").eq("slug", slug).maybeSingle();
  return data ? perfilParaCorretor(data as PerfilRow) : null;
}

export async function getImoveis(corretorSlug: string): Promise<Imovel[]> {
  if (!supabaseConfigurado) return getImoveisExemplo(corretorSlug);
  const db = criarClientePublico();
  const { data: perfil } = await db.from("profiles").select("id").eq("slug", corretorSlug).maybeSingle();
  if (!perfil) return [];
  const { data } = await db
    .from("imoveis")
    .select(SELECT_IMOVEL)
    .eq("corretor_id", perfil.id)
    .order("created_at", { ascending: false });
  return ((data ?? []) as ImovelRow[]).map(rowParaImovel);
}

export async function getImovel(corretorSlug: string, slug: string): Promise<Imovel | null> {
  return (await getImoveis(corretorSlug)).find((i) => i.slug === slug) ?? null;
}
