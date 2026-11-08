// Listas fixas das caixas de marcação do cadastro (mesmas do Canal Pro).

export const TIPOS_IMOVEL = [
  "Apartamento", "Casa", "Casa de condomínio", "Casa de vila", "Cobertura", "Sobrado", "Flat",
  "Kitnet/Conjugado", "Loft", "Studio", "Lote/Terreno", "Fazenda/Sítio/Chácara", "Sala comercial",
  "Prédio/Edifício inteiro",
];

export const CATEGORIAS = ["Padrão", "Duplex", "Triplex"];

export const CARACTERISTICAS_IMOVEL = [
  "Aceita animais", "Ar-condicionado", "Closet", "Cozinha americana", "Lareira", "Mobiliado", "Varanda gourmet",
];

export const GRUPOS_CONDOMINIO: { nome: string; itens: string[] }[] = [
  {
    nome: "Lazer e esporte",
    itens: [
      "Academia", "Churrasqueira", "Cinema", "Espaço gourmet", "Jardim", "Piscina", "Playground",
      "Quadra de squash", "Quadra de tênis", "Quadra poliesportiva", "Salão de festas", "Salão de jogos",
    ],
  },
  {
    nome: "Comodidades e serviços",
    itens: ["Acesso para deficientes", "Bicicletário", "Coworking", "Elevador", "Lavanderia", "Sauna", "Spa"],
  },
  { nome: "Segurança", itens: ["Condomínio fechado", "Portão eletrônico", "Portaria 24h"] },
];

export const CARACTERISTICAS_CONDOMINIO = GRUPOS_CONDOMINIO.flatMap((g) => g.itens);

// Separa o que está salvo em itens da lista fixa (caixas) e itens digitados à mão.
export function separarItens(salvos: string[] | null | undefined, fixos: string[]) {
  const lista = salvos ?? [];
  return { marcados: lista.filter((s) => fixos.includes(s)), extras: lista.filter((s) => !fixos.includes(s)) };
}
