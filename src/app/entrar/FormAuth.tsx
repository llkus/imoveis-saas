"use client";

import { useActionState, useState } from "react";
import { cadastrar, entrar } from "./actions";

export default function FormAuth() {
  const [cadastro, setCadastro] = useState(false);
  const [estadoLogin, acaoLogin, pendLogin] = useActionState(entrar, null);
  const [estadoCad, acaoCad, pendCad] = useActionState(cadastrar, null);
  const estado = cadastro ? estadoCad : estadoLogin;

  return (
    <div className="card p-8 shadow-xl shadow-slate-900/5">
      <h1 className="text-2xl font-extrabold tracking-tight">{cadastro ? "Criar sua conta" : "Entrar no painel"}</h1>
      <form action={cadastro ? acaoCad : acaoLogin} className="mt-6 space-y-4">
        {cadastro && (
          <>
            <div>
              <label className="label" htmlFor="nome">Seu nome</label>
              <input id="nome" name="nome" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="slug">Endereço do seu portfólio</label>
              <input id="slug" name="slug" className="input" placeholder="maria-silva" required />
              <p className="mt-1 text-xs text-ink-500">Seu link será /seu-endereco</p>
            </div>
          </>
        )}
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" className="input" minLength={6} required />
        </div>
        {estado?.erro && <p className="text-sm font-medium text-red-600">{estado.erro}</p>}
        {estado?.aviso && <p className="text-sm font-medium text-green-700">{estado.aviso}</p>}
        <button className="btn btn-primary w-full" disabled={pendLogin || pendCad}>
          {cadastro ? "Criar conta" : "Entrar"}
        </button>
      </form>
      <button onClick={() => setCadastro(!cadastro)} className="mt-5 text-sm font-semibold text-brand-600 hover:underline">
        {cadastro ? "Já tenho conta" : "Ainda não tenho conta"}
      </button>
    </div>
  );
}
