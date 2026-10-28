export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Rotas que não podem virar o endereço de um corretor (/[corretor])
export const SLUGS_RESERVADOS = ["painel", "entrar", "api", "admin", "licenca"];
