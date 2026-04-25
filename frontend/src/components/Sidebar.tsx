"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Sprout,
  Map,
  Cpu,
  Wheat,
  Droplets,
  Wrench,
  Settings,
  Leaf,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Farms", href: "/farms", icon: Sprout },
  { label: "Fields", href: "/fields", icon: Map },
  { label: "Sensors", href: "/sensors", icon: Cpu },
  { label: "Plantings", href: "/plantings", icon: Wheat },
  { label: "Irrigation", href: "/irrigation", icon: Droplets },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-[#081223]">
      <div className="mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
          <Leaf className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Smart Farming
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Management System
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-5 dark:border-emerald-500/10 dark:from-emerald-500/10 dark:to-cyan-500/5">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Leaf className="h-5 w-5" />
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Smart Farming
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Grow smarter, not harder.
          </p>

          <div className="mt-5 h-24 rounded-2xl bg-gradient-to-r from-emerald-400/30 via-cyan-300/20 to-sky-300/20 dark:from-emerald-500/20 dark:via-cyan-500/10 dark:to-sky-500/10" />
        </div>
      </div>
    </aside>
  )
}