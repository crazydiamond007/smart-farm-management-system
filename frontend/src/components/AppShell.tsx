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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-gray-900 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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