// Tipos e helpers compartilhados (servidor e cliente).

export type Corretor = {
  slug: string;
  nome: string;
  creci: string;
  whatsapp: string; // somente dígitos, com DDI
  bio: string;
  corPrimaria: string;
  fotoUrl?: string;
  capaUrl?: string;
};

export type Finalidade = "venda" | "aluguel" | "ambos";
export type MostrarEndereco = "completo" | "rua" | "bairro";

export type Imovel = {
  slug: string;
  titulo: string;
  descricao: string;
  tipo: string;
  finalidade: Finalidade;
  preco: number; // venda, ou aluguel quando finalidade = "aluguel"
  precoAluguel?: number; // só quando finalidade = "ambos"
  quartos: number;
  banheiros: number;
  vagas: number;
  areaM2: number; // área útil
  areaTotalM2?: number;
  uso?: "residencial" | "comercial";
  categoria?: string;
  suites?: number;
  andar?: number;
  endereco?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
  mostrarEndereco?: MostrarEndereco;
  bairro: string;
  cidade: string;
  uf: string;
  latitude?: number;
  longitude?: number;
  diferenciais: string[];
  caracteristicasCondominio?: string[];
  condominioAndares?: number;
  condominioUnidadesAndar?: number;
  condominioTorres?: number;
  anoConstrucao?: number;
  valorCondominio?: number;
  condominioIsento?: boolean;
  valorIptu?: number;
  iptuIsento?: boolean;
  iptuPeriodo?: "mensal" | "anual";
  videoUrl?: string;
  tourUrl?: string;
  fotos: string[];
  status: "ativo" | "vendido";
};

const moeda = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const temFinalidade = (i: Pick<Imovel, "finalidade">, f: "venda" | "aluguel") =>
  i.finalidade === f || i.finalidade === "ambos";

export const rotuloFinalidade = (f: Finalidade) => (f === "venda" ? "Venda" : f === "aluguel" ? "Aluguel" : "Venda e aluguel");

// Preço principal: venda (também em "venda e aluguel") ou aluguel mensal.
export function formatarPreco(i: Pick<Imovel, "preco" | "finalidade">) {
  const v = moeda(i.preco);
  return i.finalidade === "aluguel" ? `${v}/mês` : v;
}

export const formatarAluguel = (i: Pick<Imovel, "precoAluguel">) => (i.precoAluguel ? `${moeda(i.precoAluguel)}/mês` : null);

export const formatarMoeda = moeda;

type Local = { latitude?: number | null; longitude?: number | null; consulta: string };

function parametroLocal({ latitude, longitude, consulta }: Local) {
  return latitude != null && longitude != null ? `${latitude},${longitude}` : consulta;
}

// Mapa incorporável (sem chave de API) e link para abrir no app/site do Google Maps.
export function urlMapaEmbed(l: Local) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(parametroLocal(l))}&z=${l.latitude != null ? 17 : 15}&output=embed`;
}

export function urlGoogleMaps(l: Local) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parametroLocal(l))}`;
}

export function linkWhatsapp(c: Corretor, mensagem: string) {
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
