import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado, supabaseKey, supabaseUrl } from "@/lib/supabase/config";

// Renova a sessão do Supabase e exige login em /painel, /admin e /licenca.
export async function proxy(request: NextRequest) {
  if (!supabaseConfigurado) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Valida o JWT localmente (sem ida à rede) e renova o token quando expira.
  const { data } = await supabase.auth.getClaims();
  const logado = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (!logado && pathname !== "/entrar") {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }
  if (logado && pathname === "/entrar") {
    return NextResponse.redirect(new URL("/painel", request.url));
  }
  return response;
}

export const config = { matcher: ["/painel/:path*", "/admin/:path*", "/licenca", "/entrar"] };
