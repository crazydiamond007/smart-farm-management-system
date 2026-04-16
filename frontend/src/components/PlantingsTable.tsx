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
      <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No plantings found.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left dark:bg-gray-800">
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Farm
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Field
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Crop
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Planting Date
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Expected Harvest
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Area
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {plantings.map((planting) => (
              <tr
                key={planting.id}
                className="border-t border-gray-100 dark:border-gray-800"
              >
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.farm_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.field_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.crop_type_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.planting_date}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.expected_harvest_date || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.planted_area_hectares}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {planting.status}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPlanting(planting)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(planting.id)}
                      disabled={deletingId === planting.id}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
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