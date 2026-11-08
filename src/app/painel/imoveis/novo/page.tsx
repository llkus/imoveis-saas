import Link from "next/link";
import FormImovel from "../../FormImovel";

export const metadata = { title: "Novo imóvel | Vitrine" };

export default function Page() {
  return (
    <>
      <Link href="/painel" className="text-sm font-medium text-ink-500 hover:text-foreground">
        ← Voltar
      </Link>
      <h1 className="font-display mb-8 mt-3 text-4xl font-medium">Novo imóvel</h1>
      <FormImovel />
    </>
  );
}
