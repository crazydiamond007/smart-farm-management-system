"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"
import { CropTypeRecord } from "@/types/planting"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type PlantingFormProps = {
  fields: FieldRecord[]
  cropTypes: CropTypeRecord[]
}

export default function PlantingForm({
  fields,
  cropTypes,
}: PlantingFormProps) {
  const [formData, setFormData] = useState({
    field: "",
    crop_type: "",
    planting_date: "",
    expected_harvest_date: "",
    actual_harvest_date: "",
    planted_area_hectares: "",
    status: "planned",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
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
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const payload = {
        ...formData,
        field: Number(formData.field),
        crop_type: Number(formData.crop_type),
        expected_harvest_date: formData.expected_harvest_date || null,
        actual_harvest_date: formData.actual_harvest_date || null,
      }

      const response = await fetch(`${API_BASE_URL}/plantings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      setSuccessMessage("Planting created successfully.")
      setFormData({
        field: "",
        crop_type: "",
        planting_date: "",
        expected_harvest_date: "",
        actual_harvest_date: "",
        planted_area_hectares: "",
        status: "planned",
      })

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
          placeholder="e.g. 20.00"
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

      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Planting"}
      </button>
    </form>
  )
}