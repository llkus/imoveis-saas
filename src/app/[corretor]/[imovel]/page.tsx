import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Avatar from "@/components/Avatar";
import BarraContato from "@/components/BarraContato";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import DescricaoCurta from "@/components/DescricaoCurta";
import ProtegerImagens from "@/components/ProtegerImagens";
import Galeria from "@/components/Galeria";
import SecaoDetalhes from "@/components/SecaoDetalhes";
import SecaoLocalizacao from "@/components/SecaoLocalizacao";
import SecaoMidia from "@/components/SecaoMidia";
import { IconBath, IconBed, IconCar, IconCheck, IconPin, IconRuler, IconWhatsapp } from "@/components/Icons";
import { getCorretor, getImovel } from "@/lib/consultas";
import { formatarAluguel, formatarPreco, linkWhatsapp, rotuloFinalidade } from "@/lib/dados";

export async function generateMetadata({ params }: PageProps<"/[corretor]/[imovel]">): Promise<Metadata> {
  const { corretor, imovel } = await params;
  const i = await getImovel(corretor, imovel);
  if (!i) return {};
  return {
    title: i.titulo,
    description: i.descricao,
    openGraph: { title: i.titulo, description: i.descricao, images: i.fotos.slice(0, 1) },
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
  const [c, i] = await Promise.all([getCorretor(corretor), getImovel(corretor, imovel)]);
  if (!c || !i) notFound();

  const link = linkWhatsapp(c, `Olá! Tenho interesse no imóvel "${i.titulo}". Ainda está disponível?`);
  const rotuloPreco = i.finalidade === "aluguel" ? "Valor do aluguel" : "Valor de venda";
  const aluguelExtra = i.finalidade === "ambos" ? formatarAluguel(i) : null;
  const specs = [
    { Icon: IconBed, v: i.quartos, k: "Quartos" },
    { Icon: IconBath, v: i.banheiros, k: "Banheiros" },
    { Icon: IconCar, v: i.vagas, k: "Vagas" },
    { Icon: IconRuler, v: `${i.areaM2} m²`, k: "Área" },
  ];

  const painel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <Avatar nome={c.nome} fotoUrl={c.fotoUrl} cor={c.corPrimaria} className="h-10 w-10 text-sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight">{c.nome}</p>
          <p className="text-xs text-ink-500">{c.creci}</p>
        </div>
        <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white" style={{ background: c.corPrimaria }}>
          {rotuloFinalidade(i.finalidade)}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 px-6 py-5">
        <div>
          <p className="sobretitulo">{i.tipo}</p>
          <h2 className="font-display mt-1 text-3xl font-medium leading-tight">{i.titulo}</h2>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500"><IconPin /> {i.bairro}, {i.cidade}/{i.uf}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs text-ink-500">{rotuloPreco}</p>
          <p className="font-display text-4xl font-medium" style={{ color: c.corPrimaria }}>{formatarPreco(i)}</p>
          {aluguelExtra && <p className="mt-1 text-sm text-ink-700">ou alugue por <strong>{aluguelExtra}</strong></p>}
        </div>

        <div className="grid grid-cols-4 divide-x divide-slate-200 rounded-2xl border border-slate-200 py-3">
          {specs.map(({ Icon, v, k }) => (
            <div key={k} className="flex flex-col items-center gap-0.5 px-1 text-center">
              <span style={{ color: c.corPrimaria }}><Icon className="h-5 w-5" /></span>
              <p className="font-display text-xl font-medium leading-tight">{v}</p>
              <p className="text-[10px] text-ink-500">{k}</p>
            </div>
          ))}
        </div>

        <DescricaoCurta texto={i.descricao} cor={c.corPrimaria} />

        {i.diferenciais.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {i.diferenciais.slice(0, 6).map((d) => (
              <li key={d} className="flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-1.5 pr-3 text-xs font-medium">
                <span className="grid h-4 w-4 place-items-center rounded-full text-white" style={{ background: c.corPrimaria }}>
                  <IconCheck className="h-2.5 w-2.5" />
                </span>
                {d}
              </li>
            ))}
            {i.diferenciais.length > 6 && (
              <li className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-ink-500">+{i.diferenciais.length - 6}</li>
            )}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-100 px-6 py-4">
        <a href={link} className="btn btn-whatsapp w-full"><IconWhatsapp /> Chamar no WhatsApp</a>
        <p className="mt-2 text-center text-[11px] text-ink-500">Resposta rápida, sem compromisso.</p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 pb-28 lg:pb-24">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <Link href={`/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-foreground">
          ← Imóveis de {c.nome}
        </Link>

        {/* Computador: um cartão só, foto à esquerda e detalhes à direita. */}
        <div className="mt-5 animate-fade-up lg:grid lg:h-[clamp(580px,calc(100vh-10rem),760px)] lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden lg:rounded-3xl lg:border lg:border-slate-200 lg:bg-surface lg:shadow-2xl lg:shadow-black/10">
          <Galeria fotos={i.fotos} titulo={i.titulo} />
          <aside className="hidden min-h-0 overflow-y-auto border-l border-slate-100 lg:block">{painel}</aside>
        </div>

        <div className="mt-10 grid gap-10 lg:hidden">
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
              <span className="rounded-full px-3 py-1 text-white" style={{ background: c.corPrimaria }}>
                {rotuloFinalidade(i.finalidade)}
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">{i.tipo}</span>
            </div>
            <h1 className="font-display mt-3 text-4xl font-medium leading-tight sm:text-5xl">{i.titulo}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink-500"><IconPin /> {i.bairro}, {i.cidade}/{i.uf}</p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(({ Icon, v, k }) => (
                <div key={k} className="card flex flex-col items-center gap-1 p-4 text-center">
                  <span style={{ color: c.corPrimaria }}><Icon className="h-6 w-6" /></span>
                  <p className="font-display text-2xl font-medium">{v}</p>
                  <p className="text-xs text-ink-500">{k}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display mt-10 text-3xl font-medium">Sobre o imóvel</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-700">{i.descricao}</p>
          </div>

          <aside className="h-fit animate-fade-up [animation-delay:220ms] lg:sticky lg:top-6">
            <div className="card p-7">
              <p className="text-sm text-ink-500">{rotuloPreco}</p>
              <p className="font-display mt-1 text-5xl font-medium" style={{ color: c.corPrimaria }}>{formatarPreco(i)}</p>
              {aluguelExtra && <p className="mt-1 text-sm text-ink-700">ou alugue por <strong>{aluguelExtra}</strong></p>}
              <div className="my-6 border-t border-slate-100" />
              <div className="flex items-center gap-3">
                <Avatar nome={c.nome} fotoUrl={c.fotoUrl} cor={c.corPrimaria} className="h-12 w-12 text-sm" />
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

        <SecaoDetalhes imovel={i} cor={c.corPrimaria} />
        <SecaoMidia videoUrl={i.videoUrl} tourUrl={i.tourUrl} cor={c.corPrimaria} />
        <SecaoLocalizacao
          endereco={i.endereco}
          numero={i.numero}
          mostrar={i.mostrarEndereco}
          bairro={i.bairro}
          cidade={i.cidade}
          uf={i.uf}
          latitude={i.latitude}
          longitude={i.longitude}
          cor={c.corPrimaria}
        />
      </div>

      <ProtegerImagens />
      <div className="hidden lg:block"><BotaoWhatsapp href={link} /></div>
      <BarraContato
        href={link}
        preco={formatarPreco(i)}
        rotulo={rotuloPreco}
        cor={c.corPrimaria}
      />
    </main>
  );
}
