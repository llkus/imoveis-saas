// Tipos e helpers compartilhados (servidor e cliente).

export type Corretor = {
  slug: string;
  nome: string;
  creci: string;
  whatsapp: string; // somente dígitos, com DDI
  bio: string;
  corPrimaria: string;
};

export type Imovel = {
  slug: string;
  titulo: string;
  descricao: string;
  tipo: string;
  finalidade: "venda" | "aluguel";
  preco: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  areaM2: number;
  bairro: string;
  cidade: string;
  uf: string;
  diferenciais: string[];
  fotos: string[];
  status: "ativo" | "vendido";
};

export function formatarPreco(i: Pick<Imovel, "preco" | "finalidade">) {
  const v = i.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  return i.finalidade === "aluguel" ? `${v}/mês` : v;
}

export function linkWhatsapp(c: Corretor, mensagem: string) {
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
