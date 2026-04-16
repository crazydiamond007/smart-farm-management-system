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

export default function MaintenanceTasksTable({ tasks, farms, sensors }: Props) {
  const [editingTask, setEditingTask] = useState<MaintenanceTaskRecord | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this maintenance task?")) return
    try {
      setDeletingId(id)
      const response = await fetch(`${API_BASE_URL}/maintenance-tasks/${id}/`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete maintenance task.")
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (tasks.length === 0) {
    return <div className="rounded-xl border border-gray-200 p-6"><p className="text-sm text-gray-600">No maintenance tasks found.</p></div>
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Farm</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Sensor</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Priority</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Due Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-sm text-gray-800">{task.farm_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{task.sensor_code || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{task.title}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{task.priority}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{task.status}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{task.due_date || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTask(task)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">Edit</button>
                    <button onClick={() => handleDelete(task.id)} disabled={deletingId === task.id} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-60">
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