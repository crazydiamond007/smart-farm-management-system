"use client"

import { useState } from "react"
import { Farm } from "@/types/farm"
import { FieldRecord } from "@/types/field"
import EditFieldModal from "@/components/EditFieldModal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type FieldsTableProps = {
  fields: FieldRecord[]
  farms: Farm[]
}

export default function FieldsTable({ fields, farms }: FieldsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<FieldRecord | null>(null)

  async function handleDelete(fieldId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this field?")
    if (!confirmed) return

    try {
      setDeletingId(fieldId)

      const response = await fetch(`${API_BASE_URL}/fields/${fieldId}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete field.")
      }

      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#081223]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No fields found.
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
                Size
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Soil
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Irrigation
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
            {fields.map((field) => (
              <tr
                key={field.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {field.farm_name}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {field.name}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {field.size_hectares}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {field.soil_type}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {field.irrigation_type || "-"}
                </td>
                <td className="px-5 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      field.status === "available"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : field.status === "maintenance"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    }`}
                  >
                    {field.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingField(field)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(field.id)}
                      disabled={deletingId === field.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      {deletingId === field.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingField && (
        <EditFieldModal
          field={editingField}
          farms={farms}
          onClose={() => setEditingField(null)}
        />
      )}
    </>
  )
}