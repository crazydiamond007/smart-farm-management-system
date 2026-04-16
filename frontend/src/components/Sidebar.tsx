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
    <aside className="min-h-screen w-72 border-r border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-10">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
          <Sprout className="h-5 w-5" />
        </div>

        <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          Smart Farming
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Database Management System
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
                  ? "bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}