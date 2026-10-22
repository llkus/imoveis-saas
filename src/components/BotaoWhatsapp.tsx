import { IconWhatsapp } from "./Icons";

// Botão flutuante com pulso, fixo no canto da tela.
export default function BotaoWhatsapp({ href }: { href: string }) {
  return (
    <a
      href={href}
      aria-label="Chamar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-110 animate-pulse-ring"
    >
      <IconWhatsapp className="h-7 w-7" />
    </a>
  );
}
