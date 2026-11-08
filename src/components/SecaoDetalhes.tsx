import { IconCheck } from "@/components/Icons";
import { CARACTERISTICAS_CONDOMINIO, GRUPOS_CONDOMINIO } from "@/lib/caracteristicas";
import { formatarMoeda, type Imovel } from "@/lib/dados";

type Linha = [string, string];

function Lista({ itens, cor }: { itens: string[]; cor: string }) {
  return (
    <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((d) => (
        <li key={d} className="flex items-center gap-2.5 text-sm font-medium">
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
            style={{ background: cor }}
          >
            <IconCheck className="h-3 w-3" />
          </span>
          {d}
        </li>
      ))}
    </ul>
  );
}

// Detalhes técnicos, custos e características (do imóvel e do condomínio) na página pública.
export default function SecaoDetalhes({ imovel: i, cor }: { imovel: Imovel; cor: string }) {
  const mes = (v: number) => `${formatarMoeda(v)}/mês`;
  const iptu = i.iptuIsento
    ? "Isento"
    : i.valorIptu != null
      ? `${formatarMoeda(i.valorIptu)}/${i.iptuPeriodo === "mensal" ? "mês" : "ano"}`
      : null;

  const detalhes: Linha[] = [
    i.uso ? ["Uso", i.uso === "comercial" ? "Comercial" : "Residencial"] : null,
    i.categoria && i.categoria !== "Padrão" ? ["Categoria", i.categoria] : null,
    i.suites != null ? ["Suítes", String(i.suites)] : null,
    i.andar ? ["Andar", `${i.andar}º`] : null,
    i.areaM2 ? ["Área útil", `${i.areaM2} m²`] : null,
    i.areaTotalM2 ? ["Área total", `${i.areaTotalM2} m²`] : null,
    i.anoConstrucao ? ["Ano de construção", String(i.anoConstrucao)] : null,
    i.condominioAndares != null ? ["Andares do prédio", String(i.condominioAndares)] : null,
    i.condominioUnidadesAndar != null ? ["Unidades por andar", String(i.condominioUnidadesAndar)] : null,
    i.condominioTorres != null ? ["Torres", String(i.condominioTorres)] : null,
    i.condominioIsento
      ? ["Condomínio", "Isento"]
      : i.valorCondominio != null
        ? ["Condomínio", mes(i.valorCondominio)]
        : null,
    iptu ? ["IPTU", iptu] : null,
  ].filter((l): l is Linha => l !== null);

  const condominio = i.caracteristicasCondominio ?? [];
  const gruposCond = GRUPOS_CONDOMINIO.map((g) => ({
    nome: g.nome,
    itens: g.itens.filter((x) => condominio.includes(x)),
  }));
  const outrasCond = condominio.filter((x) => !CARACTERISTICAS_CONDOMINIO.includes(x));
  if (outrasCond.length) gruposCond.push({ nome: "Outras", itens: outrasCond });
  const gruposComItens = gruposCond.filter((g) => g.itens.length > 0);

  if (!detalhes.length && !i.diferenciais.length && !gruposComItens.length) return null;

  return (
    <section className="mt-10 space-y-9 animate-fade-up">
      {detalhes.length > 0 && (
        <div>
          <h2 className="font-display text-3xl font-medium">Detalhes do imóvel</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {detalhes.map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-slate-200 bg-surface px-4 py-3">
                <dt className="text-xs text-ink-500">{k}</dt>
                <dd className="font-display mt-0.5 text-lg font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {i.diferenciais.length > 0 && (
        <div>
          <h2 className="font-display text-3xl font-medium">Características</h2>
          <Lista itens={i.diferenciais} cor={cor} />
        </div>
      )}

      {gruposComItens.length > 0 && (
        <div>
          <h2 className="font-display text-3xl font-medium">Condomínio</h2>
          <div className="mt-4 space-y-5">
            {gruposComItens.map((g) => (
              <div key={g.nome}>
                <p className="sobretitulo">{g.nome}</p>
                <Lista itens={g.itens} cor={cor} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
