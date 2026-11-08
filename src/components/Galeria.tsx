"use client";

import { useCallback, useEffect, useState } from "react";
import { IconArrow, IconClose } from "./Icons";

// No celular: foto grande + miniaturas. No computador (lg): preenche o cartão da página,
// com as miniaturas sobre a foto.
export default function Galeria({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [atual, setAtual] = useState(0);
  const [aberta, setAberta] = useState(false);

  const ir = useCallback(
    (d: number) => setAtual((a) => (a + d + fotos.length) % fotos.length),
    [fotos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(false);
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ir]);

  if (fotos.length === 0) {
    return <div className="grid aspect-[16/10] w-full place-items-center rounded-3xl bg-slate-100 text-ink-500 lg:h-full lg:rounded-none">Sem fotos</div>;
  }

  return (
    <div className="relative lg:h-full lg:bg-slate-950">
      <button
        onClick={() => setAberta(true)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-slate-900/10 lg:aspect-auto lg:h-full lg:rounded-none lg:bg-slate-950 lg:shadow-none"
        aria-label="Ampliar foto"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={atual}
          src={fotos[atual]}
          alt={`${titulo} - foto ${atual + 1}`}
          className="h-full w-full animate-[fade-in_0.5s_ease] object-cover transition duration-700 group-hover:scale-105 lg:object-contain lg:group-hover:scale-100"
        />
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur lg:bottom-auto lg:top-4">
          {atual + 1} / {fotos.length}
        </span>
      </button>

      {fotos.length > 1 && (
        <>
          <button
            onClick={() => ir(-1)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white backdrop-blur transition hover:bg-black/60 lg:block"
            aria-label="Foto anterior"
          >
            <IconArrow className="h-5 w-5 rotate-180" />
          </button>
          <button
            onClick={() => ir(1)}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white backdrop-blur transition hover:bg-black/60 lg:block"
            aria-label="Próxima foto"
          >
            <IconArrow className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:justify-center lg:bg-gradient-to-t lg:from-black/70 lg:to-transparent lg:p-4 lg:pt-10">
        {fotos.map((f, i) => (
          <button
            key={f}
            onClick={() => setAtual(i)}
            className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl ring-2 transition lg:h-14 lg:w-20 ${
              i === atual ? "ring-brand-500 lg:ring-white" : "opacity-60 ring-transparent hover:opacity-100"
            }`}
            aria-label={`Ver foto ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {aberta && (
        <div
          className="fixed inset-0 z-50 grid animate-[fade-in_0.25s_ease] place-items-center bg-black/90 p-4"
          onClick={() => setAberta(false)}
        >
          <button className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Fechar">
            <IconClose />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); ir(-1); }}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Foto anterior"
          >
            <IconArrow className="h-5 w-5 rotate-180" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotos[atual]}
            alt={titulo}
            className="max-h-[88vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); ir(1); }}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Próxima foto"
          >
            <IconArrow className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
