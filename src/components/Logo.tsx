export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#1d4ed8" />
        <path d="M32 14 12 31h6v19h28V31h6L32 14Z" fill="#fff" />
        <rect x="26" y="34" width="12" height="16" rx="2" fill="#1d4ed8" />
      </svg>
      <span className="text-xl font-bold tracking-tight">Vitrine</span>
    </span>
  );
}
