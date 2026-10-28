"use client";

import Link from "next/link";
import { useState } from "react";
import type { Imovel } from "@/lib/dados";
import { formatarPreco } from "@/lib/dados";
import { IconBath, IconBed, IconCar, IconPin, IconRuler } from "./Icons";

const filtros = [
  { id: "todos", nome: "Todos" },
  { id: "venda", nome: "Venda" },
  { id: "aluguel", nome: "Aluguel" },
] as const;

export default function ListaImoveis({
  corretorSlug,
  cor,
  imoveis,
}: {
  corretorSlug: string;
  cor: string;
  imoveis: Imovel[];
}) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");
  const lista = imoveis.filter((i) => filtro === "todos" || i.finalidade === filtro);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {filtros.map((f) => {
          const ativo = filtro === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className="rounded-full border px-5 py-2 text-sm font-semibold transition active:scale-95"
              style={
                ativo
                  ? { background: cor, borderColor: cor, color: "#fff", boxShadow: `0 8px 20px -8px ${cor}` }
                  : { background: "#fff", borderColor: "#e2e8f0", color: "#334155" }
              }
            >
              {f.nome}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-ink-500">{lista.length} imóvel(is)</span>
      </div>

      <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((i, idx) => (
          <Link
            key={i.slug}
            href={`/${corretorSlug}/${i.slug}`}
            className="card card-hover group block animate-fade-up overflow-hidden"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {i.fotos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.fotos[0]} alt={i.titulo} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800 backdrop-blur">
                {i.finalidade === "venda" ? "Venda" : "Aluguel"}
              </span>
              <p className="absolute bottom-3 left-4 text-2xl font-extrabold text-white drop-shadow">{formatarPreco(i)}</p>
            </div>
            <div className="p-5">
              <h3 className="font-bold leading-snug transition group-hover:underline">{i.titulo}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-500"><IconPin /> {i.bairro}, {i.cidade}/{i.uf}</p>
              <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-ink-700">
                <span className="flex items-center gap-1.5" title="Quartos"><IconBed /> {i.quartos}</span>
                <span className="flex items-center gap-1.5" title="Banheiros"><IconBath /> {i.banheiros}</span>
                <span className="flex items-center gap-1.5" title="Vagas"><IconCar /> {i.vagas}</span>
                <span className="ml-auto flex items-center gap-1.5" title="Área"><IconRuler /> {i.areaM2} m²</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {lista.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-ink-500">
          Nenhum imóvel nessa categoria no momento.
        </p>
      )}
    </>
  );
}
