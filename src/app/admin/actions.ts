"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth";

// Ativa (com vencimento opcional) ou revoga a licença de um corretor.
// A permissão é garantida pelo RLS: só is_admin consegue alterar esses campos.
export async function definirLicenca(id: string, ativar: boolean, form: FormData) {
  const { db } = await exigirAdmin();
  const expira = String(form.get("expira_em") ?? "");
  const { data } = await db
    .from("profiles")
    .update({ licenca_ativa: ativar, licenca_expira_em: ativar && expira ? expira : null })
    .eq("id", id)
    .select("slug")
    .single();
  revalidatePath("/admin");
  if (data) revalidatePath(`/${data.slug}`, "layout");
}
