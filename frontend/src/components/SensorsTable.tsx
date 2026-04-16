"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"
import { SensorRecord } from "@/types/sensor"
import EditSensorModal from "@/components/EditSensorModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type SensorsTableProps = {
  sensors: SensorRecord[]
  fields: FieldRecord[]
}

export default function SensorsTable({ sensors, fields }: SensorsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingSensor, setEditingSensor] = useState<SensorRecord | null>(null)

  async function handleDelete(sensorId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this sensor?")
    if (!confirmed) return

    try {
      setDeletingId(sensorId)

      const response = await fetch(`${API_BASE_URL}/sensors/${sensorId}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete sensor.")
      }

      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (sensors.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">No sensors found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left dark:bg-gray-800">
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Farm</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Field</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Sensor Code</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Type</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Installed</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Manufacturer</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.farm_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.field_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.sensor_code}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.sensor_type}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.installation_date}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.status}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{sensor.manufacturer || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSensor(sensor)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(sensor.id)}
                      disabled={deletingId === sensor.id}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60"
                    >
                      {deletingId === sensor.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSensor && (
        <EditSensorModal
          sensor={editingSensor}
          fields={fields}
          onClose={() => setEditingSensor(null)}
        />
      )}
    </>
  )
}