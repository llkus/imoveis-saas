"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import Enquadrar from "./Enquadrar";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { salvarImagemPerfil } from "../actions";

type Campo = "foto_url" | "capa_url";

export default function ImagensPerfil({
  userId,
  nome,
  cor,
  fotoUrl,
  capaUrl,
}: {
  userId: string;
  nome: string;
  cor: string;
  fotoUrl?: string;
  capaUrl?: string;
}) {
  const router = useRouter();
  const entradaFoto = useRef<HTMLInputElement>(null);
  const entradaCapa = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [pendente, setPendente] = useState<{ campo: Campo; arq: File } | null>(null);

  function escolher(campo: Campo, arq: File | undefined) {
    if (!arq) return;
    if (!arq.type.startsWith("image/") || arq.size > 20 * 1024 * 1024) {
      setErro("Use uma imagem de até 20 MB.");
      return;
    }
    setErro("");
    setPendente({ campo, arq });
  }

  async function enviar(campo: Campo, corpo: Blob) {
    setPendente(null);
    setOcupado(true);
    setErro("");
    try {
      const db = criarClienteNavegador();
      const caminho = `${userId}/perfil/${campo}-${crypto.randomUUID()}.jpg`;
      const { error } = await db.storage.from("imoveis").upload(caminho, corpo, { contentType: "image/jpeg" });
      if (error) throw new Error(error.message);
      const url = db.storage.from("imoveis").getPublicUrl(caminho).data.publicUrl;
      const r = await salvarImagemPerfil(campo, url);
      if (r?.erro) throw new Error(r.erro);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar a imagem.");
    }
    setOcupado(false);
    router.refresh();
  }

  async function remover(campo: Campo) {
    setOcupado(true);
    const r = await salvarImagemPerfil(campo, null);
    setErro(r?.erro ?? "");
    setOcupado(false);
    router.refresh();
  }

  return (
    <section className="card overflow-hidden">
      <div
        className="relative h-40 sm:h-52"
        style={{ background: `linear-gradient(135deg, ${cor}, color-mix(in srgb, ${cor} 45%, #0b1020))` }}
      >
        {capaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={capaUrl} alt="Capa do perfil" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute right-3 top-3 flex gap-2 text-xs font-semibold">
          <button
            type="button"
            disabled={ocupado}
            onClick={() => entradaCapa.current?.click()}
            className="rounded-full bg-black/55 px-3 py-1.5 text-white backdrop-blur hover:bg-black/70"
          >
            {capaUrl ? "Trocar capa" : "Adicionar capa"}
          </button>
          {capaUrl && (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => remover("capa_url")}
              className="rounded-full bg-black/55 px-3 py-1.5 text-white backdrop-blur hover:bg-black/70"
            >
              Remover
            </button>
          )}
        </div>
      </div>

      <div className="flex items-end gap-4 px-6 pb-5">
        <div className="relative z-10 -mt-12 rounded-full ring-4 ring-white">
          <Avatar nome={nome} fotoUrl={fotoUrl} cor={cor} className="h-24 w-24 text-3xl" />
        </div>
        <div className="flex flex-wrap gap-2 pb-1 text-sm font-semibold">
          <button
            type="button"
            disabled={ocupado}
            onClick={() => entradaFoto.current?.click()}
            className="btn btn-ghost !px-4 !py-2"
          >
            {ocupado ? "Enviando…" : fotoUrl ? "Trocar foto" : "Adicionar foto de perfil"}
          </button>
          {fotoUrl && (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => remover("foto_url")}
              className="px-2 text-ink-500 hover:text-red-600"
            >
              Remover
            </button>
          )}
        </div>
      </div>
      {erro && <p className="px-6 pb-4 text-sm font-medium text-red-600">{erro}</p>}

      <input
        ref={entradaFoto}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          escolher("foto_url", e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={entradaCapa}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          escolher("capa_url", e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {pendente && (
        <Enquadrar
          arquivo={pendente.arq}
          proporcao={pendente.campo === "foto_url" ? 1 : 3}
          redonda={pendente.campo === "foto_url"}
          larguraSaida={pendente.campo === "foto_url" ? 640 : 1600}
          titulo={pendente.campo === "foto_url" ? "Ajustar foto de perfil" : "Ajustar capa"}
          onConfirmar={(img) => enviar(pendente.campo, img)}
          onCancelar={() => setPendente(null)}
        />
      )}
    </section>
  );
}
