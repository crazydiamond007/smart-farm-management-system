"use client"

import { useState } from "react"
import { Farm } from "@/types/farm"
import { MaintenanceTaskRecord } from "@/types/maintenance"
import { SensorRecord } from "@/types/sensor"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = {
  task: MaintenanceTaskRecord
  farms: Farm[]
  sensors: SensorRecord[]
  onClose: () => void
}

export default function EditMaintenanceTaskModal({ task, farms, sensors, onClose }: Props) {
  const [formData, setFormData] = useState({
    farm: String(task.farm),
    sensor: task.sensor ? String(task.sensor) : "",
    title: task.title,
    description: task.description,
    due_date: task.due_date || "",
    priority: task.priority,
    status: task.status,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/maintenance-tasks/${task.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          farm: Number(formData.farm),
          sensor: formData.sensor ? Number(formData.sensor) : null,
          due_date: formData.due_date || null,
        }),
      })

      if (!response.ok) throw new Error(JSON.stringify(await response.json()))
      window.location.reload()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Maintenance Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="farm" value={formData.farm} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm">
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.name}</option>
            ))}
          </select>

          <select name="sensor" value={formData.sensor} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm">
            <option value="">No sensor linked</option>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>{sensor.sensor_code} - {sensor.field_name}</option>
            ))}
          </select>

          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
          <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />

          <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {errorMessage && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}