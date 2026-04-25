"use client"

import { ReactNode, useState } from "react"
import Sidebar from "@/components/Sidebar"
import ThemeToggle from "@/components/ThemeToggle"
import { Menu } from "lucide-react"

type AppShellProps = {
  children: ReactNode
  title: string
  description?: string
}

export default function AppShell({
  children,
  title,
  description,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#07111f]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-[#081223]/90 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}