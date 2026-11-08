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
  foto_url: string | null;
  capa_url: string | null;
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
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  cep: string | null;
  mostrar_endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  latitude: number | null;
  longitude: number | null;
  uso: string | null;
  categoria: string | null;
  suites: number | null;
  andar: number | null;
  area_total_m2: number | null;
  preco_aluguel: number | null;
  diferenciais: string[] | null;
  caracteristicas_condominio: string[] | null;
  condominio_andares: number | null;
  condominio_unidades_andar: number | null;
  condominio_torres: number | null;
  ano_construcao: number | null;
  valor_condominio: number | null;
  condominio_isento: boolean | null;
  valor_iptu: number | null;
  iptu_isento: boolean | null;
  iptu_periodo: string | null;
  video_url: string | null;
  tour_url: string | null;
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
    fotoUrl: p.foto_url ?? undefined,
    capaUrl: p.capa_url ?? undefined,
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
    finalidade: r.finalidade === "aluguel" || r.finalidade === "ambos" ? r.finalidade : "venda",
    preco: Number(r.preco ?? 0),
    precoAluguel: r.preco_aluguel != null ? Number(r.preco_aluguel) : undefined,
    quartos: r.quartos ?? 0,
    banheiros: r.banheiros ?? 0,
    vagas: r.vagas ?? 0,
    areaM2: Number(r.area_m2 ?? 0),
    areaTotalM2: r.area_total_m2 != null ? Number(r.area_total_m2) : undefined,
    uso: r.uso === "comercial" ? "comercial" : "residencial",
    categoria: r.categoria ?? undefined,
    suites: r.suites ?? undefined,
    andar: r.andar ?? undefined,
    endereco: r.endereco ?? "",
    numero: r.numero ?? "",
    complemento: r.complemento ?? "",
    cep: r.cep ?? "",
    mostrarEndereco: r.mostrar_endereco === "rua" || r.mostrar_endereco === "bairro" ? r.mostrar_endereco : "completo",
    bairro: r.bairro ?? "",
    cidade: r.cidade ?? "",
    uf: r.uf ?? "",
    latitude: r.latitude ?? undefined,
    longitude: r.longitude ?? undefined,
    diferenciais: r.diferenciais ?? [],
    caracteristicasCondominio: r.caracteristicas_condominio ?? [],
    condominioAndares: r.condominio_andares ?? undefined,
    condominioUnidadesAndar: r.condominio_unidades_andar ?? undefined,
    condominioTorres: r.condominio_torres ?? undefined,
    anoConstrucao: r.ano_construcao ?? undefined,
    valorCondominio: r.valor_condominio != null ? Number(r.valor_condominio) : undefined,
    condominioIsento: r.condominio_isento ?? false,
    valorIptu: r.valor_iptu != null ? Number(r.valor_iptu) : undefined,
    iptuIsento: r.iptu_isento ?? false,
    iptuPeriodo: r.iptu_periodo === "anual" ? "anual" : r.iptu_periodo === "mensal" ? "mensal" : undefined,
    videoUrl: r.video_url ?? undefined,
    tourUrl: r.tour_url ?? undefined,
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
