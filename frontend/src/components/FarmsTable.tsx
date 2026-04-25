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

  if (!farms || farms.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No farms found.
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
                Name
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Location
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Area (ha)
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Owner
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
            {farms.map((farm) => (
              <tr
                key={farm.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {farm.name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {farm.location}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {farm.area_hectares}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {farm.owner_name}
                </td>
                <td className="px-5 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      farm.is_active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {farm.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingFarm(farm)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(farm.id)}
                      disabled={deletingId === farm.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
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