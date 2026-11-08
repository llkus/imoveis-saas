"use client";

import { useEffect } from "react";

// Dificulta salvar as fotos da vitrine: bloqueia o menu de clique direito e o arrastar em imagens,
// e o toque longo no celular. Não impede captura de tela nem quem abre as ferramentas do navegador.
export default function ProtegerImagens() {
  useEffect(() => {
    const bloquear = (e: Event) => {
      if (e.target instanceof HTMLImageElement) e.preventDefault();
    };
    document.body.classList.add("protegida");
    document.addEventListener("contextmenu", bloquear);
    document.addEventListener("dragstart", bloquear);
    return () => {
      document.body.classList.remove("protegida");
      document.removeEventListener("contextmenu", bloquear);
      document.removeEventListener("dragstart", bloquear);
    };
  }, []);
  return null;
}
