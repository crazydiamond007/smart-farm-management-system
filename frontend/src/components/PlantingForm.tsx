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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Field
        </label>
        <select
          name="field"
          value={formData.field}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Crop Type
        </label>
        <select
          name="crop_type"
          value={formData.crop_type}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Planting Date
        </label>
        <input
          type="date"
          name="planting_date"
          value={formData.planting_date}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Expected Harvest Date
        </label>
        <input
          type="date"
          name="expected_harvest_date"
          value={formData.expected_harvest_date}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Actual Harvest Date
        </label>
        <input
          type="date"
          name="actual_harvest_date"
          value={formData.actual_harvest_date}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Planted Area (hectares)
        </label>
        <input
          type="number"
          step="0.01"
          name="planted_area_hectares"
          value={formData.planted_area_hectares}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="planned">Planned</option>
          <option value="growing">Growing</option>
          <option value="harvested">Harvested</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        {isSubmitting ? "Creating..." : "Create Planting"}
      </button>
    </form>
  )
}