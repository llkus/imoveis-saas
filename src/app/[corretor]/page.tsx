import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import { IconWhatsapp } from "@/components/Icons";
import ListaImoveis from "@/components/ListaImoveis";
import { getCorretor, getImoveis, linkWhatsapp } from "@/lib/dados";

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
  const msg = "Olá! Vi seu portfólio de imóveis e gostaria de mais informações.";
  const iniciais = c.nome.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <main className="flex-1">
      <section
        className="relative isolate overflow-hidden px-6 pb-20 pt-12 text-white"
        style={{ background: `linear-gradient(135deg, ${c.corPrimaria}, color-mix(in srgb, ${c.corPrimaria} 45%, #0b1020))` }}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-white/15 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-24 left-10 -z-10 h-72 w-72 rounded-full bg-accent-400/25 blur-3xl animate-float" />

        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 animate-fade-up place-items-center rounded-3xl bg-white/15 text-3xl font-extrabold ring-4 ring-white/30 backdrop-blur">
            {iniciais}
          </div>
          <div className="animate-fade-up [animation-delay:100ms]">
            <p className="text-sm font-medium text-white/75">{c.creci}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{c.nome}</h1>
            <p className="mt-3 max-w-2xl text-white/85">{c.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={linkWhatsapp(c, msg)} className="btn btn-light"><IconWhatsapp className="h-5 w-5 text-[#14a850]" /> Falar no WhatsApp</a>
              <a href="#imoveis" className="btn glass text-white hover:bg-white/20">Ver imóveis</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <div className="grid max-w-md grid-cols-3 gap-3">
            {[
              [lista.length, "Imóveis"],
              [lista.filter((i) => i.finalidade === "venda").length, "À venda"],
              [lista.filter((i) => i.finalidade === "aluguel").length, "Para alugar"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl px-4 py-3 text-center">
                <p className="text-2xl font-extrabold">{n}</p>
                <p className="text-xs text-white/75">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="imoveis" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-14">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Imóveis disponíveis</h2>
        <ListaImoveis corretorSlug={c.slug} cor={c.corPrimaria} imoveis={lista} />
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-ink-500">
        Portfólio de {c.nome} · feito com{" "}
        <Link href="/" className="font-semibold text-brand-600 hover:underline">Vitrine</Link>
      </footer>

      <BotaoWhatsapp href={linkWhatsapp(c, msg)} />
    </main>
  );
}
