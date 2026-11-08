import { redirect } from "next/navigation";
import { Suspense } from "react";
import FundoAuth from "@/components/FundoAuth";
import { exigirUsuario, licencaValida } from "@/lib/auth";
import { sair } from "../painel/actions";

export const metadata = { title: "Licença | Vitrine" };

export default function Page() {
  return (
    <FundoAuth>
      <Suspense fallback={null}>
        <Status />
      </Suspense>
    </FundoAuth>
  );
}

async function Status() {
  const { perfil } = await exigirUsuario();
  if (licencaValida(perfil)) redirect("/painel");
  const expirada = perfil.licenca_ativa && perfil.licenca_expira_em;

  return (
    <div className="card p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-400/20 text-2xl">
        {expirada ? "⏳" : "🔑"}
      </div>
      <h1 className="font-display mt-4 text-3xl font-medium">
        {expirada ? "Sua licença expirou" : "Licença pendente"}
      </h1>
      <p className="mt-3 text-sm text-ink-700">
        {expirada
          ? `Sua licença venceu em ${new Date(perfil.licenca_expira_em + "T00:00").toLocaleDateString("pt-BR")}.`
          : "Sua conta foi criada e está aguardando a ativação da licença."}{" "}
        Entre em contato com o administrador para liberar o acesso ao painel.
      </p>
      <form action={sair} className="mt-6">
        <button className="btn btn-ghost">Sair</button>
      </form>
    </div>
  );
}
