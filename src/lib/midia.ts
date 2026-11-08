// Links de vídeo (YouTube ou Instagram) e de tour virtual. Funciona no servidor e no cliente.

type VideoEmbed = { provedor: "youtube" | "instagram"; embed: string; original: string };

function analisar(url: string) {
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u : null;
  } catch {
    return null;
  }
}

export function videoEmbed(url: string | null | undefined): VideoEmbed | null {
  const u = url ? analisar(url) : null;
  if (!u) return null;
  const host = u.hostname.replace(/^(www|m)\./, "");
  const original = u.toString();

  if (host === "youtu.be" || host === "youtube.com") {
    const partes = u.pathname.split("/").filter(Boolean);
    const id =
      host === "youtu.be"
        ? partes[0]
        : (u.searchParams.get("v") ?? (["shorts", "embed", "live"].includes(partes[0]) ? partes[1] : undefined));
    return id && /^[\w-]{6,20}$/.test(id)
      ? { provedor: "youtube", embed: `https://www.youtube-nocookie.com/embed/${id}`, original }
      : null;
  }

  if (host === "instagram.com") {
    const [tipo, codigo] = u.pathname.split("/").filter(Boolean);
    return ["p", "reel", "reels", "tv"].includes(tipo) && /^[\w-]{5,20}$/.test(codigo ?? "")
      ? {
          provedor: "instagram",
          embed: `https://www.instagram.com/${tipo === "reels" ? "reel" : tipo}/${codigo}/embed`,
          original,
        }
      : null;
  }
  return null;
}

// Tour virtual: qualquer endereço https (é aberto em outra aba, nunca incorporado).
export function urlTourValida(url: string | null | undefined) {
  const u = url ? analisar(url) : null;
  return !!u && u.protocol === "https:";
}
