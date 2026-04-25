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

export default function SensorsTable({
  sensors,
  fields,
}: SensorsTableProps) {
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

  if (!sensors || sensors.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No sensors found.
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
                Field
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sensor Code
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Type
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Installed
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Status
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Manufacturer
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr
                key={sensor.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {sensor.farm_name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {sensor.field_name}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {sensor.sensor_code}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {sensor.sensor_type}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {sensor.installation_date}
                </td>
                <td className="px-5 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      sensor.status === "active"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : sensor.status === "maintenance"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {sensor.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {sensor.manufacturer || "-"}
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSensor(sensor)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(sensor.id)}
                      disabled={deletingId === sensor.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
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