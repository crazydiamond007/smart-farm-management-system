export const dynamic = "force-dynamic"

import AppShell from "@/components/AppShell"
import FarmForm from "@/components/FarmForm"
import FarmsTable from "@/components/FarmsTable"
import { fetchFromApi } from "@/lib/api"
import { Farm, PaginatedResponse } from "@/types/farm"

export default async function FarmsPage() {
  const data = await fetchFromApi<PaginatedResponse<Farm>>("/farms/")
  const farms = data.results

  return (
    <AppShell
      title="Farm Management"
      description="Create and manage farm records."
    >
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] xl:grid-cols-[1fr_1.5fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Farm
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a new farm record for your management system.
          </p>

          <div className="mt-6">
            <FarmForm />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              All Farms
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and manage all farm records from the backend.
            </p>
          </div>

          <FarmsTable farms={farms} />
        </section>
      </div>
    </AppShell>
  )
}