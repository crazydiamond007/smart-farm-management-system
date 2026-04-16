import AppShell from "@/components/AppShell"
import MaintenanceTaskForm from "@/components/MaintenanceTaskForm"
import MaintenanceTasksTable from "@/components/MaintenanceTasksTable"
import { fetchFromApi } from "@/lib/api"
import { Farm, PaginatedResponse } from "@/types/farm"
import {
  MaintenanceTaskRecord,
  PaginatedMaintenanceResponse,
} from "@/types/maintenance"
import { PaginatedSensorResponse, SensorRecord } from "@/types/sensor"

export default async function MaintenancePage() {
  const [farmsData, sensorsData, tasksData] = await Promise.all([
    fetchFromApi<PaginatedResponse<Farm>>("/farms/"),
    fetchFromApi<PaginatedSensorResponse<SensorRecord>>("/sensors/"),
    fetchFromApi<PaginatedMaintenanceResponse<MaintenanceTaskRecord>>("/maintenance-tasks/"),
  ])

  const farms = farmsData.results
  const sensors = sensorsData.results
  const tasks = tasksData.results

  return (
    <AppShell
      title="Maintenance Management"
      description="Create and view maintenance task records."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Add Maintenance Task</h2>
          <p className="mt-1 text-sm text-gray-600">
            Record operational and technical maintenance work.
          </p>

          <div className="mt-6">
            <MaintenanceTaskForm farms={farms} sensors={sensors} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">All Maintenance Tasks</h2>
            <p className="mt-1 text-sm text-gray-600">
              Current maintenance task records from the backend.
            </p>
          </div>

          <MaintenanceTasksTable tasks={tasks} farms={farms} sensors={sensors} />
        </section>
      </div>
    </AppShell>
  )
}