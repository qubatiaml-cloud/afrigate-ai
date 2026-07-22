import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href={compact ? "/dashboard" : "/"} aria-label="AfriGate AI home">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-name">AfriGate<span>AI</span></span>
    </Link>
  );
}
