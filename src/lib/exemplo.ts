import type { Corretor, Imovel } from "./dados";

// Dados de demonstração, usados só quando o Supabase não está configurado.

const foto = (seed: string) => `https://picsum.photos/seed/${seed}/1200/800`;

export const corretores: Corretor[] = [
  {
    slug: "exemplo",
    nome: "Corretor Exemplo",
    creci: "CRECI 12345-F",
    whatsapp: "5511999999999",
    bio: "Corretor autônomo com foco em atendimento personalizado. Te ajudo a encontrar o imóvel certo, do primeiro contato à entrega das chaves.",
    corPrimaria: "#1d4ed8",
  },
];

export const imoveis: Record<string, Imovel[]> = {
  exemplo: [
    {
      slug: "casa-jardim-das-flores",
      titulo: "Casa ampla no Jardim das Flores",
      descricao:
        "Casa térrea com acabamento de alto padrão, cozinha integrada à sala, quintal com área gourmet e piscina. Rua tranquila, próxima a escolas, mercados e transporte.",
      tipo: "Casa",
      finalidade: "venda",
      preco: 890000,
      quartos: 3,
      banheiros: 3,
      vagas: 2,
      areaM2: 220,
      bairro: "Jardim das Flores",
      cidade: "São Paulo",
      uf: "SP",
      diferenciais: ["Piscina", "Área gourmet", "Cozinha planejada", "Ar-condicionado"],
      fotos: ["casa1", "casa2", "casa3", "casa4"].map(foto),
      status: "ativo",
    },
    {
      slug: "apartamento-centro",
      titulo: "Apartamento moderno no Centro",
      descricao:
        "Apartamento com varanda, ótima iluminação natural e vista livre. Condomínio com portaria 24h, academia e salão de festas.",
      tipo: "Apartamento",
      finalidade: "aluguel",
      preco: 3200,
      quartos: 2,
      banheiros: 2,
      vagas: 1,
      areaM2: 78,
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      diferenciais: ["Varanda", "Portaria 24h", "Academia", "Salão de festas"],
      fotos: ["apto1", "apto2", "apto3"].map(foto),
      status: "ativo",
    },
  ],
};

export function getCorretorExemplo(slug: string) {
  return corretores.find((c) => c.slug === slug) ?? null;
}

export function getImoveisExemplo(slug: string) {
  return imoveis[slug] ?? [];
}
