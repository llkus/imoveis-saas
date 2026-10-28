import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirLicenca } from "@/lib/auth";
import type { ImovelRow } from "@/lib/consultas";
import { excluirImovel } from "../../actions";
import FormImovel from "../../FormImovel";
import FotosEditor from "../../FotosEditor";

export default async function Page({ params }: PageProps<"/painel/imoveis/[id]">) {
  const { id } = await params;
  const { db, user, perfil } = await exigirLicenca();
  const [{ data: imovel }, { data: fotos }] = await Promise.all([
    db.from("imoveis").select("*").eq("id", id).eq("corretor_id", user.id).maybeSingle(),
    db.from("imovel_fotos").select("id, url, ordem, capa").eq("imovel_id", id),
  ]);
  if (!imovel) notFound();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/painel" className="text-sm font-medium text-ink-500 hover:text-brand-600">← Voltar</Link>
        <Link href={`/${perfil.slug}/${imovel.slug}`} target="_blank" className="text-sm font-semibold text-brand-600 hover:underline">
          Ver página pública ↗
        </Link>
      </div>
      <h1 className="mb-6 mt-3 text-2xl font-extrabold tracking-tight">{imovel.titulo}</h1>

      <div className="space-y-6">
        <FotosEditor imovelId={id} userId={user.id} fotos={fotos ?? []} />
        <FormImovel imovel={imovel as ImovelRow} />
        <form action={excluirImovel.bind(null, id)}>
          <button className="text-sm font-semibold text-red-600 hover:underline">Excluir este imóvel</button>
        </form>
      </div>
    </>
  );
}
