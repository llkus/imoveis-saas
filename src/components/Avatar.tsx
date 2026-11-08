// Foto de perfil redonda; sem foto, mostra as iniciais sobre a cor do corretor.
export default function Avatar({
  nome,
  fotoUrl,
  cor,
  className = "h-12 w-12 text-sm",
}: {
  nome: string;
  fotoUrl?: string;
  cor: string;
  className?: string;
}) {
  const iniciais = nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return fotoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={fotoUrl} alt={nome} className={`shrink-0 rounded-full object-cover ${className}`} />
  ) : (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-extrabold text-white ${className}`}
      style={{ background: cor }}
    >
      {iniciais}
    </span>
  );
}
