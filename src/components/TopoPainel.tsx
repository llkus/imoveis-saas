import Link from "next/link";
import Logo from "./Logo";

// Cabeçalho do painel e do admin; os links entram como children.
export default function TopoPainel({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/painel">
          <Logo />
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-ink-700 [&_a]:transition [&_a:hover]:text-foreground [&_button]:transition [&_button:hover]:text-foreground">
          {children}
        </nav>
      </div>
    </header>
  );
}
