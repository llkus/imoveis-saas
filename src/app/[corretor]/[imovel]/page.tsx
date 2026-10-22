import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import Galeria from "@/components/Galeria";
import { IconBath, IconBed, IconCar, IconCheck, IconPin, IconRuler, IconWhatsapp } from "@/components/Icons";
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

  const link = linkWhatsapp(c, `Olá! Tenho interesse no imóvel "${i.titulo}". Ainda está disponível?`);
  const specs = [
    { Icon: IconBed, v: i.quartos, k: "Quartos" },
    { Icon: IconBath, v: i.banheiros, k: "Banheiros" },
    { Icon: IconCar, v: i.vagas, k: "Vagas" },
    { Icon: IconRuler, v: `${i.areaM2} m²`, k: "Área" },
  ];
  const iniciais = c.nome.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <main className="flex-1 pb-24">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <Link href={`/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-brand-600">
          ← Imóveis de {c.nome}
        </Link>

        <div className="mt-5 animate-fade-up">
          <Galeria fotos={i.fotos} titulo={i.titulo} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
              <span className="rounded-full px-3 py-1 text-white" style={{ background: c.corPrimaria }}>
                {i.finalidade === "venda" ? "Venda" : "Aluguel"}
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">{i.tipo}</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{i.titulo}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink-500"><IconPin /> {i.bairro}, {i.cidade}/{i.uf}</p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(({ Icon, v, k }) => (
                <div key={k} className="card flex flex-col items-center gap-1 p-4 text-center">
                  <span style={{ color: c.corPrimaria }}><Icon className="h-6 w-6" /></span>
                  <p className="text-lg font-extrabold">{v}</p>
                  <p className="text-xs text-ink-500">{k}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-xl font-extrabold">Sobre o imóvel</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-700">{i.descricao}</p>

            <h2 className="mt-10 text-xl font-extrabold">Diferenciais</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {i.diferenciais.map((d) => (
                <li key={d} className="card flex items-center gap-3 px-4 py-3 text-sm font-medium">
                  <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: c.corPrimaria }}>
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit animate-fade-up [animation-delay:220ms] lg:sticky lg:top-6">
            <div className="card p-7 shadow-xl shadow-slate-900/5">
              <p className="text-sm text-ink-500">{i.finalidade === "venda" ? "Valor de venda" : "Valor do aluguel"}</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight" style={{ color: c.corPrimaria }}>{formatarPreco(i)}</p>
              <div className="my-6 border-t border-slate-100" />
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl text-sm font-extrabold text-white" style={{ background: c.corPrimaria }}>{iniciais}</div>
                <div>
                  <p className="font-bold leading-tight">{c.nome}</p>
                  <p className="text-xs text-ink-500">{c.creci}</p>
                </div>
              </div>
              <a href={link} className="btn btn-whatsapp mt-6 w-full"><IconWhatsapp /> Chamar no WhatsApp</a>
              <p className="mt-3 text-center text-xs text-ink-500">Resposta rápida, sem compromisso.</p>
            </div>
          </aside>
        </div>
      </div>

      <BotaoWhatsapp href={link} />
    </main>
  );
}
