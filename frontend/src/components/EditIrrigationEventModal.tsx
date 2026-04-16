"use client"

import { useState } from "react"
import { FieldRecord } from "@/types/field"
import { IrrigationEventRecord } from "@/types/irrigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = {
  irrigationEvent: IrrigationEventRecord
  fields: FieldRecord[]
  onClose: () => void
}

export default function EditIrrigationEventModal({ irrigationEvent, fields, onClose }: Props) {
  const [formData, setFormData] = useState({
    field: String(irrigationEvent.field),
    irrigation_date: irrigationEvent.irrigation_date.slice(0, 16),
    duration_minutes: String(irrigationEvent.duration_minutes),
    water_volume_litres: irrigationEvent.water_volume_litres,
    method: irrigationEvent.method,
    notes: irrigationEvent.notes || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/irrigation-events/${irrigationEvent.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          field: Number(formData.field),
          duration_minutes: Number(formData.duration_minutes),
        }),
      })

      if (!response.ok) throw new Error(JSON.stringify(await response.json()))
      window.location.reload()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Irrigation Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="field" value={formData.field} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm">
            {fields.map((field) => (
              <option key={field.id} value={field.id}>{field.farm_name} - {field.name}</option>
            ))}
          </select>
          <input type="datetime-local" name="irrigation_date" value={formData.irrigation_date} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
          <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
          <input type="number" step="0.01" name="water_volume_litres" value={formData.water_volume_litres} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
          <select name="method" value={formData.method} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm">
            <option value="drip">Drip</option>
            <option value="sprinkler">Sprinkler</option>
            <option value="manual">Manual</option>
            <option value="surface">Surface</option>
          </select>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
          {errorMessage && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}