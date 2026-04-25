"use client"

import { useState } from "react"
import { Farm } from "@/types/farm"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type FieldFormProps = {
  farms: Farm[]
}

export default function FieldForm({ farms }: FieldFormProps) {
  const [formData, setFormData] = useState({
    farm: "",
    name: "",
    size_hectares: "",
    soil_type: "",
    irrigation_type: "",
    status: "available",
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
      const response = await fetch(`${API_BASE_URL}/fields/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          farm: Number(formData.farm),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      setSuccessMessage("Field created successfully.")
      setFormData({
        farm: "",
        name: "",
        size_hectares: "",
        soil_type: "",
        irrigation_type: "",
        status: "available",
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
          Farm
        </label>
        <select
          name="farm"
          value={formData.farm}
          onChange={handleChange}
          required
          className={inputClassName}
        >
          <option value="">Select a farm</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Field Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="Enter field name"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Size (hectares)
        </label>
        <input
          type="number"
          step="0.01"
          name="size_hectares"
          value={formData.size_hectares}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="e.g. 25.50"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Soil Type
        </label>
        <input
          type="text"
          name="soil_type"
          value={formData.soil_type}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="e.g. Loamy"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Irrigation Type
        </label>
        <input
          type="text"
          name="irrigation_type"
          value={formData.irrigation_type}
          onChange={handleChange}
          className={inputClassName}
          placeholder="e.g. Drip"
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
          <option value="available">Available</option>
          <option value="in_use">In Use</option>
          <option value="maintenance">Maintenance</option>
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
        {isSubmitting ? "Creating..." : "Create Field"}
      </button>
    </form>
  )
}