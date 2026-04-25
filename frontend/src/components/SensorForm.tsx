"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type SensorFormProps = {
  fields: FieldRecord[]
}

export default function SensorForm({ fields }: SensorFormProps) {
  const [formData, setFormData] = useState({
    field: "",
    sensor_code: "",
    sensor_type: "temperature",
    installation_date: "",
    status: "active",
    manufacturer: "",
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
      const response = await fetch(`${API_BASE_URL}/sensors/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          field: Number(formData.field),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      setSuccessMessage("Sensor created successfully.")
      setFormData({
        field: "",
        sensor_code: "",
        sensor_type: "temperature",
        installation_date: "",
        status: "active",
        manufacturer: "",
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
          Sensor Code
        </label>
        <input
          type="text"
          name="sensor_code"
          value={formData.sensor_code}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="e.g. TEMP-A1-01"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Sensor Type
        </label>
        <select
          name="sensor_type"
          value={formData.sensor_type}
          onChange={handleChange}
          className={inputClassName}
        >
          <option value="temperature">Temperature</option>
          <option value="humidity">Humidity</option>
          <option value="soil_moisture">Soil Moisture</option>
          <option value="ph">pH</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Installation Date
        </label>
        <input
          type="date"
          name="installation_date"
          value={formData.installation_date}
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Manufacturer
        </label>
        <input
          type="text"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          className={inputClassName}
          placeholder="e.g. AgriSense"
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
        {isSubmitting ? "Creating..." : "Create Sensor"}
      </button>
    </form>
  )
}