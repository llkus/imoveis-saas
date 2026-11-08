"use client";

import { useActionState, useState } from "react";
import { IconArrow } from "@/components/Icons";
import { cadastrar, entrar } from "./actions";

export default function FormAuth() {
  const [cadastro, setCadastro] = useState(false);
  const [estadoLogin, acaoLogin, pendLogin] = useActionState(entrar, null);
  const [estadoCad, acaoCad, pendCad] = useActionState(cadastrar, null);
  const estado = cadastro ? estadoCad : estadoLogin;
  const pendente = pendLogin || pendCad;

  return (
    <div>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1 text-sm font-semibold" role="tablist">
        {[
          [false, "Entrar"],
          [true, "Criar conta"],
        ].map(([valor, nome]) => (
          <button
            key={nome as string}
            type="button"
            role="tab"
            aria-selected={cadastro === valor}
            onClick={() => setCadastro(valor as boolean)}
            className={`rounded-full py-2 transition ${cadastro === valor ? "bg-surface text-foreground shadow-sm" : "text-ink-500 hover:text-ink-700"}`}
          >
            {nome}
          </button>
        ))}
      </div>

      <h1 className="font-display mt-8 text-4xl font-medium">{cadastro ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
      <p className="mt-2 text-ink-500">
        {cadastro ? "Comece a montar o seu portfólio de imóveis." : "Entre para gerenciar seus imóveis."}
      </p>

      <form action={cadastro ? acaoCad : acaoLogin} className="mt-6 space-y-4">
        {cadastro && (
          <>
            <div>
              <label className="label" htmlFor="nome">
                Seu nome
              </label>
              <input id="nome" name="nome" className="input" autoComplete="name" required />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                Endereço do seu portfólio
              </label>
              <input id="slug" name="slug" className="input" placeholder="maria-silva" required />
              <p className="mt-1 text-xs text-ink-500">Seu link será /seu-endereco</p>
            </div>
          </>
        )}
        <div>
          <label className="label" htmlFor="email">
            E-mail
          </label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" required />
        </div>
        <div>
          <label className="label" htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            className="input"
            minLength={6}
            autoComplete={cadastro ? "new-password" : "current-password"}
            required
          />
        </div>
        {estado?.erro && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{estado.erro}</p>
        )}
        {estado?.aviso && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">{estado.aviso}</p>
        )}
        <button className="btn btn-primary w-full" disabled={pendente}>
          {pendente ? "Aguarde…" : cadastro ? "Criar conta" : "Entrar"} {!pendente && <IconArrow />}
        </button>
      </form>
    </div>
  );
}
