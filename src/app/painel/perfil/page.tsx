import { exigirLicenca } from "@/lib/auth";
import FormPerfil from "./FormPerfil";

export const metadata = { title: "Meu perfil | Vitrine" };

export default async function Page() {
  const { db, user } = await exigirLicenca();
  const { data: perfil } = await db.from("profiles").select("*").eq("id", user.id).single();

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">Meu perfil</h1>
      <FormPerfil perfil={perfil} />
    </>
  );
}
