import Link from "next/link";
import Logo from "./Logo";

// Tela dividida das páginas de login e licença: fotografia de um lado, formulário do outro.
export default function FundoAuth({ children, lateral }: { children: React.ReactNode; lateral?: React.ReactNode }) {
  return (
    <main className="flex flex-1">
      <aside className="relative hidden w-[46%] max-w-2xl shrink-0 overflow-hidden bg-marca text-white lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://picsum.photos/seed/vitrine-arq/1000/1400" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f261b] via-[#0f261b]/55 to-[#0f261b]/25" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link href="/"><Logo light /></Link>
          {lateral}
        </div>
      </aside>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md animate-fade-up">
          <Link href="/" className="mb-8 flex justify-center lg:hidden"><Logo /></Link>
          {children}
        </div>
      </div>
    </main>
  );
}
