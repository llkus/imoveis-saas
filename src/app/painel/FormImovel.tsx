"use client";

import { useActionState, useState } from "react";
import {
  CARACTERISTICAS_CONDOMINIO,
  CARACTERISTICAS_IMOVEL,
  CATEGORIAS,
  GRUPOS_CONDOMINIO,
  TIPOS_IMOVEL,
  separarItens,
} from "@/lib/caracteristicas";
import type { ImovelRow } from "@/lib/consultas";
import { atualizarImovel, criarImovel } from "./actions";
import CampoLocalizacao from "./CampoLocalizacao";

function Secao({
  titulo,
  dica,
  aberta,
  children,
}: {
  titulo: string;
  dica?: string;
  aberta?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={aberta} className="group rounded-2xl border border-slate-200 bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="font-display text-xl font-medium">{titulo}</span>
          {dica && <span className="ml-2 text-xs text-ink-500">{dica}</span>}
        </span>
        <span className="text-ink-500 transition group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="space-y-5 border-t border-slate-100 px-5 py-5">{children}</div>
    </details>
  );
}

function Caixas({ nome, itens, marcados }: { nome: string; itens: string[]; marcados: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-2 min-[480px]:grid-cols-2 lg:grid-cols-3">
      {itens.map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            name={nome}
            value={item}
            defaultChecked={marcados.includes(item)}
            className="h-4 w-4 accent-[var(--marca)]"
          />
          {item}
        </label>
      ))}
    </div>
  );
}

function Numero({ nome, rotulo, valor, dica }: { nome: string; rotulo: string; valor?: number | null; dica?: string }) {
  return (
    <div>
      <label className="label" htmlFor={nome}>
        {rotulo}
      </label>
      <input
        id={nome}
        name={nome}
        inputMode="decimal"
        className="input"
        defaultValue={valor ?? ""}
        placeholder={dica}
      />
    </div>
  );
}

export default function FormImovel({ imovel }: { imovel?: ImovelRow }) {
  const acao = imovel ? atualizarImovel.bind(null, imovel.id) : criarImovel;
  const [estado, enviar, pendente] = useActionState(acao, null);
  const [finalidade, setFinalidade] = useState(imovel?.finalidade ?? "venda");
  const [condIsento, setCondIsento] = useState(imovel?.condominio_isento ?? false);
  const [iptuIsento, setIptuIsento] = useState(imovel?.iptu_isento ?? false);

  const tipos = imovel?.tipo && !TIPOS_IMOVEL.includes(imovel.tipo) ? [...TIPOS_IMOVEL, imovel.tipo] : TIPOS_IMOVEL;
  const carac = separarItens(imovel?.diferenciais, CARACTERISTICAS_IMOVEL);
  const condo = separarItens(imovel?.caracteristicas_condominio, CARACTERISTICAS_CONDOMINIO);

  return (
    <form action={enviar} className="card space-y-4 p-5 sm:p-6">
      <Secao titulo="Sobre o imóvel" aberta>
        <div>
          <label className="label" htmlFor="titulo">
            Título do anúncio
          </label>
          <input id="titulo" name="titulo" className="input" defaultValue={imovel?.titulo} maxLength={120} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="uso">
              O imóvel é
            </label>
            <select id="uso" name="uso" className="input" defaultValue={imovel?.uso ?? "residencial"}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="tipo">
              Tipo do imóvel
            </label>
            <select id="tipo" name="tipo" className="input" defaultValue={imovel?.tipo ?? "Casa"}>
              {tipos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="categoria">
              Categoria
            </label>
            <select id="categoria" name="categoria" className="input" defaultValue={imovel?.categoria ?? "Padrão"}>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Numero nome="quartos" rotulo="Quartos" valor={imovel?.quartos} />
          <Numero nome="suites" rotulo="Suítes" valor={imovel?.suites} />
          <Numero nome="banheiros" rotulo="Banheiros" valor={imovel?.banheiros} />
          <Numero nome="vagas" rotulo="Vagas" valor={imovel?.vagas} />
          <Numero nome="andar" rotulo="Andar" valor={imovel?.andar} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Numero nome="area_m2" rotulo="Área útil (m²)" valor={imovel?.area_m2} />
          <Numero nome="area_total_m2" rotulo="Área total (m²) — opcional" valor={imovel?.area_total_m2} />
        </div>

        <div>
          <label className="label" htmlFor="descricao">
            Descrição do anúncio
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={5}
            maxLength={5000}
            className="input"
            defaultValue={imovel?.descricao ?? ""}
          />
        </div>
      </Secao>

      <Secao titulo="Valores" aberta>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="finalidade">
              Tipo de negociação
            </label>
            <select
              id="finalidade"
              name="finalidade"
              className="input"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
            >
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="ambos">Venda e aluguel</option>
            </select>
          </div>
          <Numero
            nome="preco"
            rotulo={finalidade === "aluguel" ? "Valor do aluguel (R$/mês)" : "Valor da venda (R$)"}
            valor={imovel?.preco}
            dica="0"
          />
          {finalidade === "ambos" && (
            <Numero nome="preco_aluguel" rotulo="Valor do aluguel (R$/mês)" valor={imovel?.preco_aluguel} dica="0" />
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="valor_condominio">
              Condomínio / mês (R$)
            </label>
            <input
              id="valor_condominio"
              name="valor_condominio"
              inputMode="decimal"
              className="input disabled:opacity-50"
              disabled={condIsento}
              defaultValue={imovel?.valor_condominio ?? ""}
              placeholder="0"
            />
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="condominio_isento"
                checked={condIsento}
                onChange={(e) => setCondIsento(e.target.checked)}
                className="h-4 w-4 accent-[var(--marca)]"
              />
              Isento
            </label>
          </div>
          <div>
            <label className="label" htmlFor="valor_iptu">
              IPTU (R$)
            </label>
            <div className="flex gap-2">
              <input
                id="valor_iptu"
                name="valor_iptu"
                inputMode="decimal"
                className="input disabled:opacity-50"
                disabled={iptuIsento}
                defaultValue={imovel?.valor_iptu ?? ""}
                placeholder="0"
              />
              <select
                name="iptu_periodo"
                aria-label="Período do IPTU"
                className="input w-auto disabled:opacity-50"
                disabled={iptuIsento}
                defaultValue={imovel?.iptu_periodo ?? "anual"}
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="iptu_isento"
                checked={iptuIsento}
                onChange={(e) => setIptuIsento(e.target.checked)}
                className="h-4 w-4 accent-[var(--marca)]"
              />
              Isento
            </label>
          </div>
        </div>
      </Secao>

      <Secao titulo="Localização" aberta>
        <CampoLocalizacao inicial={imovel} />
      </Secao>

      <Secao titulo="Características do imóvel" dica="opcional">
        <Caixas nome="diferencial" itens={CARACTERISTICAS_IMOVEL} marcados={carac.marcados} />
        <div>
          <label className="label" htmlFor="diferenciais_extra">
            Outras características (uma por linha ou separadas por vírgula)
          </label>
          <textarea
            id="diferenciais_extra"
            name="diferenciais_extra"
            rows={2}
            className="input"
            defaultValue={carac.extras.join("\n")}
          />
        </div>
      </Secao>

      <Secao titulo="Condomínio" dica="opcional">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Numero nome="condominio_andares" rotulo="Nº de andares" valor={imovel?.condominio_andares} />
          <Numero
            nome="condominio_unidades_andar"
            rotulo="Unidades por andar"
            valor={imovel?.condominio_unidades_andar}
          />
          <Numero nome="condominio_torres" rotulo="Nº de torres" valor={imovel?.condominio_torres} />
          <Numero nome="ano_construcao" rotulo="Ano de construção" valor={imovel?.ano_construcao} dica="0000" />
        </div>
        {GRUPOS_CONDOMINIO.map((g) => (
          <div key={g.nome}>
            <p className="sobretitulo mb-2">{g.nome}</p>
            <Caixas nome="cond_carac" itens={g.itens} marcados={condo.marcados} />
          </div>
        ))}
        <div>
          <label className="label" htmlFor="cond_extra">
            Outras características do condomínio (uma por linha ou separadas por vírgula)
          </label>
          <textarea
            id="cond_extra"
            name="cond_extra"
            rows={2}
            className="input"
            defaultValue={condo.extras.join("\n")}
          />
        </div>
      </Secao>

      <Secao titulo="Vídeo e tour virtual" dica="opcional">
        <div>
          <label className="label" htmlFor="video_url">
            Link do vídeo (YouTube ou Instagram)
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            className="input"
            defaultValue={imovel?.video_url ?? ""}
            placeholder="https://www.instagram.com/reel/… ou https://youtu.be/…"
          />
          <p className="mt-1 text-xs text-ink-500">
            O vídeo precisa estar público. Posts de contas privadas do Instagram não abrem para os clientes.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="tour_url">
            Link do tour virtual
          </label>
          <input
            id="tour_url"
            name="tour_url"
            type="url"
            className="input"
            defaultValue={imovel?.tour_url ?? ""}
            placeholder="https://"
          />
        </div>
      </Secao>

      {imovel && (
        <div className="sm:w-1/3">
          <label className="label" htmlFor="status">
            Situação
          </label>
          <select id="status" name="status" className="input" defaultValue={imovel.status ?? "ativo"}>
            <option value="ativo">Ativo</option>
            <option value="vendido">Vendido / alugado</option>
            <option value="arquivado">Arquivado (oculto)</option>
          </select>
        </div>
      )}

      {estado?.erro && <p className="text-sm font-medium text-red-600">{estado.erro}</p>}
      {estado?.ok && <p className="text-sm font-medium text-green-700">Alterações salvas.</p>}
      <button className="btn btn-primary" disabled={pendente}>
        {pendente ? "Salvando…" : imovel ? "Salvar alterações" : "Cadastrar e adicionar fotos"}
      </button>
    </form>
  );
}
