import { exigirLicenca } from "@/lib/auth";
import FormPerfil from "./FormPerfil";
import ImagensPerfil from "./ImagensPerfil";

export const metadata = { title: "Meu perfil | Vitrine" };

export default async function Page() {
  const { db, user } = await exigirLicenca();
  const { data: perfil } = await db.from("profiles").select("*").eq("id", user.id).single();

  return (
    <>
      <h1 className="font-display mb-8 text-4xl font-medium">Meu perfil</h1>
      <div className="space-y-6">
        <ImagensPerfil
          userId={user.id}
          nome={perfil?.nome ?? ""}
          cor={perfil?.cor_primaria ?? "#1d4ed8"}
          fotoUrl={perfil?.foto_url ?? undefined}
          capaUrl={perfil?.capa_url ?? undefined}
        />
        <FormPerfil perfil={perfil} />
      </div>
    </>
  );
}
