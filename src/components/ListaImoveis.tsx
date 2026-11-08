"use client";

import Link from "next/link";
import { useState } from "react";
import type { Corretor, Imovel } from "@/lib/dados";
import { formatarPreco, linkWhatsapp, rotuloFinalidade, temFinalidade } from "@/lib/dados";
import Avatar from "./Avatar";
import { IconBath, IconBed, IconCar, IconFeed, IconGrid, IconImages, IconPin, IconRuler, IconWhatsapp } from "./Icons";

const filtros = [
  { id: "todos", nome: "Todos" },
  { id: "venda", nome: "Venda" },
  { id: "aluguel", nome: "Aluguel" },
] as const;

const visoes = [
  { id: "grade", nome: "Grade", Icone: IconGrid },
  { id: "feed", nome: "Feed", Icone: IconFeed },
] as const;

export default function ListaImoveis({ corretor, imoveis }: { corretor: Corretor; imoveis: Imovel[] }) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");
  const [visao, setVisao] = useState<(typeof visoes)[number]["id"]>("grade");
  const cor = corretor.corPrimaria;
  const lista = imoveis.filter((i) => filtro === "todos" || temFinalidade(i, filtro));

  return (
    <>
      <div className="sticky top-0 z-20 border-y border-slate-200 bg-background/90 px-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-1 sm:gap-3">
          {filtros.map((f) => {
            const ativo = filtro === f.id;
            const total = imoveis.filter((i) => f.id === "todos" || temFinalidade(i, f.id)).length;
            return (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-3.5 text-sm font-semibold transition ${
                  ativo ? "" : "border-transparent text-ink-500 hover:text-foreground"
                }`}
                style={ativo ? { borderColor: cor, color: cor } : undefined}
              >
                {f.nome}
                <span className="text-xs opacity-60">{total}</span>
              </button>
            );
          })}
          <div
            className="ml-auto flex gap-1 rounded-full border border-slate-200 bg-surface p-1 text-ink-500"
            role="tablist"
            aria-label="Modo de exibição"
          >
            {visoes.map(({ id, nome, Icone }) => (
              <button
                key={id}
                role="tab"
                aria-selected={visao === id}
                aria-label={nome}
                onClick={() => setVisao(id)}
                className="rounded-full p-1.5 transition hover:bg-slate-100"
                style={
                  visao === id ? { color: cor, background: `color-mix(in srgb, ${cor} 14%, transparent)` } : undefined
                }
              >
                <Icone />
              </button>
            ))}
          </div>
        </div>
      </div>

      {visao === "grade" ? (
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-x-6 gap-y-10 px-5 min-[480px]:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {lista.map((i) => (
            <Link key={i.slug} href={`/${corretor.slug}/${i.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200">
                {i.fotos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={i.fotos[0]}
                    alt={i.titulo}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                  style={{ background: i.status === "vendido" ? "rgb(0 0 0 / 0.7)" : cor }}
                >
                  {i.status === "vendido" ? "Vendido" : rotuloFinalidade(i.finalidade)}
                </span>
                {i.fotos.length > 1 && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    <IconImages className="h-3.5 w-3.5" /> {i.fotos.length}
                  </span>
                )}
              </div>
              <div className="pt-4">
                <p className="font-display text-2xl font-medium" style={{ color: cor }}>
                  {formatarPreco(i)}
                </p>
                <h3 className="mt-0.5 truncate font-semibold">{i.titulo}</h3>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-ink-500">
                  <IconPin className="h-3 w-3 shrink-0" /> {i.bairro}, {i.cidade}/{i.uf}
                </p>
                <div className="mt-3 flex items-center gap-4 border-t border-slate-200 pt-3 text-sm text-ink-700">
                  <span className="flex items-center gap-1.5">
                    <IconBed className="h-4 w-4" /> {i.quartos}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconBath className="h-4 w-4" /> {i.banheiros}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconCar className="h-4 w-4" /> {i.vagas}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <IconRuler className="h-4 w-4" /> {i.areaM2} m²
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-6 grid max-w-xl gap-6 px-4 sm:px-6">
          {lista.map((i) => (
            <Publicacao key={i.slug} imovel={i} corretor={corretor} />
          ))}
        </div>
      )}

      {lista.length === 0 && (
        <p className="font-display mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xl text-ink-500">
          Nenhum imóvel nessa categoria no momento.
        </p>
      )}
    </>
  );
}

function Publicacao({ imovel: i, corretor }: { imovel: Imovel; corretor: Corretor }) {
  const href = `/${corretor.slug}/${i.slug}`;
  const msg = `Olá! Tenho interesse no imóvel "${i.titulo}". Ainda está disponível?`;

  return (
    <article className="card overflow-hidden">
      <header className="flex items-center gap-3 px-4 py-3">
        <Avatar
          nome={corretor.nome}
          fotoUrl={corretor.fotoUrl}
          cor={corretor.corPrimaria}
          className="h-9 w-9 text-xs"
        />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-bold">{corretor.nome}</p>
          <p className="flex items-center gap-1 truncate text-xs text-ink-500">
            <IconPin className="h-3 w-3" /> {i.bairro}, {i.cidade}/{i.uf}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
          {i.status === "vendido" ? "Vendido" : rotuloFinalidade(i.finalidade)}
        </span>
      </header>

      <Carrossel fotos={i.fotos} titulo={i.titulo} href={href} />

      <div className="flex items-center gap-3 px-4 pt-3">
        <a href={linkWhatsapp(corretor, msg)} className="btn btn-whatsapp !px-4 !py-2 text-sm">
          <IconWhatsapp className="h-4 w-4" /> Tenho interesse
        </a>
        <Link href={href} className="btn btn-ghost !px-4 !py-2 text-sm">
          Ver detalhes
        </Link>
      </div>

      <div className="px-4 pb-4 pt-3">
        <p className="font-display text-2xl font-medium" style={{ color: corretor.corPrimaria }}>
          {formatarPreco(i)}
        </p>
        <Link href={href} className="font-bold leading-snug hover:underline">
          {i.titulo}
        </Link>
        <div className="mt-2 flex items-center gap-4 text-sm text-ink-700">
          <span className="flex items-center gap-1.5">
            <IconBed /> {i.quartos}
          </span>
          <span className="flex items-center gap-1.5">
            <IconBath /> {i.banheiros}
          </span>
          <span className="flex items-center gap-1.5">
            <IconCar /> {i.vagas}
          </span>
          <span className="flex items-center gap-1.5">
            <IconRuler /> {i.areaM2} m²
          </span>
        </div>
        {i.descricao && <p className="mt-2 line-clamp-2 text-sm text-ink-700">{i.descricao}</p>}
      </div>
    </article>
  );
}

// Fotos lado a lado com rolagem por arraste (scroll-snap) e indicador de posição.
function Carrossel({ fotos, titulo, href }: { fotos: string[]; titulo: string; href: string }) {
  const [atual, setAtual] = useState(0);
  if (fotos.length === 0) return <div className="aspect-square bg-slate-100" />;

  return (
    <div className="relative">
      <div
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => setAtual(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {fotos.map((f, idx) => (
          <Link
            key={f}
            href={href}
            className="aspect-square w-full shrink-0 snap-center bg-slate-100"
            tabIndex={idx === 0 ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f}
              alt={`${titulo} - foto ${idx + 1}`}
              loading={idx === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
          </Link>
        ))}
      </div>
      {fotos.length > 1 && (
        <>
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
            {atual + 1}/{fotos.length}
          </span>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {fotos.map((f, idx) => (
              <span
                key={f}
                className={`h-1.5 rounded-full bg-white transition-all ${idx === atual ? "w-4" : "w-1.5 opacity-60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
