import FundoAuth from "@/components/FundoAuth";
import { IconCheck } from "@/components/Icons";
import { supabaseConfigurado } from "@/lib/supabase/config";
import FormAuth from "./FormAuth";

export const metadata = { title: "Entrar | Vitrine" };

const vantagens = ["Fotos e descrição completas", "Portfólio com a sua marca", "Um link para enviar ao cliente"];

export default function Page() {
  return (
    <FundoAuth lateral={<Vitrine />}>
      {supabaseConfigurado ? (
        <FormAuth />
      ) : (
        <div className="card p-8 text-sm text-ink-700">
          O Supabase ainda não está configurado. Preencha <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no arquivo <code>.env.local</code> e reinicie o servidor.
        </div>
      )}
    </FundoAuth>
  );
}

function Vitrine() {
  return (
    <div className="animate-fade-up">
      <p className="sobretitulo !text-accent-400">Portfólio de imóveis</p>
      <h2 className="font-display mt-4 text-5xl font-medium leading-[1.05]">Seus imóveis com cara de vitrine</h2>
      <ul className="mt-8 space-y-3 text-white/90">
        {vantagens.map((t) => (
          <li key={t} className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
              <IconCheck className="h-3.5 w-3.5 text-accent-400" />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
