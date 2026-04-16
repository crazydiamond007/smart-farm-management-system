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
    fetchFromApi<PaginatedIrrigationResponse<IrrigationEventRecord>>("/irrigation-events/"),
  ])

  const fields = fieldsData.results
  const irrigationEvents = irrigationData.results

  return (
    <AppShell
      title="Irrigation Management"
      description="Create and view irrigation event records."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Add Irrigation Event</h2>
          <p className="mt-1 text-sm text-gray-600">
            Record irrigation details for a field.
          </p>

          <div className="mt-6">
            <IrrigationEventForm fields={fields} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">All Irrigation Events</h2>
            <p className="mt-1 text-sm text-gray-600">
              Current irrigation records from the backend.
            </p>
          </div>

          <IrrigationEventsTable irrigationEvents={irrigationEvents} fields={fields} />
        </section>
      </div>
    </AppShell>
  )
}