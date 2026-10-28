"use client";

import { useActionState } from "react";
import { salvarPerfil } from "../actions";

type Perfil = {
  slug: string;
  nome: string;
  creci: string | null;
  whatsapp: string | null;
  bio: string | null;
  cor_primaria: string | null;
};

export default function FormPerfil({ perfil }: { perfil: Perfil | null }) {
  const [estado, enviar, pendente] = useActionState(salvarPerfil, null);

  return (
    <form action={enviar} className="card space-y-5 p-6">
      <p className="text-sm text-ink-500">Seu portfólio fica em <strong>/{perfil?.slug}</strong></p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="nome">Nome</label>
          <input id="nome" name="nome" className="input" defaultValue={perfil?.nome} required />
        </div>
        <div>
          <label className="label" htmlFor="creci">CRECI</label>
          <input id="creci" name="creci" className="input" defaultValue={perfil?.creci ?? ""} placeholder="CRECI 12345-F" />
        </div>
        <div>
          <label className="label" htmlFor="whatsapp">WhatsApp (com DDD)</label>
          <input id="whatsapp" name="whatsapp" className="input" defaultValue={perfil?.whatsapp ?? ""} placeholder="5511999999999" />
        </div>
        <div>
          <label className="label" htmlFor="cor_primaria">Cor do portfólio</label>
          <input id="cor_primaria" name="cor_primaria" type="color" className="input h-11 p-1" defaultValue={perfil?.cor_primaria ?? "#1d4ed8"} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="bio">Sobre você</label>
        <textarea id="bio" name="bio" rows={4} className="input" defaultValue={perfil?.bio ?? ""} />
      </div>
      {estado?.erro && <p className="text-sm font-medium text-red-600">{estado.erro}</p>}
      {estado?.ok && <p className="text-sm font-medium text-green-700">Perfil salvo.</p>}
      <button className="btn btn-primary" disabled={pendente}>{pendente ? "Salvando…" : "Salvar perfil"}</button>
    </form>
  );
}
