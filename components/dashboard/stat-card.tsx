import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  tag: string;
  tagClassName?: string;
  label: string;
  value: string | number;
}

export function StatCard({
  icon: Icon,
  iconClassName = "bg-[#17A649]/10 text-[#17A649]",
  tag,
  tagClassName = "bg-[#17A649]/10 text-[#117A37]",
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg ${iconClassName}`}
        >
          <Icon size={18} />
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${tagClassName}`}
        >
          {tag}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}