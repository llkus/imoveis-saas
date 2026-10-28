import Link from "next/link";
import FormImovel from "../../FormImovel";

export const metadata = { title: "Novo imóvel | Vitrine" };

export default function Page() {
  return (
    <>
      <Link href="/painel" className="text-sm font-medium text-ink-500 hover:text-brand-600">← Voltar</Link>
      <h1 className="mb-6 mt-3 text-2xl font-extrabold tracking-tight">Novo imóvel</h1>
      <FormImovel />
    </>
  );
}
