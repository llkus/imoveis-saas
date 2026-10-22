export default function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-9 w-9 drop-shadow-sm" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3d6bf5" />
            <stop offset="1" stopColor="#7c4dff" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill="url(#logo-g)" />
        <path d="M32 14 12 31h6v19h28V31h6L32 14Z" fill="#fff" />
        <rect x="26" y="34" width="12" height="16" rx="2.5" fill="#5b4dec" />
      </svg>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>Vitrine</span>
    </span>
  );
}
