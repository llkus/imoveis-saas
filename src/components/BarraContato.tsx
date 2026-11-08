import { IconWhatsapp } from "./Icons";

// Barra fixa no rodapé do celular: valor sempre visível e contato a um toque.
export default function BarraContato({
  href,
  preco,
  rotulo,
  cor,
}: {
  href: string;
  preco: string;
  rotulo: string;
  cor: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wider text-ink-500">{rotulo}</p>
          <p className="font-display truncate text-2xl font-medium leading-tight" style={{ color: cor }}>
            {preco}
          </p>
        </div>
        <a href={href} className="btn btn-whatsapp !px-5 !py-3">
          <IconWhatsapp className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
