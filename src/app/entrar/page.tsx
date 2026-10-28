import Link from "next/link";
import Logo from "@/components/Logo";
import { supabaseConfigurado } from "@/lib/supabase/config";
import FormAuth from "./FormAuth";

export const metadata = { title: "Entrar | Vitrine" };

export default function Page() {
  return (
    <main className="grid flex-1 place-items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center"><Logo /></Link>
        {supabaseConfigurado ? (
          <FormAuth />
        ) : (
          <div className="card p-8 text-sm text-ink-700">
            O Supabase ainda não está configurado. Preencha <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no arquivo <code>.env.local</code> e reinicie o servidor.
          </div>
        )}
      </div>
    </main>
  );
}
