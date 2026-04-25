import AppShell from "@/components/AppShell"
import PlantingForm from "@/components/PlantingForm"
import PlantingsTable from "@/components/PlantingsTable"
import { fetchFromApi } from "@/lib/api"
import { FieldRecord, PaginatedFieldResponse } from "@/types/field"
import {
  CropTypeRecord,
  PaginatedPlantingResponse,
  PlantingRecord,
} from "@/types/planting"

export default async function PlantingsPage() {
  const [fieldsData, cropTypesData, plantingsData] = await Promise.all([
    fetchFromApi<PaginatedFieldResponse<FieldRecord>>("/fields/"),
    fetchFromApi<{
      count: number
      next: string | null
      previous: string | null
      results: CropTypeRecord[]
    }>("/crop-types/"),
    fetchFromApi<PaginatedPlantingResponse<PlantingRecord>>("/plantings/"),
  ])

  const fields = fieldsData.results
  const cropTypes = cropTypesData.results
  const plantings = plantingsData.results

  return (
    <AppShell
      title="Planting Management"
      description="Create and manage crop planting records."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Planting
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Link a crop type to a field with planting details.
          </p>

          <div className="mt-6">
            <PlantingForm fields={fields} cropTypes={cropTypes} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              All Plantings
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and manage all planting records from the backend.
            </p>
          </div>

          <PlantingsTable
            plantings={plantings}
            fields={fields}
            cropTypes={cropTypes}
          />
        </section>
      </div>
    </AppShell>
  )
}