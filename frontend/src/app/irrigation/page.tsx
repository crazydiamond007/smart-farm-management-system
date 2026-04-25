import AppShell from "@/components/AppShell"
import IrrigationEventForm from "@/components/IrrigationEventForm"
import IrrigationEventsTable from "@/components/IrrigationEventsTable"
import { fetchFromApi } from "@/lib/api"
import { FieldRecord, PaginatedFieldResponse } from "@/types/field"
import {
  IrrigationEventRecord,
  PaginatedIrrigationResponse,
} from "@/types/irrigation"

export default async function IrrigationPage() {
  const [fieldsData, irrigationData] = await Promise.all([
    fetchFromApi<PaginatedFieldResponse<FieldRecord>>("/fields/"),
    fetchFromApi<PaginatedIrrigationResponse<IrrigationEventRecord>>(
      "/irrigation-events/"
    ),
  ])

  const fields = fieldsData.results
  const irrigationEvents = irrigationData.results

  return (
    <AppShell
      title="Irrigation Management"
      description="Track and manage irrigation events across your fields."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Irrigation Event
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Record a new irrigation event linked to a field.
          </p>

          <div className="mt-6">
            <IrrigationEventForm fields={fields} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              All Irrigation Events
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and manage irrigation activity from the backend.
            </p>
          </div>

          <IrrigationEventsTable
            irrigationEvents={irrigationEvents}
            fields={fields}
          />
        </section>
      </div>
    </AppShell>
  )
}