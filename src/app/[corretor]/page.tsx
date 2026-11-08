import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Avatar from "@/components/Avatar";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import { IconWhatsapp } from "@/components/Icons";
import ProtegerImagens from "@/components/ProtegerImagens";
import ListaImoveis from "@/components/ListaImoveis";
import { getCorretor, getImoveis } from "@/lib/consultas";
import { linkWhatsapp, temFinalidade } from "@/lib/dados";

export async function generateMetadata({ params }: PageProps<"/[corretor]">): Promise<Metadata> {
  const { corretor } = await params;
  const c = await getCorretor(corretor);
  if (!c) return {};
  const imagem = c.capaUrl ?? c.fotoUrl;
  return {
    title: `${c.nome} | Imóveis`,
    description: c.bio,
    openGraph: { title: `${c.nome} | Imóveis`, description: c.bio, images: imagem ? [imagem] : undefined },
  };
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
  const c = await getCorretor(corretor);
  if (!c) notFound();
  const lista = await getImoveis(c.slug);
  const msg = "Olá! Vi seu portfólio de imóveis e gostaria de mais informações.";
  const cor = c.corPrimaria;

  const numeros = [
    [lista.length, "publicações"],
    [lista.filter((i) => temFinalidade(i, "venda")).length, "à venda"],
    [lista.filter((i) => temFinalidade(i, "aluguel")).length, "para alugar"],
  ];
  const creci = c.creci ? (/^\d/.test(c.creci) ? `CRECI ${c.creci}` : c.creci) : "";

  return (
    <main className="flex-1">
      {/* Capa */}
      <div
        className="relative h-56 overflow-hidden sm:h-80"
        style={{ background: `linear-gradient(135deg, ${cor}, color-mix(in srgb, ${cor} 45%, #0b1020))` }}
      >
        {c.capaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.capaUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      </div>

      {/* Perfil: sem cartão, direto sobre o papel */}
      <section className="relative mx-auto -mt-16 max-w-5xl px-5 sm:-mt-20 sm:px-6">
        <div className="animate-fade-up">
          <div className="w-fit rounded-full ring-4 ring-background">
            <Avatar nome={c.nome} fotoUrl={c.fotoUrl} cor={cor} className="h-28 w-28 text-4xl shadow-lg sm:h-36 sm:w-36" />
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              {creci && <p className="sobretitulo">{creci}</p>}
              <h1 className="font-display mt-1 text-4xl font-medium leading-tight sm:text-5xl">{c.nome}</h1>
              {c.bio && <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-ink-700">{c.bio}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={linkWhatsapp(c, msg)} className="btn btn-whatsapp"><IconWhatsapp /> Falar no WhatsApp</a>
                <a href="#imoveis" className="btn btn-ghost">Ver imóveis</a>
              </div>
            </div>

            <dl className="flex divide-x divide-slate-300 self-start lg:self-end">
              {numeros.map(([n, l]) => (
                <div key={l} className="px-5 first:pl-0 last:pr-0 lg:text-right">
                  <dd className="font-display text-4xl font-medium leading-none" style={{ color: cor }}>{n}</dd>
                  <dt className="mt-1.5 text-xs text-ink-500">{l}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Publicações */}
      <div id="imoveis" className="mt-12 scroll-mt-4">
        <ListaImoveis corretor={c} imoveis={lista} />
      </div>

      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-ink-500">
        Portfólio de {c.nome} · feito com{" "}
        <Link href="/" className="font-display text-base font-medium text-foreground hover:underline">Vitrine</Link>
      </footer>

      <ProtegerImagens />
      <BotaoWhatsapp href={linkWhatsapp(c, msg)} />
    </main>
  );
}
