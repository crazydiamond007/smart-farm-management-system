"use client"

import { useState } from "react"
import { Farm } from "@/types/farm"
import { MaintenanceTaskRecord } from "@/types/maintenance"
import { SensorRecord } from "@/types/sensor"
import EditMaintenanceTaskModal from "@/components/EditMaintenanceTaskModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = {
  tasks: MaintenanceTaskRecord[]
  farms: Farm[]
  sensors: SensorRecord[]
}

export default function MaintenanceTasksTable({
  tasks,
  farms,
  sensors,
}: Props) {
  const [editingTask, setEditingTask] =
    useState<MaintenanceTaskRecord | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this maintenance task?")) return

    try {
      setDeletingId(id)
      const response = await fetch(`${API_BASE_URL}/maintenance-tasks/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete maintenance task.")
      }

      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No maintenance tasks found.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left dark:bg-slate-800/70">
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Farm
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sensor
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Title
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Priority
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Status
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Due Date
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {task.farm_name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {task.sensor_code || "-"}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {task.title}
                </td>
                <td className="px-5 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      task.priority === "critical"
                        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        : task.priority === "high"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : task.priority === "medium"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : task.status === "in_progress"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : task.status === "cancelled"
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {task.due_date || "-"}
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      {deletingId === task.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTask && (
        <EditMaintenanceTaskModal
          task={editingTask}
          farms={farms}
          sensors={sensors}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  )
}