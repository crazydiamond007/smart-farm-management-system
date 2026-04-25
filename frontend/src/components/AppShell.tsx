import { ReactNode } from "react"
import Sidebar from "@/components/Sidebar"
import ThemeToggle from "@/components/ThemeToggle"

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
  return (
    <div className="flex min-h-screen bg-[#f6f8fb] dark:bg-[#07111f]">
      <Sidebar />

      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white/80 px-6 py-6 backdrop-blur-sm dark:border-slate-800 dark:bg-[#081223]/90 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-start lg:justify-end">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="px-6 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}