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
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Farm
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new farm record.
          </p>

          <div className="mt-6">
            <FarmForm />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Farms
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Current farm records from the backend.
            </p>
          </div>

          <FarmsTable farms={farms} />
        </section>
      </div>
    </AppShell>
  )
}