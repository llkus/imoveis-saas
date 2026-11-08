type P = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconCamera = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
export const IconGlobe = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </svg>
);
export const IconShare = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
  </svg>
);
export const IconBed = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" />
    <circle cx="7" cy="11" r="1.5" />
  </svg>
);
export const IconBath = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 3.5-1.3M7 18l-1 2M17 18l1 2" />
  </svg>
);
export const IconCar = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 16V12l2-5h10l2 5v4zM3 16h18v2H3z" />
    <circle cx="8" cy="13.5" r=".8" />
    <circle cx="16" cy="13.5" r=".8" />
  </svg>
);
export const IconRuler = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="m4 16 12-12 4 4L8 20zM8 12l2 2M11 9l2 2M14 6l2 2" />
  </svg>
);
export const IconPin = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconMap = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M9 4 3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5z" />
    <path d="M9 4v13.5M15 6.5V20" />
  </svg>
);
export const IconCheck = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="m5 12 5 5 9-10" />
  </svg>
);
export const IconArrow = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconWhatsapp = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.8-2s-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4.1c1.7.7 2.4.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
  </svg>
);
export const IconClose = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconGrid = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </svg>
);
export const IconFeed = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 5h16v6H4zM4 15h16v4H4z" />
  </svg>
);
export const IconImages = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M8 8h12v12H8zM4 16V4h12" />
  </svg>
);
