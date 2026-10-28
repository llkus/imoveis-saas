import Link from "next/link";
import { Suspense } from "react";
import Logo from "@/components/Logo";
import { exigirLicenca } from "@/lib/auth";
import { sair } from "./actions";

export const metadata = { title: "Painel | Vitrine" };

export default function Layout({ children }: LayoutProps<"/painel">) {
  return (
    <div className="flex-1 bg-slate-50">
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
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/painel"><Logo /></Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-ink-700">
            <Link href="/painel" className="hover:text-brand-600">Imóveis</Link>
            <Link href="/painel/perfil" className="hover:text-brand-600">Meu perfil</Link>
            {perfil.is_admin && <Link href="/admin" className="text-brand-600">Admin</Link>}
            <form action={sair}><button className="text-ink-500 hover:text-red-600">Sair</button></form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}
