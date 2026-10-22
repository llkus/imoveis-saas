import Link from "next/link";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { IconArrow, IconBath, IconBed, IconCamera, IconCheck, IconGlobe, IconPin, IconShare } from "@/components/Icons";

const beneficios = [
  { Icon: IconCamera, t: "Fotos e descrição completas", d: "Suba várias fotos, escolha a capa e descreva cada detalhe do imóvel em minutos." },
  { Icon: IconGlobe, t: "Seu portfólio, sua marca", d: "Página com seu nome, CRECI, cores e WhatsApp. Use o seu próprio domínio." },
  { Icon: IconShare, t: "Um link para o cliente", d: "Envie o imóvel ou o portfólio inteiro, direto pelo WhatsApp, com pré-visualização bonita." },
];

const passos = [
  { n: "1", t: "Crie sua conta", d: "Monte seu perfil com foto, CRECI e contato." },
  { n: "2", t: "Cadastre os imóveis", d: "Fotos, valores, características e diferenciais." },
  { n: "3", t: "Compartilhe o link", d: "O cliente abre uma landing page profissional." },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-x-clip">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-[#6a3df0] text-white">
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-brand-400/40 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent-400/25 blur-3xl animate-float" />

        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo light />
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link href="/exemplo" className="hidden rounded-xl px-4 py-2 text-white/85 transition hover:bg-white/10 sm:block">Ver exemplo</Link>
            <Link href="/login" className="btn btn-light !py-2.5">Entrar</Link>
          </nav>
        </header>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div className="animate-fade-up">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-accent-400" /> Feito para corretores autônomos
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              Seu portfólio de imóveis,{" "}
              <span className="bg-gradient-to-r from-accent-400 to-[#ffe29a] bg-clip-text text-transparent">pronto para enviar</span>{" "}
              ao cliente
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Cadastre os imóveis, publique as fotos e compartilhe uma landing page profissional com a sua cara, no seu domínio.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-light">Começar agora <IconArrow /></Link>
              <Link href="/exemplo" className="btn glass text-white hover:bg-white/20">Ver um portfólio</Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              {["Sem instalar nada", "Funciona no celular", "Link com seu domínio"].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-accent-400" /> {t}</li>
              ))}
            </ul>
          </div>

          {/* Mock flutuante */}
          <div className="relative mx-auto w-full max-w-sm animate-fade-up [animation-delay:150ms]">
            <div className="animate-float rounded-3xl bg-white p-3 text-slate-900 shadow-2xl shadow-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://picsum.photos/seed/casa1/800/560" alt="Exemplo de imóvel" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <div className="p-3">
                <p className="text-xl font-extrabold text-brand-600">R$ 890.000</p>
                <p className="font-semibold">Casa ampla no Jardim das Flores</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500"><IconPin /> São Paulo/SP</p>
                <div className="mt-3 flex gap-4 text-sm text-ink-700">
                  <span className="flex items-center gap-1"><IconBed /> 3</span>
                  <span className="flex items-center gap-1"><IconBath /> 3</span>
                  <span>220 m²</span>
                </div>
              </div>
            </div>
            <div className="glass absolute -bottom-5 -left-6 rounded-2xl px-4 py-3 text-sm shadow-xl animate-float-slow">
              <p className="font-semibold">Novo contato</p>
              <p className="text-white/80">Cliente chamou no WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Tudo para <span className="text-gradient">vender mais</span></h2>
          <p className="mt-3 text-ink-500">Menos tempo montando apresentação, mais tempo atendendo cliente.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {beneficios.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 120}>
              <div className="card card-hover h-full p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-[#7c4dff] text-white shadow-lg shadow-brand-500/30">
                  <Icon />
                </div>
                <h3 className="mt-5 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Como funciona</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 120}>
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-xl font-extrabold text-brand-600 ring-8 ring-brand-50/60">{p.n}</div>
                  <h3 className="mt-4 font-bold">{p.t}</h3>
                  <p className="mt-1 text-sm text-ink-500">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-[#6a3df0] p-10 text-center text-white shadow-2xl shadow-brand-700/30 sm:p-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-accent-400/30 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Pronto para ter sua vitrine?</h2>
            <p className="relative mx-auto mt-3 max-w-lg text-white/80">Crie seu portfólio e envie o primeiro link ainda hoje.</p>
            <Link href="/login" className="btn btn-light relative mt-8">Criar meu portfólio <IconArrow /></Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-ink-500">
        © 2026 Vitrine. Feito para corretores.
      </footer>
    </main>
  );
}
