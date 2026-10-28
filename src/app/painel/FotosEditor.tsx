"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";

export type FotoRow = { id: string; url: string; ordem: number | null; capa: boolean | null };

const MAX_BYTES = 8 * 1024 * 1024;

function caminhoNoBucket(url: string) {
  const i = url.indexOf("/imoveis/");
  return i >= 0 ? decodeURIComponent(url.slice(i + "/imoveis/".length)) : null;
}

export default function FotosEditor({ imovelId, userId, fotos }: { imovelId: string; userId: string; fotos: FotoRow[] }) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  const ordenadas = [...fotos].sort((a, b) => Number(b.capa) - Number(a.capa) || (a.ordem ?? 0) - (b.ordem ?? 0));

  async function enviar(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setOcupado(true);
    setErro("");
    const db = criarClienteNavegador();
    let ordem = Math.max(-1, ...fotos.map((f) => f.ordem ?? 0)) + 1;
    let temCapa = fotos.some((f) => f.capa);

    for (const arq of Array.from(arquivos)) {
      if (!arq.type.startsWith("image/") || arq.size > MAX_BYTES) {
        setErro(`"${arq.name}" ignorada: use imagens de até 8 MB.`);
        continue;
      }
      const ext = arq.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const caminho = `${userId}/${imovelId}/${crypto.randomUUID()}.${ext}`;
      const { error: errUp } = await db.storage.from("imoveis").upload(caminho, arq, { contentType: arq.type });
      if (errUp) {
        setErro(errUp.message);
        continue;
      }
      const url = db.storage.from("imoveis").getPublicUrl(caminho).data.publicUrl;
      const { error } = await db.from("imovel_fotos").insert({ imovel_id: imovelId, url, ordem: ordem++, capa: !temCapa });
      if (error) setErro(error.message);
      else temCapa = true;
    }
    if (entrada.current) entrada.current.value = "";
    setOcupado(false);
    router.refresh();
  }

  async function remover(f: FotoRow) {
    if (!confirm("Remover esta foto?")) return;
    setOcupado(true);
    const db = criarClienteNavegador();
    const caminho = caminhoNoBucket(f.url);
    if (caminho) await db.storage.from("imoveis").remove([caminho]);
    await db.from("imovel_fotos").delete().eq("id", f.id);
    if (f.capa) {
      const proxima = ordenadas.find((o) => o.id !== f.id);
      if (proxima) await db.from("imovel_fotos").update({ capa: true }).eq("id", proxima.id);
    }
    setOcupado(false);
    router.refresh();
  }

  async function definirCapa(f: FotoRow) {
    setOcupado(true);
    const db = criarClienteNavegador();
    await db.from("imovel_fotos").update({ capa: false }).eq("imovel_id", imovelId);
    await db.from("imovel_fotos").update({ capa: true }).eq("id", f.id);
    setOcupado(false);
    router.refresh();
  }

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
          {ordenadas.map((f) => (
            <li key={f.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="h-full w-full object-cover" />
              {f.capa && <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">Capa</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {!f.capa ? <button type="button" onClick={() => definirCapa(f)}>Definir capa</button> : <span />}
                <button type="button" onClick={() => remover(f)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
