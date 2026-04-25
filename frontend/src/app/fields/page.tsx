import AppShell from "@/components/AppShell"
import FieldForm from "@/components/FieldForm"
import FieldsTable from "@/components/FieldsTable"
import { fetchFromApi } from "@/lib/api"
import { Farm, PaginatedResponse } from "@/types/farm"
import { FieldRecord, PaginatedFieldResponse } from "@/types/field"

export default async function FieldsPage() {
  const [farmsData, fieldsData] = await Promise.all([
    fetchFromApi<PaginatedResponse<Farm>>("/farms/"),
    fetchFromApi<PaginatedFieldResponse<FieldRecord>>("/fields/"),
  ])

  const farms = farmsData.results
  const fields = fieldsData.results

  return (
    <AppShell
      title="Field Management"
      description="Create and manage farm fields."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Field
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a new field linked to a farm.
          </p>

          <div className="mt-6">
            <FieldForm farms={farms} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              All Fields
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and manage all field records from the backend.
            </p>
          </div>

          <FieldsTable fields={fields} farms={farms} />
        </section>
      </div>
    </AppShell>
  )
}