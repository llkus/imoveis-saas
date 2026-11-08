import Link from "next/link";
import { Suspense } from "react";
import TopoPainel from "@/components/TopoPainel";
import { exigirLicenca } from "@/lib/auth";
import { sair } from "./actions";

export const metadata = { title: "Painel | Vitrine" };

export default function Layout({ children }: LayoutProps<"/painel">) {
  return (
    <div className="fundo-painel flex-1">
      <Suspense fallback={<p className="p-8 text-ink-500">Carregando…</p>}>
        <Casca>{children}</Casca>
      </Suspense>
    </div>
  );
}

// Sem licença válida o corretor é levado para /licenca antes de ver qualquer tela.
async function Casca({ children }: { children: React.ReactNode }) {
  const { perfil } = await exigirLicenca();
  return (
    <>
      <TopoPainel>
        <Link href="/painel" >Imóveis</Link>
        <Link href="/painel/perfil" >Meu perfil</Link>
        {perfil.is_admin && <Link href="/admin" className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">Admin</Link>}
        <form action={sair}><button>Sair</button></form>
      </TopoPainel>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}
