import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { formatarPreco, getCorretor, getImoveis, linkWhatsapp } from "@/lib/dados";

export async function generateMetadata({ params }: PageProps<"/[corretor]">): Promise<Metadata> {
  const { corretor } = await params;
  const c = getCorretor(corretor);
  if (!c) return {};
  return { title: `${c.nome} | Imóveis`, description: c.bio };
}

export default function Page({ params }: PageProps<"/[corretor]">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Portfolio params={params} />
    </Suspense>
  );
}

async function Portfolio({ params }: Pick<PageProps<"/[corretor]">, "params">) {
  const { corretor } = await params;
  const c = getCorretor(corretor);
  if (!c) notFound();
  const lista = getImoveis(c.slug);

  return (
    <main className="flex-1" style={{ ["--cor" as string]: c.corPrimaria }}>
      <section className="px-6 py-14 text-white" style={{ background: c.corPrimaria }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-sm opacity-80">{c.creci}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{c.nome}</h1>
          <p className="mt-3 max-w-2xl opacity-90">{c.bio}</p>
          <a
            href={linkWhatsapp(c, "Olá! Vi seu portfólio de imóveis e gostaria de mais informações.")}
            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-medium text-neutral-900"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-xl font-semibold">Imóveis disponíveis ({lista.length})</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {lista.map((i) => (
            <Link
              key={i.slug}
              href={`/${c.slug}/${i.slug}`}
              className="group overflow-hidden rounded-2xl border border-neutral-200 transition hover:shadow-lg"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.fotos[0]} alt={i.titulo} className="h-full w-full object-cover transition group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                  {i.finalidade === "venda" ? "Venda" : "Aluguel"}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xl font-bold" style={{ color: c.corPrimaria }}>{formatarPreco(i)}</p>
                <h3 className="mt-1 font-semibold">{i.titulo}</h3>
                <p className="text-sm text-neutral-500">{i.bairro}, {i.cidade}/{i.uf}</p>
                <p className="mt-3 text-sm text-neutral-700">
                  {i.quartos} quartos · {i.banheiros} banheiros · {i.vagas} vagas · {i.areaM2} m²
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
