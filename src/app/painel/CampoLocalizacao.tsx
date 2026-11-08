"use client";

import { useState } from "react";
import { IconCheck, IconPin } from "@/components/Icons";
import { urlGoogleMaps, urlMapaEmbed } from "@/lib/dados";

type Inicial = {
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  mostrar_endereco?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type Resultado = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
};

// Converte um resultado do Nominatim (OpenStreetMap) nos campos do formulário.
function extrair(r: Resultado) {
  const a = r.address ?? {};
  return {
    endereco: a.road ?? a.pedestrian ?? a.footway ?? a.path ?? "",
    numero: a.house_number ?? "",
    cep: (a.postcode ?? "").replace(/\D/g, ""),
    bairro: a.suburb ?? a.neighbourhood ?? a.quarter ?? a.city_district ?? "",
    cidade: a.city ?? a.town ?? a.village ?? a.municipality ?? "",
    uf: (a["ISO3166-2-lvl4"] ?? "").replace(/^BR-/, ""),
    latitude: Number(Number(r.lat).toFixed(6)),
    longitude: Number(Number(r.lon).toFixed(6)),
  };
}

const mascaraCep = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

const OPCOES_MOSTRAR = [
  ["completo", "Endereço completo"],
  ["rua", "Somente a rua"],
  ["bairro", "Somente o bairro"],
] as const;

export default function CampoLocalizacao({ inicial }: { inicial?: Inicial }) {
  const [cep, setCep] = useState(mascaraCep(inicial?.cep ?? ""));
  const [endereco, setEndereco] = useState(inicial?.endereco ?? "");
  const [numero, setNumero] = useState(inicial?.numero ?? "");
  const [complemento, setComplemento] = useState(inicial?.complemento ?? "");
  const [bairro, setBairro] = useState(inicial?.bairro ?? "");
  const [cidade, setCidade] = useState(inicial?.cidade ?? "");
  const [uf, setUf] = useState(inicial?.uf ?? "");
  const [mostrar, setMostrar] = useState(inicial?.mostrar_endereco ?? "completo");
  const [coord, setCoord] = useState<{ latitude: number; longitude: number } | null>(
    inicial?.latitude != null && inicial?.longitude != null ? { latitude: inicial.latitude, longitude: inicial.longitude } : null,
  );

  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Resultado[] | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroCep, setErroCep] = useState<string | null>(null);

  async function buscarCep(valor: string) {
    const digitos = valor.replace(/\D/g, "");
    if (digitos.length !== 8) return;
    setBuscandoCep(true);
    setErroCep(null);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const d = (await resp.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string };
      if (!resp.ok || d.erro) {
        setErroCep("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }
      setEndereco(d.logradouro || endereco);
      setBairro(d.bairro || bairro);
      setCidade(d.localidade || cidade);
      setUf(d.uf || uf);
      setCoord(null); // o ponto antigo não vale mais para o novo endereço
    } catch {
      setErroCep("Não foi possível consultar o CEP agora. Preencha o endereço manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  // usarCampos = true: busca pelos campos preenchidos; false: pelo texto da caixa de busca.
  async function buscar(usarCampos: boolean) {
    const doCampos = [endereco, numero, bairro, cidade, uf].filter(Boolean).join(", ");
    const q = (usarCampos ? doCampos : busca || doCampos).trim();
    if (q.length < 4) {
      setErro("Digite o endereço (rua, número, cidade) para buscar.");
      return;
    }
    setBuscando(true);
    setErro(null);
    setResultados(null);
    try {
      const params = new URLSearchParams({
        q,
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        countrycodes: "br",
        "accept-language": "pt-BR",
      });
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      if (!resp.ok) throw new Error();
      const dados = (await resp.json()) as Resultado[];
      if (dados.length === 0) setErro("Endereço não encontrado. Tente incluir a cidade ou tire o número.");
      setResultados(dados);
    } catch {
      setErro("Não foi possível consultar o mapa agora. Tente novamente em instantes.");
    } finally {
      setBuscando(false);
    }
  }

  function escolher(r: Resultado) {
    const x = extrair(r);
    setEndereco(x.endereco || endereco);
    setNumero(x.numero || numero);
    if (x.cep) setCep(mascaraCep(x.cep));
    setBairro(x.bairro || bairro);
    setCidade(x.cidade || cidade);
    setUf(x.uf || uf);
    setCoord({ latitude: x.latitude, longitude: x.longitude });
    setResultados(null);
    setErro(null);
  }

  const consulta = [endereco, numero, bairro, cidade, uf, "Brasil"].filter(Boolean).join(", ");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div>
          <label className="label" htmlFor="cep">CEP</label>
          <input
            id="cep"
            name="cep"
            inputMode="numeric"
            className="input"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => {
              const v = mascaraCep(e.target.value);
              setCep(v);
              if (v.length === 9) buscarCep(v);
            }}
          />
          {buscandoCep && <p className="mt-1 text-xs text-ink-500">Buscando CEP…</p>}
          {erroCep && <p className="mt-1 text-xs font-medium text-red-600">{erroCep}</p>}
        </div>
        <div>
          <label className="label" htmlFor="busca-endereco">Buscar endereço no mapa</label>
          <div className="flex gap-2">
            <input
              id="busca-endereco"
              className="input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscar(false);
                }
              }}
              placeholder="Ex.: Rua das Flores 120, Petrópolis RJ"
              autoComplete="off"
            />
            <button type="button" className="btn btn-primary shrink-0" onClick={() => buscar(false)} disabled={buscando}>
              {buscando ? "Buscando…" : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}
      {resultados && resultados.length > 0 && (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
          {resultados.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                onClick={() => escolher(r)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-slate-50"
              >
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
                <span>{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 sm:grid-cols-[1fr_120px_1fr]">
        <div>
          <label className="label" htmlFor="endereco">Endereço (rua)</label>
          <input id="endereco" name="endereco" className="input" value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength={200} />
        </div>
        <div>
          <label className="label" htmlFor="numero">Número</label>
          <input id="numero" name="numero" className="input" value={numero} onChange={(e) => setNumero(e.target.value)} maxLength={20} />
        </div>
        <div>
          <label className="label" htmlFor="complemento">Complemento</label>
          <input id="complemento" name="complemento" className="input" placeholder="Ex.: Ap 101" value={complemento} onChange={(e) => setComplemento(e.target.value)} maxLength={100} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_80px]">
        <div>
          <label className="label" htmlFor="bairro">Bairro</label>
          <input id="bairro" name="bairro" className="input" value={bairro} onChange={(e) => setBairro(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="cidade">Cidade</label>
          <input id="cidade" name="cidade" className="input" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="uf">UF</label>
          <input id="uf" name="uf" maxLength={2} className="input uppercase" value={uf} onChange={(e) => setUf(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-56">
          <label className="label" htmlFor="mostrar_endereco">O que mostrar na página pública</label>
          <select id="mostrar_endereco" name="mostrar_endereco" className="input" value={mostrar} onChange={(e) => setMostrar(e.target.value)}>
            {OPCOES_MOSTRAR.map(([v, nome]) => <option key={v} value={v}>{nome}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => buscar(true)} disabled={buscando}>
          <IconPin /> Marcar no mapa com estes dados
        </button>
      </div>

      <input type="hidden" name="latitude" value={coord?.latitude ?? ""} />
      <input type="hidden" name="longitude" value={coord?.longitude ?? ""} />

      {coord ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <IconCheck className="h-4 w-4" /> Localização verificada no mapa
            </p>
            <div className="flex gap-3 text-sm font-semibold">
              <a href={urlGoogleMaps({ ...coord, consulta })} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                Conferir no Google Maps ↗
              </a>
              <button type="button" className="text-red-600 hover:underline" onClick={() => setCoord(null)}>
                Remover
              </button>
            </div>
          </div>
          <iframe
            src={urlMapaEmbed({ ...coord, consulta })}
            title="Prévia da localização"
            loading="lazy"
            className="h-64 w-full rounded-xl border border-slate-200"
          />
          <p className="text-xs text-ink-500">
            Se o ponto estiver fora do lugar, ajuste o endereço, marque de novo e escolha outro resultado.
          </p>
        </div>
      ) : (
        <p className="text-xs text-ink-500">
          Sem localização verificada, a página do imóvel mostra o mapa apenas pelo texto do endereço. O complemento nunca aparece na página pública.
        </p>
      )}
    </div>
  );
}
