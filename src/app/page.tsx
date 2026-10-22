import Link from "next/link";

const beneficios = [
  { t: "Fotos e descrição completas", d: "Suba várias fotos, escolha a capa e descreva cada detalhe do imóvel." },
  { t: "Seu portfólio, sua marca", d: "Página com seu nome, CRECI, cores e WhatsApp. Pode usar o seu próprio domínio." },
  { t: "Um link para o cliente", d: "Envie o link do imóvel ou do portfólio completo, direto pelo WhatsApp." },
];

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold">Imóveis SaaS</span>
        <nav className="flex gap-3 text-sm">
          <Link href="/exemplo" className="rounded-lg px-4 py-2 hover:bg-black/5">Ver exemplo</Link>
          <Link href="/login" className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800">Entrar</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Seu portfólio de imóveis, pronto para enviar ao cliente
        </h1>
        <p className="mt-5 text-lg text-neutral-600">
          Feito para corretores autônomos: cadastre os imóveis, publique as fotos e compartilhe uma landing page profissional.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800">Começar agora</Link>
          <Link href="/exemplo" className="rounded-lg border border-neutral-300 px-6 py-3 font-medium hover:bg-black/5">Ver um portfólio</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {beneficios.map((b) => (
          <div key={b.t} className="rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-semibold">{b.t}</h3>
            <p className="mt-2 text-sm text-neutral-600">{b.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
