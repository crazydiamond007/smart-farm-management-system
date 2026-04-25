"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"
import { CropTypeRecord, PlantingRecord } from "@/types/planting"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = {
  planting: PlantingRecord
  fields: FieldRecord[]
  cropTypes: CropTypeRecord[]
  onClose: () => void
}

export default function EditPlantingModal({
  planting,
  fields,
  cropTypes,
  onClose,
}: Props) {
  const [formData, setFormData] = useState({
    field: String(planting.field),
    crop_type: String(planting.crop_type),
    planting_date: planting.planting_date,
    expected_harvest_date: planting.expected_harvest_date || "",
    actual_harvest_date: planting.actual_harvest_date || "",
    planted_area_hectares: planting.planted_area_hectares,
    status: planting.status,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/plantings/${planting.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          field: Number(formData.field),
          crop_type: Number(formData.crop_type),
          expected_harvest_date: formData.expected_harvest_date || null,
          actual_harvest_date: formData.actual_harvest_date || null,
        }),
      })

      if (!response.ok) {
        throw new Error(JSON.stringify(await response.json()))
      }

      window.location.reload()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-400"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-[#081223]">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Edit Planting
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Update the selected planting record.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Field
            </label>
            <select
              name="field"
              value={formData.field}
              onChange={handleChange}
              required
              className={inputClassName}
            >
              <option value="">Select a field</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.farm_name} - {field.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Crop Type
            </label>
            <select
              name="crop_type"
              value={formData.crop_type}
              onChange={handleChange}
              required
              className={inputClassName}
            >
              <option value="">Select a crop type</option>
              {cropTypes.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Planting Date
            </label>
            <input
              type="date"
              name="planting_date"
              value={formData.planting_date}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Expected Harvest Date
            </label>
            <input
              type="date"
              name="expected_harvest_date"
              value={formData.expected_harvest_date}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Actual Harvest Date
            </label>
            <input
              type="date"
              name="actual_harvest_date"
              value={formData.actual_harvest_date}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Planted Area (hectares)
            </label>
            <input
              type="number"
              step="0.01"
              name="planted_area_hectares"
              value={formData.planted_area_hectares}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="planned">Planned</option>
              <option value="growing">Growing</option>
              <option value="harvested">Harvested</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}