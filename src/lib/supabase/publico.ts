import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./config";

// Cliente anônimo, sem cookies: leitura das páginas públicas.
export function criarClientePublico() {
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
