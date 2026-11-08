"use client";

import { useState } from "react";

// Descrição limitada a poucas linhas para o painel caber sem rolagem; "Ler mais" expande no lugar.
export default function DescricaoCurta({ texto, cor }: { texto: string; cor: string }) {
  const [aberta, setAberta] = useState(false);
  return (
    <div>
      <p className={`whitespace-pre-line text-[13px] leading-relaxed text-ink-700 ${aberta ? "" : "line-clamp-3"}`}>{texto}</p>
      {texto.length > 140 && (
        <button type="button" onClick={() => setAberta(!aberta)} className="mt-1 text-xs font-bold hover:underline" style={{ color: cor }}>
          {aberta ? "Mostrar menos" : "Ler mais"}
        </button>
      )}
    </div>
  );
}
