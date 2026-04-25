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

export default function IrrigationEventsTable({
  irrigationEvents,
  fields,
}: Props) {
  const [editingEvent, setEditingEvent] =
    useState<IrrigationEventRecord | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this irrigation event?")) return

    try {
      setDeletingId(id)
      const response = await fetch(`${API_BASE_URL}/irrigation-events/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete irrigation event.")
      }

      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (!irrigationEvents || irrigationEvents.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No irrigation events found.
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
                Date
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Duration
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Water Volume
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Method
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Notes
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {irrigationEvents.map((event) => (
              <tr
                key={event.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {event.farm_name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {event.field_name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {event.irrigation_date}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {event.duration_minutes} min
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {event.water_volume_litres} L
                </td>
                <td className="px-5 py-4 text-sm">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {event.method}
                  </span>
                </td>
                <td className="max-w-[220px] px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  <div className="truncate">{event.notes || "-"}</div>
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId === event.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
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