"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"
import { IrrigationEventRecord } from "@/types/irrigation"
import EditIrrigationEventModal from "@/components/EditIrrigationEventModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = {
  irrigationEvents: IrrigationEventRecord[]
  fields: FieldRecord[]
}

export default function IrrigationEventsTable({ irrigationEvents, fields }: Props) {
  const [editingEvent, setEditingEvent] = useState<IrrigationEventRecord | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this irrigation event?")) return
    try {
      setDeletingId(id)
      const response = await fetch(`${API_BASE_URL}/irrigation-events/${id}/`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete irrigation event.")
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (irrigationEvents.length === 0) {
    return <div className="rounded-xl border border-gray-200 p-6"><p className="text-sm text-gray-600">No irrigation events found.</p></div>
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Farm</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Field</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Duration</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Water Volume</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Method</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Notes</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {irrigationEvents.map((event) => (
              <tr key={event.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-sm text-gray-800">{event.farm_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{event.field_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{event.irrigation_date}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{event.duration_minutes} min</td>
                <td className="px-4 py-3 text-sm text-gray-800">{event.water_volume_litres} L</td>
                <td className="px-4 py-3 text-sm text-gray-800">{event.method}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{event.notes || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => setEditingEvent(event)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">Edit</button>
                    <button onClick={() => handleDelete(event.id)} disabled={deletingId === event.id} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-60">
                      {deletingId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEvent && (
        <EditIrrigationEventModal
          irrigationEvent={editingEvent}
          fields={fields}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </>
  )
}