import Link from "next/link";
import { Suspense } from "react";
import TopoPainel from "@/components/TopoPainel";
import { exigirAdmin, licencaValida } from "@/lib/auth";
import { definirLicenca } from "./actions";

export const metadata = { title: "Administração | Vitrine" };

type Corretor = {
  id: string;
  slug: string;
  nome: string;
  email: string | null;
  is_admin: boolean;
  licenca_ativa: boolean;
  licenca_expira_em: string | null;
  total: number;
};

export default function Page({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="fundo-painel flex-1">
      <TopoPainel>
        <Link href="/painel">← Meu painel</Link>
      </TopoPainel>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <p className="sobretitulo">Administração</p>
        <h1 className="font-display mt-2 text-4xl font-medium">Licenças dos corretores</h1>
        <Suspense fallback={<p className="mt-6 text-ink-500">Carregando…</p>}>
          <Lista searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function Lista({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const { db } = await exigirAdmin();
  const bruto = (await searchParams).q;
  const q = (Array.isArray(bruto) ? bruto[0] : (bruto ?? "")).trim().slice(0, 100);

  const { data, error } = await db.rpc("admin_listar_corretores", { busca: q });
  const lista = (data ?? []) as Corretor[];
  const total = lista[0]?.total ?? 0;

  return (
    <>
      <form action="/admin" className="mt-6 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por e-mail, nome ou endereço do corretor"
          aria-label="Buscar corretor"
          maxLength={100}
          autoComplete="off"
          className="input min-w-0 flex-1 basis-64"
        />
        <button className="btn btn-primary">Buscar</button>
        {q && (
          <Link href="/admin" className="btn btn-ghost">
            Limpar
          </Link>
        )}
      </form>

      {error ? (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Não foi possível carregar os corretores. Rode o arquivo <code>supabase/admin_busca.sql</code> no SQL Editor do
          Supabase.
          <span className="mt-1 block text-xs opacity-80">{error.message}</span>
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm text-ink-500">
            {q
              ? `${total} ${total === 1 ? "resultado" : "resultados"} para “${q}”`
              : `${total} ${total === 1 ? "corretor" : "corretores"}`}
            {total > lista.length && ` — mostrando os ${lista.length} primeiros, refine a busca`}
          </p>

          <ul className="mt-3 grid gap-3">
            {lista.map((p) => {
              const valida = licencaValida(p);
              return (
                <li key={p.id} className="card flex flex-wrap items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">
                      {p.nome}
                      {p.is_admin && <span className="ml-2 text-xs text-brand-600">admin</span>}
                    </p>
                    <p className="truncate text-sm text-ink-700">{p.email ?? "sem e-mail"}</p>
                    <p className="text-sm text-ink-500">/{p.slug}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${valida ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {valida
                        ? p.licenca_expira_em
                          ? `Ativa até ${new Date(p.licenca_expira_em + "T00:00").toLocaleDateString("pt-BR")}`
                          : "Ativa"
                        : p.licenca_ativa
                          ? "Expirada"
                          : "Inativa"}
                    </span>
                  </div>
                  <form action={definirLicenca.bind(null, p.id, true)} className="flex items-center gap-2">
                    <input
                      type="date"
                      name="expira_em"
                      defaultValue={p.licenca_expira_em ?? ""}
                      className="input w-auto"
                      aria-label="Vencimento (opcional)"
                    />
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

          {lista.length === 0 && (
            <p className="mt-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-ink-500">
              Nenhum corretor encontrado{q ? " com essa busca" : ""}.
            </p>
          )}
        </>
      )}
    </>
  );
}
