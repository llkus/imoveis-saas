"use client";

import { useEffect, useRef, useState } from "react";

// Janela para arrastar e dar zoom na imagem antes de enviar; devolve o recorte em JPEG.
export default function Enquadrar({
  arquivo,
  proporcao,
  redonda = false,
  larguraSaida,
  titulo,
  onConfirmar,
  onCancelar,
}: {
  arquivo: File;
  proporcao: number; // largura / altura do recorte
  redonda?: boolean;
  larguraSaida: number;
  titulo: string;
  onConfirmar: (imagem: Blob) => void;
  onCancelar: () => void;
}) {
  const quadro = useRef<HTMLDivElement>(null);
  const arraste = useRef<{ x: number; y: number } | null>(null);
  const [src, setSrc] = useState("");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [tam, setTam] = useState({ w: 0, h: 0 });
  // (u, v) = ponto da imagem (0..1) no centro do quadro; zoom 1 = imagem cobrindo o quadro.
  const [pos, setPos] = useState({ u: 0.5, v: 0.5, zoom: 1 });

  useEffect(() => {
    const url = URL.createObjectURL(arquivo);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivo]);

  useEffect(() => {
    const el = quadro.current;
    if (!el) return;
    const medir = () => setTam({ w: el.clientWidth, h: el.clientHeight });
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = nat && tam.w ? Math.max(tam.w / nat.w, tam.h / nat.h) : 1;
  const escala = base * pos.zoom;

  function limitar(u: number, v: number, zoom: number) {
    if (!nat) return { u, v, zoom };
    const e = base * zoom;
    const mu = tam.w / 2 / (nat.w * e);
    const mv = tam.h / 2 / (nat.h * e);
    return {
      u: Math.min(1 - mu, Math.max(mu, u)),
      v: Math.min(1 - mv, Math.max(mv, v)),
      zoom,
    };
  }

  function mudarZoom(zoom: number) {
    const z = Math.min(4, Math.max(1, zoom));
    setPos((p) => limitar(p.u, p.v, z));
  }

  function aoPressionar(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    arraste.current = { x: e.clientX, y: e.clientY };
  }

  function aoMover(e: React.PointerEvent) {
    const a = arraste.current;
    if (!a || !nat) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    arraste.current = { x: e.clientX, y: e.clientY };
    setPos((p) => limitar(p.u - dx / (nat.w * escala), p.v - dy / (nat.h * escala), p.zoom));
  }

  async function confirmar() {
    if (!nat) return;
    const sw = tam.w / escala;
    const sh = tam.h / escala;
    const sx = pos.u * nat.w - sw / 2;
    const sy = pos.v * nat.h - sh / 2;
    const largura = Math.round(Math.min(sw, larguraSaida));
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = Math.round(largura / proporcao);
    const img = await createImageBitmap(arquivo);
    canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    img.close();
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.85));
    if (blob) onConfirmar(blob);
  }

  const dw = nat ? nat.w * escala : 0;
  const dh = nat ? nat.h * escala : 0;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-extrabold text-ink-900">{titulo}</h2>
        <p className="mb-3 text-sm text-ink-500">Arraste para posicionar e use o zoom para ajustar.</p>

        <div
          ref={quadro}
          className="relative mx-auto w-full cursor-grab touch-none select-none overflow-hidden rounded-xl bg-black active:cursor-grabbing"
          style={{ aspectRatio: proporcao, maxWidth: redonda ? 360 : undefined }}
          onPointerDown={aoPressionar}
          onPointerMove={aoMover}
          onPointerUp={() => (arraste.current = null)}
          onPointerCancel={() => (arraste.current = null)}
          onWheel={(e) => mudarZoom(pos.zoom - e.deltaY / 500)}
        >
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              draggable={false}
              onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              className="pointer-events-none absolute max-w-none"
              style={{
                width: dw || undefined,
                height: dh || undefined,
                left: nat ? tam.w / 2 - pos.u * dw : 0,
                top: nat ? tam.h / 2 - pos.v * dh : 0,
                opacity: nat ? 1 : 0,
              }}
            />
          )}
          {redonda && (
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_rgba(0,0,0,0.55)] ring-2 ring-white/80" />
          )}
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink-500">
          Zoom
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={pos.zoom}
            onChange={(e) => mudarZoom(Number(e.target.value))}
            className="flex-1"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2 text-sm font-semibold">
          <button type="button" onClick={onCancelar} className="btn btn-ghost !px-4 !py-2">Cancelar</button>
          <button type="button" onClick={confirmar} disabled={!nat} className="btn btn-primary !px-4 !py-2">Salvar</button>
        </div>
      </div>
    </div>
  );
}
