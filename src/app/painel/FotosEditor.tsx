"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";

export type FotoRow = { id: string; url: string; ordem: number | null; capa: boolean | null };

const MAX_ENTRADA = 20 * 1024 * 1024;
const LADO_MAX = 1920;

function caminhoNoBucket(url: string) {
  const i = url.indexOf("/imoveis/");
  return i >= 0 ? decodeURIComponent(url.slice(i + "/imoveis/".length)) : null;
}

// Redimensiona (lado maior até 1920px) e recomprime em JPEG: páginas públicas leves.
async function comprimir(arq: File): Promise<Blob> {
  const img = await createImageBitmap(arq);
  const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  img.close();
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.82));
  return blob && blob.size < arq.size ? blob : arq;
}

export default function FotosEditor({ imovelId, userId, fotos }: { imovelId: string; userId: string; fotos: FotoRow[] }) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const ordenadas = [...fotos].sort((a, b) => Number(b.capa) - Number(a.capa) || (a.ordem ?? 0) - (b.ordem ?? 0));

  // Grava a ordem da lista; a primeira foto é sempre a capa.
  async function salvarOrdem(lista: FotoRow[]) {
    const db = criarClienteNavegador();
    const resultados = await Promise.all(
      lista.map((f, i) => db.from("imovel_fotos").update({ ordem: i, capa: i === 0 }).eq("id", f.id)),
    );
    const falha = resultados.find((r) => r.error);
    if (falha?.error) setErro(falha.error.message);
  }

  async function executar(tarefa: () => Promise<void>) {
    setOcupado(true);
    setErro("");
    try {
      await tarefa();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Algo deu errado.");
    }
    setOcupado(false);
    router.refresh();
  }

  const enviar = (arquivos: FileList | null) =>
    executar(async () => {
      const db = criarClienteNavegador();
      let ordem = ordenadas.length;
      for (const arq of Array.from(arquivos ?? [])) {
        if (!arq.type.startsWith("image/") || arq.size > MAX_ENTRADA) {
          setErro(`"${arq.name}" ignorada: use imagens de até 20 MB.`);
          continue;
        }
        const corpo = await comprimir(arq);
        const ext = corpo === arq ? arq.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg" : "jpg";
        const caminho = `${userId}/${imovelId}/${crypto.randomUUID()}.${ext}`;
        const { error: errUp } = await db.storage.from("imoveis").upload(caminho, corpo, { contentType: corpo.type || arq.type });
        if (errUp) {
          setErro(errUp.message);
          continue;
        }
        const url = db.storage.from("imoveis").getPublicUrl(caminho).data.publicUrl;
        const { error } = await db.from("imovel_fotos").insert({ imovel_id: imovelId, url, ordem, capa: ordem === 0 });
        if (error) setErro(error.message);
        else ordem++;
      }
      if (entrada.current) entrada.current.value = "";
    });

  const remover = (f: FotoRow) =>
    executar(async () => {
      if (!confirm("Remover esta foto?")) return;
      const db = criarClienteNavegador();
      const caminho = caminhoNoBucket(f.url);
      if (caminho) await db.storage.from("imoveis").remove([caminho]);
      await db.from("imovel_fotos").delete().eq("id", f.id);
      await salvarOrdem(ordenadas.filter((o) => o.id !== f.id));
    });

  const mover = (i: number, d: -1 | 1) =>
    executar(async () => {
      const lista = [...ordenadas];
      [lista[i], lista[i + d]] = [lista[i + d], lista[i]];
      await salvarOrdem(lista);
    });

  const definirCapa = (f: FotoRow) =>
    executar(() => salvarOrdem([f, ...ordenadas.filter((o) => o.id !== f.id)]));

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">Fotos</h2>
        <button type="button" className="btn btn-ghost" disabled={ocupado} onClick={() => entrada.current?.click()}>
          {ocupado ? "Aguarde…" : "+ Adicionar fotos"}
        </button>
        <input ref={entrada} type="file" accept="image/*" multiple hidden onChange={(e) => enviar(e.target.files)} />
      </div>
      {erro && <p className="mt-3 text-sm font-medium text-red-600">{erro}</p>}

      {ordenadas.length === 0 ? (
        <p className="mt-4 text-sm text-ink-500">Nenhuma foto ainda. A primeira enviada vira a capa.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {ordenadas.map((f, i) => (
            <li key={f.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">Capa</span>}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent p-2 text-xs font-semibold text-white opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
                <span className="flex gap-2">
                  {i > 0 && <button type="button" disabled={ocupado} onClick={() => mover(i, -1)} aria-label="Mover para trás">◀</button>}
                  {i < ordenadas.length - 1 && <button type="button" disabled={ocupado} onClick={() => mover(i, 1)} aria-label="Mover para frente">▶</button>}
                  {i > 0 && <button type="button" disabled={ocupado} onClick={() => definirCapa(f)}>Capa</button>}
                </span>
                <button type="button" disabled={ocupado} onClick={() => remover(f)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
