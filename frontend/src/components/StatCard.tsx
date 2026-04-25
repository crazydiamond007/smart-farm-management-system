import { LucideIcon } from "lucide-react"

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  change?: string
  changeColor?: "green" | "red" | "blue" | "yellow"
}

const changeColorMap = {
  green: "text-emerald-600 dark:text-emerald-400",
  red: "text-red-600 dark:text-red-400",
  blue: "text-blue-600 dark:text-blue-400",
  yellow: "text-amber-600 dark:text-amber-400",
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  change,
  changeColor = "green",
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#081223] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 sm:h-14 sm:w-14">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {value}
          </h3>
          {change && (
            <p className={`mt-2 text-sm font-medium ${changeColorMap[changeColor]}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}