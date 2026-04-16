import AppShell from "@/components/AppShell"
import SensorForm from "@/components/SensorForm"
import SensorsTable from "@/components/SensorsTable"
import { fetchFromApi } from "@/lib/api"
import { FieldRecord, PaginatedFieldResponse } from "@/types/field"
import { PaginatedSensorResponse, SensorRecord } from "@/types/sensor"

export default async function SensorsPage() {
  const [fieldsData, sensorsData] = await Promise.all([
    fetchFromApi<PaginatedFieldResponse<FieldRecord>>("/fields/"),
    fetchFromApi<PaginatedSensorResponse<SensorRecord>>("/sensors/"),
  ])

  const fields = fieldsData.results
  const sensors = sensorsData.results

  return (
    <AppShell
      title="Sensor Management"
      description="Create and manage field sensors."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Sensor
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new sensor linked to a field.
          </p>

          <div className="mt-6">
            <SensorForm fields={fields} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Sensors
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Current sensor records from the backend.
            </p>
          </div>

          <SensorsTable sensors={sensors} fields={fields} />
        </section>
      </div>
    </AppShell>
  )
}