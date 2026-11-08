import Link from "next/link";
import { exigirLicenca } from "@/lib/auth";
import { formatarPreco } from "@/lib/dados";

const status: Record<string, string> = {
  ativo: "bg-brand-50 text-brand-700",
  vendido: "bg-accent-400/20 text-accent-500",
  arquivado: "bg-slate-100 text-slate-600",
};

export default async function Page() {
  const { db, user, perfil } = await exigirLicenca();
  const { data: imoveis } = await db
    .from("imoveis")
    .select("id, titulo, finalidade, preco, status, bairro, cidade, imovel_fotos(url, capa, ordem)")
    .eq("corretor_id", user.id)
    .order("created_at", { ascending: false });

  const lista = imoveis ?? [];
  const resumo = [
    [lista.length, "imóveis"],
    [lista.filter((i) => i.status === "ativo").length, "ativos"],
    [lista.filter((i) => i.status === "vendido").length, "vendidos / alugados"],
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="sobretitulo">Painel</p>
          <h1 className="font-display mt-2 text-4xl font-medium">Meus imóveis</h1>
          <p className="mt-2 text-sm text-ink-500">
            Seu portfólio:{" "}
            <Link href={`/${perfil.slug}`} target="_blank" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
              /{perfil.slug} ↗
            </Link>
          </p>
        </div>
        <Link href="/painel/imoveis/novo" className="btn btn-primary">+ Novo imóvel</Link>
      </div>

      <div className="mt-8 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-surface py-5">
        {resumo.map(([n, l]) => (
          <div key={l} className="px-4 text-center">
            <p className="font-display text-3xl font-medium sm:text-4xl">{n}</p>
            <p className="mt-1 text-xs text-ink-500 sm:text-sm">{l}</p>
          </div>
        ))}
      </div>

      {!lista.length ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="font-display text-2xl font-medium">Nenhum imóvel por aqui ainda</p>
          <p className="mt-2 text-ink-500">Cadastre o primeiro e ele aparece no seu portfólio na hora.</p>
          <Link href="/painel/imoveis/novo" className="btn btn-primary mt-6">Cadastrar imóvel</Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3">
          {lista.map((i) => {
            const fotos = [...(i.imovel_fotos ?? [])].sort(
              (a, b) => Number(b.capa) - Number(a.capa) || (a.ordem ?? 0) - (b.ordem ?? 0),
            );
            const preco = formatarPreco({
              preco: Number(i.preco ?? 0),
              finalidade: i.finalidade === "aluguel" ? "aluguel" : "venda",
            });
            return (
              <li key={i.id}>
                <Link href={`/painel/imoveis/${i.id}`} className="card card-hover flex items-center gap-4 p-3">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {fotos[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={fotos[0].url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{i.titulo}</p>
                    <p className="truncate text-sm text-ink-500">{[i.bairro, i.cidade].filter(Boolean).join(", ")}</p>
                    <p className="font-display mt-0.5 text-lg font-medium text-brand-700">{preco}</p>
                  </div>
                  <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold capitalize sm:block ${status[i.status] ?? status.ativo}`}>
                    {i.status}
                  </span>
                  <span className="text-ink-500">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
