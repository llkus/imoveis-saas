import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { formatarPreco, getCorretor, getImovel, linkWhatsapp } from "@/lib/dados";

export async function generateMetadata({ params }: PageProps<"/[corretor]/[imovel]">): Promise<Metadata> {
  const { corretor, imovel } = await params;
  const i = getImovel(corretor, imovel);
  if (!i) return {};
  return {
    title: i.titulo,
    description: i.descricao,
    openGraph: { title: i.titulo, description: i.descricao, images: [i.fotos[0]] },
  };
}

export default function Page({ params }: PageProps<"/[corretor]/[imovel]">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <PaginaImovel params={params} />
    </Suspense>
  );
}

async function PaginaImovel({ params }: Pick<PageProps<"/[corretor]/[imovel]">, "params">) {
  const { corretor, imovel } = await params;
  const c = getCorretor(corretor);
  const i = getImovel(corretor, imovel);
  if (!c || !i) notFound();

  const msg = `Olá! Tenho interesse no imóvel "${i.titulo}". Ainda está disponível?`;
  const specs = [
    ["Quartos", i.quartos],
    ["Banheiros", i.banheiros],
    ["Vagas", i.vagas],
    ["Área", `${i.areaM2} m²`],
  ];

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <Link href={`/${c.slug}`} className="text-sm text-neutral-500 hover:underline">← Todos os imóveis de {c.nome}</Link>

        <div className="mt-4 grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          {i.fotos.slice(0, 5).map((f, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f}
              src={f}
              alt={`${i.titulo} - foto ${idx + 1}`}
              className={`h-full w-full rounded-xl object-cover ${idx === 0 ? "aspect-[3/2] sm:col-span-2 sm:row-span-2" : "aspect-[3/2]"}`}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm text-neutral-500">{i.tipo} · {i.finalidade === "venda" ? "Venda" : "Aluguel"}</p>
            <h1 className="mt-1 text-3xl font-bold">{i.titulo}</h1>
            <p className="mt-1 text-neutral-500">{i.bairro}, {i.cidade}/{i.uf}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-neutral-200 p-4 text-center">
                  <p className="text-lg font-semibold">{v}</p>
                  <p className="text-xs text-neutral-500">{k}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-lg font-semibold">Descrição</h2>
            <p className="mt-2 whitespace-pre-line text-neutral-700">{i.descricao}</p>

            <h2 className="mt-8 text-lg font-semibold">Diferenciais</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {i.diferenciais.map((d) => (
                <li key={d} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">{d}</li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-2xl border border-neutral-200 p-6 lg:sticky lg:top-6">
            <p className="text-3xl font-bold" style={{ color: c.corPrimaria }}>{formatarPreco(i)}</p>
            <p className="mt-4 font-semibold">{c.nome}</p>
            <p className="text-sm text-neutral-500">{c.creci}</p>
            <a
              href={linkWhatsapp(c, msg)}
              className="mt-5 block rounded-lg px-5 py-3 text-center font-medium text-white"
              style={{ background: c.corPrimaria }}
            >
              Chamar no WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
