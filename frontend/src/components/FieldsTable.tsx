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

  if (fields.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">No fields found.</p>
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
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Size</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Soil</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Irrigation</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{field.farm_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{field.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{field.size_hectares}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{field.soil_type}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{field.irrigation_type || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{field.status}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingField(field)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(field.id)}
                      disabled={deletingId === field.id}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60"
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