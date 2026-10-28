import { Suspense } from "react";
import Logo from "@/components/Logo";
import { exigirUsuario, licencaValida } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sair } from "../painel/actions";

export const metadata = { title: "Licença | Vitrine" };

export default function Page() {
  return (
    <main className="grid flex-1 place-items-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <Suspense fallback={null}>
          <Status />
        </Suspense>
      </div>
    </main>
  );
}

async function Status() {
  const { perfil } = await exigirUsuario();
  if (licencaValida(perfil)) redirect("/painel");
  const expirada = perfil.licenca_ativa && perfil.licenca_expira_em;

  return (
    <div className="card p-8">
      <h1 className="text-xl font-extrabold">{expirada ? "Sua licença expirou" : "Licença pendente"}</h1>
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
