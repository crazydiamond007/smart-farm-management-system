"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type IrrigationEventFormProps = {
  fields: FieldRecord[]
}

export default function IrrigationEventForm({
  fields,
}: IrrigationEventFormProps) {
  const [formData, setFormData] = useState({
    field: "",
    irrigation_date: "",
    duration_minutes: "",
    water_volume_litres: "",
    method: "drip",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
      const response = await fetch(`${API_BASE_URL}/irrigation-events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          field: Number(formData.field),
          duration_minutes: Number(formData.duration_minutes),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      setSuccessMessage("Irrigation event created successfully.")
      setFormData({
        field: "",
        irrigation_date: "",
        duration_minutes: "",
        water_volume_litres: "",
        method: "drip",
        notes: "",
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
          Irrigation Date & Time
        </label>
        <input
          type="datetime-local"
          name="irrigation_date"
          value={formData.irrigation_date}
          onChange={handleChange}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Duration (minutes)
        </label>
        <input
          type="number"
          name="duration_minutes"
          value={formData.duration_minutes}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="e.g. 45"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Water Volume (litres)
        </label>
        <input
          type="number"
          step="0.01"
          name="water_volume_litres"
          value={formData.water_volume_litres}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="e.g. 1200.00"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Method
        </label>
        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className={inputClassName}
        >
          <option value="drip">Drip</option>
          <option value="sprinkler">Sprinkler</option>
          <option value="manual">Manual</option>
          <option value="surface">Surface</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className={`${inputClassName} resize-none`}
          placeholder="Optional notes about this irrigation event"
        />
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
        {isSubmitting ? "Creating..." : "Create Irrigation Event"}
      </button>
    </form>
  )
}