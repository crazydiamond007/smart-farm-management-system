export const dynamic = "force-dynamic"

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
    fetchFromApi<PaginatedMaintenanceResponse<MaintenanceTaskRecord>>(
      "/maintenance-tasks/"
    ),
  ])

  const farms = farmsData.results
  const sensors = sensorsData.results
  const tasks = tasksData.results

  return (
    <AppShell
      title="Maintenance Management"
      description="Track and manage maintenance task records."
    >
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] xl:grid-cols-[1fr_1.6fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Maintenance Task
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Record operational and technical maintenance work.
          </p>

          <div className="mt-6">
            <MaintenanceTaskForm farms={farms} sensors={sensors} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              All Maintenance Tasks
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              View and manage maintenance task records from the backend.
            </p>
          </div>

          <MaintenanceTasksTable
            tasks={tasks}
            farms={farms}
            sensors={sensors}
          />
        </section>
      </div>
    </AppShell>
  )
}