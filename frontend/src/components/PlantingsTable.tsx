"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"
import { CropTypeRecord, PlantingRecord } from "@/types/planting"
import EditPlantingModal from "@/components/EditPlantingModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = {
  plantings: PlantingRecord[]
  fields: FieldRecord[]
  cropTypes: CropTypeRecord[]
}

export default function PlantingsTable({
  plantings,
  fields,
  cropTypes,
}: Props) {
  const [editingPlanting, setEditingPlanting] = useState<PlantingRecord | null>(
    null
  )
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this planting?")) return

    try {
      setDeletingId(id)
      const response = await fetch(`${API_BASE_URL}/plantings/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete planting.")

      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (!plantings || plantings.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No plantings found.
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
                Crop
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Planting Date
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Expected Harvest
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Area
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Status
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {plantings.map((planting) => (
              <tr
                key={planting.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {planting.farm_name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {planting.field_name}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {planting.crop_type_name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {planting.planting_date}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {planting.expected_harvest_date || "-"}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {planting.planted_area_hectares}
                </td>
                <td className="px-5 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      planting.status === "growing"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : planting.status === "planned"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : planting.status === "harvested"
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {planting.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPlanting(planting)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(planting.id)}
                      disabled={deletingId === planting.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      {deletingId === planting.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingPlanting && (
        <EditPlantingModal
          planting={editingPlanting}
          fields={fields}
          cropTypes={cropTypes}
          onClose={() => setEditingPlanting(null)}
        />
      )}
    </>
  )
}