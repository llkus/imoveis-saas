import Link from "next/link";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { IconArrow, IconBath, IconBed, IconCamera, IconCheck, IconGlobe, IconPin, IconShare } from "@/components/Icons";

const beneficios = [
  {
    Icon: IconCamera,
    t: "Fotos que vendem",
    d: "Suba várias fotos, escolha a capa, arraste para reordenar. Elas são otimizadas sozinhas.",
  },
  {
    Icon: IconGlobe,
    t: "Sua marca, seu endereço",
    d: "Página com seu nome, CRECI, foto, capa e cor. Mais tarde, no seu próprio domínio.",
  },
  {
    Icon: IconShare,
    t: "Um link, zero fricção",
    d: "Mande o imóvel ou o portfólio inteiro pelo WhatsApp, com pré-visualização bonita.",
  },
];

const passos = [
  { n: "01", t: "Monte seu perfil", d: "Foto, capa, CRECI, WhatsApp e a cor que combina com você." },
  { n: "02", t: "Cadastre os imóveis", d: "Fotos, valores, características e diferenciais, em poucos minutos." },
  { n: "03", t: "Envie ao cliente", d: "Ele abre uma página profissional e chama você direto no WhatsApp." },
];

const fotos = [
  ["casa2", "Cobertura Vista Mar", "R$ 2.150.000"],
  ["casa3", "Casa de campo", "R$ 1.280.000"],
  ["casa5", "Apartamento Jardins", "R$ 960.000"],
];

export default function Home() {
  return (
    <main className="flex-1 overflow-x-clip">
      {/* HERO */}
      <section className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Logo />
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link href="/exemplo" className="hidden px-4 py-2 text-ink-700 transition hover:text-foreground sm:block">
              Ver exemplo
            </Link>
            <Link href="/entrar" className="btn btn-primary !px-5 !py-2.5">
              Entrar
            </Link>
          </nav>
        </header>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-14">
          <div className="animate-fade-up">
            <p className="sobretitulo">Para corretores autônomos</p>
            <h1 className="font-display mt-5 text-[2.6rem] font-medium leading-[1.04] sm:text-6xl lg:text-[4.4rem]">
              Cada imóvel merece <em className="text-brand-500 not-italic">uma boa vitrine</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-700">
              Cadastre seus imóveis, publique as fotos e envie ao cliente uma página elegante, com a sua marca e o seu
              WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/entrar" className="btn btn-primary">
                Criar meu portfólio <IconArrow />
              </Link>
              <Link href="/exemplo" className="btn btn-ghost">
                Ver um portfólio
              </Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700">
              {["Funciona no celular", "Sem instalar nada", "Link com seu domínio"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <IconCheck className="h-4 w-4 text-accent-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Fotografia em arco, com cartão de imóvel sobreposto */}
          <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:150ms]">
            <div className="absolute -right-6 -top-6 h-full w-full rounded-t-[999px] border border-accent-400/60" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/casa1/800/1000"
              alt="Imóvel de exemplo"
              className="relative aspect-[4/5] w-full rounded-t-[999px] object-cover shadow-2xl shadow-black/20"
            />
            <div className="absolute -bottom-6 -left-4 w-64 animate-float-slow rounded-2xl bg-surface p-4 shadow-2xl shadow-black/20 ring-1 ring-black/5 sm:-left-12">
              <p className="font-display text-2xl font-medium text-brand-700">R$ 890.000</p>
              <p className="mt-0.5 text-sm font-semibold">Casa ampla no Jardim das Flores</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                <IconPin className="h-3 w-3" /> São Paulo/SP
              </p>
              <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-xs text-ink-700">
                <span className="flex items-center gap-1">
                  <IconBed className="h-4 w-4" /> 3
                </span>
                <span className="flex items-center gap-1">
                  <IconBath className="h-4 w-4" /> 3
                </span>
                <span>220 m²</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-2xl">
          <p className="sobretitulo">Por que Vitrine</p>
          <h2 className="font-display mt-4 text-4xl font-medium leading-tight sm:text-5xl">
            Menos tempo montando apresentação. Mais tempo atendendo.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {beneficios.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 120} className="bg-background">
              <div className="h-full p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icon />
                </span>
                <h3 className="font-display mt-6 text-2xl font-medium">{t}</h3>
                <p className="mt-2 leading-relaxed text-ink-500">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AMOSTRA DO PORTFÓLIO */}
      <section className="fundo-pontos bg-marca py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="sobretitulo !text-accent-400">O que o cliente vê</p>
              <h2 className="font-display mt-4 text-4xl font-medium leading-tight sm:text-5xl">
                Um portfólio que passa confiança logo na primeira olhada
              </h2>
            </div>
            <Link href="/exemplo" className="btn btn-light">
              Abrir portfólio de exemplo <IconArrow />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {fotos.map(([seed, titulo, preco], i) => (
              <Reveal key={seed} delay={i * 120}>
                <div className="group">
                  <div className="overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${seed}/700/520`}
                      alt={titulo}
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-display mt-4 text-2xl font-medium text-accent-400">{preco}</p>
                  <p className="text-white/80">{titulo}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="sobretitulo">Como funciona</p>
          <h2 className="font-display mt-4 text-4xl font-medium sm:text-5xl">Três passos até o primeiro link</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {passos.map((p, i) => (
            <Reveal key={p.n} delay={i * 120}>
              <div className="border-t border-slate-300 pt-6">
                <span className="font-display text-5xl font-medium text-accent-500">{p.n}</span>
                <h3 className="mt-4 text-lg font-bold">{p.t}</h3>
                <p className="mt-1 text-ink-500">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <Reveal>
          <div className="fundo-pontos relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-marca p-10 text-center text-white sm:p-16">
            <h2 className="font-display text-4xl font-medium leading-tight sm:text-5xl">
              Pronto para ter a sua vitrine?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/75">
              Crie seu portfólio e envie o primeiro link ainda hoje.
            </p>
            <Link href="/entrar" className="btn btn-light mt-8">
              Criar meu portfólio <IconArrow />
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-ink-500">
        © 2026 Vitrine · Feito para corretores.
      </footer>
    </main>
  );
}
