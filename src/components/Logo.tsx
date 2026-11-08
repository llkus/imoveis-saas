export default function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? "#fffdf8" : "#1c4532"} />
        <path d="M32 13 13 30h6v20h26V30h6L32 13Z" fill={light ? "#1c4532" : "#fffdf8"} />
        <rect x="26" y="34" width="12" height="16" rx="6" fill="#dcaa4c" />
      </svg>
      <span className={`font-display text-2xl font-medium ${light ? "text-white" : "text-slate-900"}`}>Vitrine</span>
    </span>
  );
}
