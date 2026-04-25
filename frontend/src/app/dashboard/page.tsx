import AppShell from "@/components/AppShell"
import StatCard from "@/components/StatCard"
import { fetchFromApi } from "@/lib/api"
import { PaginatedResponse, Farm } from "@/types/farm"
import { FieldRecord, PaginatedFieldResponse } from "@/types/field"
import { PaginatedSensorResponse, SensorRecord } from "@/types/sensor"
import { PaginatedPlantingResponse, PlantingRecord } from "@/types/planting"
import {
  PaginatedIrrigationResponse,
  IrrigationEventRecord,
} from "@/types/irrigation"
import {
  MaintenanceTaskRecord,
  PaginatedMaintenanceResponse,
} from "@/types/maintenance"
import { Cpu, Droplets, Map, Sprout, Wrench, Wheat } from "lucide-react"

export default async function DashboardPage() {
  const [
    farmsData,
    fieldsData,
    sensorsData,
    plantingsData,
    irrigationData,
    tasksData,
  ] = await Promise.all([
    fetchFromApi<PaginatedResponse<Farm>>("/farms/"),
    fetchFromApi<PaginatedFieldResponse<FieldRecord>>("/fields/"),
    fetchFromApi<PaginatedSensorResponse<SensorRecord>>("/sensors/"),
    fetchFromApi<PaginatedPlantingResponse<PlantingRecord>>("/plantings/"),
    fetchFromApi<PaginatedIrrigationResponse<IrrigationEventRecord>>(
      "/irrigation-events/"
    ),
    fetchFromApi<PaginatedMaintenanceResponse<MaintenanceTaskRecord>>(
      "/maintenance-tasks/"
    ),
  ])

  const farms = farmsData.results
  const fields = fieldsData.results
  const sensors = sensorsData.results
  const plantings = plantingsData.results
  const irrigationEvents = irrigationData.results
  const tasks = tasksData.results

  const activeSensors = sensors.filter((sensor) => sensor.status === "active").length
  const growingPlantings = plantings.filter(
    (planting) => planting.status === "growing"
  ).length
  const pendingTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "in_progress"
  ).length

  return (
    <AppShell
      title="Welcome back, Admin 👋"
      description="Here’s what’s happening on your farms today."
    >
      <div className="space-y-6 lg:space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          <StatCard
            label="Total Farms"
            value={farms.length}
            icon={Sprout}
            change="+2 this month"
            changeColor="green"
          />
          <StatCard
            label="Total Fields"
            value={fields.length}
            icon={Map}
            change="+5 this month"
            changeColor="green"
          />
          <StatCard
            label="Active Sensors"
            value={activeSensors}
            icon={Cpu}
            change="+3 this month"
            changeColor="green"
          />
          <StatCard
            label="Maintenance Tasks"
            value={pendingTasks}
            icon={Wrench}
            change="2 overdue"
            changeColor="red"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#081223] sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                Sensor Overview
              </h2>
              <div className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                7 Days
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="h-2.5 w-6 rounded-full bg-emerald-500" />
                  Soil Moisture (%)
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="h-2.5 w-6 rounded-full bg-blue-500" />
                  Temperature (°C)
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="h-2.5 w-6 rounded-full bg-violet-500" />
                  Humidity (%)
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="grid min-w-[420px] grid-cols-7 items-end gap-3">
                  {[72, 70, 63, 76, 65, 75, 69].map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="flex h-36 items-end gap-1 sm:h-40">
                        <div
                          className="w-2 rounded-full bg-emerald-500"
                          style={{ height: `${value}%` }}
                        />
                        <div
                          className="w-2 rounded-full bg-blue-500"
                          style={{ height: `${Math.max(20, value - 40)}%` }}
                        />
                        <div
                          className="w-2 rounded-full bg-violet-500"
                          style={{ height: `${Math.max(35, value - 20)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Day {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#081223] sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
              Irrigation Overview
            </h2>

            <div className="mt-8 flex flex-col items-center gap-8">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#22c55e_0%_72%,#3b82f6_72%_94%,#f59e0b_94%_100%)] sm:h-52 sm:w-52">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white dark:bg-[#081223] sm:h-36 sm:w-36">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    72%
                  </span>
                  <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Efficient
                  </span>
                </div>
              </div>

              <div className="w-full space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Efficient
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        13 fields
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    72%
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Scheduled
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        4 fields
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    22%
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Overdue
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        1 field
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    6%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#081223] sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                Recent Maintenance Tasks
              </h2>
              <button className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {tasks.slice(0, 4).map((task, index) => (
                <div
                  key={task.id ?? index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {task.farm_name}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : task.status === "in_progress"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {task.status}
                    </span>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {task.due_date || "No due date"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#081223] sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                Live Snapshot
              </h2>
              <button className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                View All
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Total Irrigation Events
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Recorded in the system
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {irrigationEvents.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Wheat className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Growing Plantings
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Active crop cycles
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {growingPlantings}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Total Sensors
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Devices linked to fields
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {sensors.length}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}