"use client";

import { useState } from "react";
import { IconMap, IconPin } from "@/components/Icons";
import { urlGoogleMaps, urlMapaEmbed } from "@/lib/dados";

type Props = {
  endereco?: string;
  numero?: string;
  mostrar?: "completo" | "rua" | "bairro";
  bairro: string;
  cidade: string;
  uf: string;
  latitude?: number;
  longitude?: number;
  cor: string;
};

// Seção "Localização" da página pública: cartão com o endereço e botão que abre o mapa.
export default function SecaoLocalizacao({
  endereco,
  numero,
  mostrar = "completo",
  bairro,
  cidade,
  uf,
  latitude,
  longitude,
  cor,
}: Props) {
  const [aberto, setAberto] = useState(false);

  // O corretor escolhe quanto do endereço fica público: nos modos parciais não usamos o ponto exato.
  const rua = mostrar === "bairro" ? "" : endereco;
  const cidadeUf = [cidade, uf].filter(Boolean).join(", ");
  const titulo = (mostrar === "completo" ? [endereco, numero].filter(Boolean).join(", ") : rua) || bairro || cidadeUf;
  const detalhe = [rua ? bairro : "", rua || bairro ? cidadeUf : ""].filter(Boolean).join(" · ");
  const exato = mostrar === "completo";
  const local = {
    latitude: exato ? latitude : undefined,
    longitude: exato ? longitude : undefined,
    consulta: [exato ? [endereco, numero].filter(Boolean).join(" ") : rua, bairro, cidade, uf, "Brasil"]
      .filter(Boolean)
      .join(", "),
  };

  if (!titulo) return null;

  return (
    <section className="mt-10 animate-fade-up">
      <h2 className="font-display text-3xl font-medium">Localização</h2>

      <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-surface px-4 py-4 sm:px-5">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white"
            style={{ background: cor }}
          >
            <IconPin className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold leading-tight">{titulo}</p>
            {detalhe && <p className="mt-0.5 text-sm font-medium text-ink-500">{detalhe}</p>}
          </div>
          <button type="button" className="btn btn-ghost" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
            <IconMap /> {aberto ? "Ocultar mapa" : "Exibir no mapa"}
          </button>
        </div>

        {aberto && (
          <div className="mt-3">
            <iframe
              src={urlMapaEmbed(local)}
              title={`Mapa: ${titulo}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full rounded-2xl border border-slate-200 bg-surface sm:h-96"
            />
            <a
              href={urlGoogleMaps(local)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold hover:underline"
              style={{ color: cor }}
            >
              Abrir no Google Maps ↗
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
