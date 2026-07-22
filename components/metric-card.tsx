import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function MetricCard({
  label,
  value,
  change,
  note,
  icon: Icon,
  tone = "green",
  inverse = false,
}: {
  label: string;
  value: string;
  change: string;
  note: string;
  icon: LucideIcon;
  tone?: "green" | "blue" | "amber" | "violet";
  inverse?: boolean;
}) {
  const positive = !change.trim().startsWith("−") && !change.trim().startsWith("-");
  const isGood = inverse ? !positive : positive;
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={19} /></div>
      <p>{label}</p>
      <div className="metric-value-row">
        <strong>{value}</strong>
        <span className={isGood ? "change positive" : "change negative"}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}
        </span>
      </div>
      <small>{note}</small>
    </article>
  );
}
