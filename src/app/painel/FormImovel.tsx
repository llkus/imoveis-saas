"use client";

import { useActionState } from "react";
import type { ImovelRow } from "@/lib/consultas";
import { atualizarImovel, criarImovel } from "./actions";

const TIPOS = ["Casa", "Apartamento", "Terreno", "Sobrado", "Cobertura", "Sala comercial", "Chácara"];

export default function FormImovel({ imovel }: { imovel?: ImovelRow }) {
  const acao = imovel ? atualizarImovel.bind(null, imovel.id) : criarImovel;
  const [estado, enviar, pendente] = useActionState(acao, null);

  return (
    <form action={enviar} className="card space-y-5 p-6">
      <div>
        <label className="label" htmlFor="titulo">Título</label>
        <input id="titulo" name="titulo" className="input" defaultValue={imovel?.titulo} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" className="input" defaultValue={imovel?.tipo ?? "Casa"}>
            {TIPOS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="finalidade">Finalidade</label>
          <select id="finalidade" name="finalidade" className="input" defaultValue={imovel?.finalidade ?? "venda"}>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="preco">Preço (R$)</label>
          <input id="preco" name="preco" inputMode="decimal" className="input" defaultValue={imovel?.preco ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["quartos", "Quartos", imovel?.quartos],
          ["banheiros", "Banheiros", imovel?.banheiros],
          ["vagas", "Vagas", imovel?.vagas],
          ["area_m2", "Área (m²)", imovel?.area_m2],
        ].map(([nome, rotulo, valor]) => (
          <div key={nome as string}>
            <label className="label" htmlFor={nome as string}>{rotulo}</label>
            <input id={nome as string} name={nome as string} inputMode="decimal" className="input" defaultValue={(valor as number | null | undefined) ?? ""} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_80px]">
        <div>
          <label className="label" htmlFor="bairro">Bairro</label>
          <input id="bairro" name="bairro" className="input" defaultValue={imovel?.bairro ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="cidade">Cidade</label>
          <input id="cidade" name="cidade" className="input" defaultValue={imovel?.cidade ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="uf">UF</label>
          <input id="uf" name="uf" maxLength={2} className="input uppercase" defaultValue={imovel?.uf ?? ""} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" rows={5} className="input" defaultValue={imovel?.descricao ?? ""} />
      </div>

      <div>
        <label className="label" htmlFor="diferenciais">Diferenciais (um por linha ou separados por vírgula)</label>
        <textarea id="diferenciais" name="diferenciais" rows={3} className="input" defaultValue={imovel?.diferenciais?.join("\n") ?? ""} />
      </div>

      {imovel && (
        <div className="sm:w-1/3">
          <label className="label" htmlFor="status">Situação</label>
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
