"use client";

// Botão flutuante claro/escuro. A troca revela o novo tema em círculo a partir do clique.
export default function ToggleTema() {
  function alternar(e: React.MouseEvent<HTMLButtonElement>) {
    const html = document.documentElement;
    const proximo = html.dataset.tema === "escuro" ? "claro" : "escuro";
    const aplicar = () => {
      html.dataset.tema = proximo;
      try {
        localStorage.setItem("tema", proximo);
      } catch {}
    };

    const caixa = e.currentTarget.getBoundingClientRect();
    const x = caixa.left + caixa.width / 2;
    const y = caixa.top + caixa.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aplicar();
      return;
    }
    document.startViewTransition(aplicar).ready.then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar tema"
      className="fixed bottom-[5.5rem] right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-900/15 transition hover:scale-110 active:scale-90"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute h-5 w-5 rotate-0 scale-100 text-amber-500 transition duration-500 escuro:-rotate-90 escuro:scale-0"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute h-5 w-5 rotate-90 scale-0 text-brand-200 transition duration-500 escuro:rotate-0 escuro:scale-100"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
