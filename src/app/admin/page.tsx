import Link from "next/link";
import { Suspense } from "react";
import Logo from "@/components/Logo";
import { exigirAdmin, licencaValida, type Perfil } from "@/lib/auth";
import { definirLicenca } from "./actions";

export const metadata = { title: "Administração | Vitrine" };

export default function Page() {
  return (
    <div className="flex-1 bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/painel"><Logo /></Link>
          <Link href="/painel" className="text-sm font-semibold text-ink-700 hover:text-brand-600">← Meu painel</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Licenças dos corretores</h1>
        <Suspense fallback={<p className="mt-6 text-ink-500">Carregando…</p>}>
          <Lista />
        </Suspense>
      </main>
    </div>
  );
}

async function Lista() {
  const { db } = await exigirAdmin();
  const { data } = await db
    .from("profiles")
    .select("id, slug, nome, is_admin, licenca_ativa, licenca_expira_em")
    .order("licenca_ativa")
    .order("nome")
    .returns<Perfil[]>();

  return (
    <ul className="mt-6 grid gap-3">
      {(data ?? []).map((p) => {
        const valida = licencaValida(p);
        return (
          <li key={p.id} className="card flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold">{p.nome}{p.is_admin && <span className="ml-2 text-xs text-brand-600">admin</span>}</p>
              <p className="text-sm text-ink-500">/{p.slug}</p>
              <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${valida ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {valida ? (p.licenca_expira_em ? `Ativa até ${new Date(p.licenca_expira_em + "T00:00").toLocaleDateString("pt-BR")}` : "Ativa") : p.licenca_ativa ? "Expirada" : "Inativa"}
              </span>
            </div>
            <form action={definirLicenca.bind(null, p.id, true)} className="flex items-center gap-2">
              <input type="date" name="expira_em" defaultValue={p.licenca_expira_em ?? ""} className="input w-auto" aria-label="Vencimento (opcional)" />
              <button className="btn btn-primary">{valida ? "Atualizar" : "Ativar"}</button>
            </form>
            {p.licenca_ativa && (
              <form action={definirLicenca.bind(null, p.id, false)}>
                <button className="btn btn-ghost">Revogar</button>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}
