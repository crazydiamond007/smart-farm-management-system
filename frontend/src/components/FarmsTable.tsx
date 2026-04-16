"use client"

import { useState } from "react"
import { Farm } from "@/types/farm"
import EditFarmModal from "@/components/EditFarmModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type FarmsTableProps = {
  farms: Farm[]
}

export default function FarmsTable({ farms }: FarmsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null)

  async function handleDelete(farmId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this farm?")
    if (!confirmed) return

    try {
      setDeletingId(farmId)

      const response = await fetch(`${API_BASE_URL}/farms/${farmId}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete farm.")
      }

      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (farms.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">No farms found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left dark:bg-gray-800">
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Location</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Area (ha)</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Owner</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {farms.map((farm) => (
              <tr key={farm.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{farm.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{farm.location}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{farm.area_hectares}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{farm.owner_name}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      farm.is_active
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {farm.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingFarm(farm)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(farm.id)}
                      disabled={deletingId === farm.id}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60"
                    >
                      {deletingId === farm.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingFarm && (
        <EditFarmModal
          farm={editingFarm}
          onClose={() => setEditingFarm(null)}
        />
      )}
    </>
  )
}