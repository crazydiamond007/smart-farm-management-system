import AppShell from "@/components/AppShell"
import StatCard from "@/components/StatCard"
import { fetchFromApi } from "@/lib/api"
import { PaginatedResponse, Farm } from "@/types/farm"
import { FieldRecord, PaginatedFieldResponse } from "@/types/field"
import { PaginatedSensorResponse, SensorRecord } from "@/types/sensor"
import { PaginatedPlantingResponse, PlantingRecord } from "@/types/planting"
import { PaginatedIrrigationResponse, IrrigationEventRecord } from "@/types/irrigation"
import { MaintenanceTaskRecord, PaginatedMaintenanceResponse } from "@/types/maintenance"

export default async function DashboardPage() {
  const [farmsData, fieldsData, sensorsData, plantingsData, irrigationData, tasksData] =
    await Promise.all([
      fetchFromApi<PaginatedResponse<Farm>>("/farms/"),
      fetchFromApi<PaginatedFieldResponse<FieldRecord>>("/fields/"),
      fetchFromApi<PaginatedSensorResponse<SensorRecord>>("/sensors/"),
      fetchFromApi<PaginatedPlantingResponse<PlantingRecord>>("/plantings/"),
      fetchFromApi<PaginatedIrrigationResponse<IrrigationEventRecord>>("/irrigation-events/"),
      fetchFromApi<PaginatedMaintenanceResponse<MaintenanceTaskRecord>>("/maintenance-tasks/"),
    ])

  const farms = farmsData.results
  const fields = fieldsData.results
  const sensors = sensorsData.results
  const plantings = plantingsData.results
  const irrigationEvents = irrigationData.results
  const tasks = tasksData.results

  const activeSensors = sensors.filter((sensor) => sensor.status === "active").length
  const growingPlantings = plantings.filter((planting) => planting.status === "growing").length
  const pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length

  return (
    <AppShell title="Dashboard" description="Overview of your smart farming system.">
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          <StatCard label="Farms" value={farms.length} />
          <StatCard label="Fields" value={fields.length} />
          <StatCard label="Sensors" value={sensors.length} />
          <StatCard label="Active Sensors" value={activeSensors} />
          <StatCard label="Growing Plantings" value={growingPlantings} />
          <StatCard label="Pending Tasks" value={pendingTasks} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Irrigation Events
            </h2>
            <div className="mt-4 space-y-3">
              {irrigationEvents.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No irrigation events yet.
                </p>
              ) : (
                irrigationEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.farm_name} — {event.field_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.method} • {event.water_volume_litres} L • {event.duration_minutes} min
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Maintenance Tasks
            </h2>
            <div className="mt-4 space-y-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No maintenance tasks yet.
                </p>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.farm_name} • {task.priority} • {task.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}