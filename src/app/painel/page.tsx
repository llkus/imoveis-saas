import Link from "next/link";
import { exigirLicenca } from "@/lib/auth";
import { formatarPreco } from "@/lib/dados";

export default async function Page() {
  const { db, user, perfil } = await exigirLicenca();
  const { data: imoveis } = await db
    .from("imoveis")
    .select("id, titulo, finalidade, preco, status, bairro, cidade, imovel_fotos(url, capa, ordem)")
    .eq("corretor_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Meus imóveis</h1>
          <p className="mt-1 text-sm text-ink-500">
            Seu portfólio:{" "}
            <Link href={`/${perfil.slug}`} target="_blank" className="font-semibold text-brand-600 hover:underline">
              /{perfil.slug}
            </Link>
          </p>
        </div>
        <Link href="/painel/imoveis/novo" className="btn btn-primary">+ Novo imóvel</Link>
      </div>

      {!imoveis?.length ? (
        <div className="card mt-8 p-10 text-center text-ink-500">Você ainda não cadastrou nenhum imóvel.</div>
      ) : (
        <ul className="mt-8 grid gap-4">
          {imoveis.map((i) => {
            const fotos = [...(i.imovel_fotos ?? [])].sort(
              (a, b) => Number(b.capa) - Number(a.capa) || (a.ordem ?? 0) - (b.ordem ?? 0),
            );
            const preco = formatarPreco({
              preco: Number(i.preco ?? 0),
              finalidade: i.finalidade === "aluguel" ? "aluguel" : "venda",
            });
            return (
              <li key={i.id} className="card flex items-center gap-4 p-3">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {fotos[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotos[0].url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{i.titulo}</p>
                  <p className="text-sm text-ink-500">
                    {[i.bairro, i.cidade].filter(Boolean).join(", ")} · {preco}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-600">
                    {i.status}
                  </span>
                </div>
                <Link href={`/painel/imoveis/${i.id}`} className="btn btn-ghost">Editar</Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
