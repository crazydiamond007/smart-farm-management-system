export type IrrigationEventRecord = {
  id: number
  field: number
  field_name: string
  farm_name: string
  irrigation_date: string
  duration_minutes: number
  water_volume_litres: string
  method: string
  performed_by: number | null
  performed_by_username: string | null
  notes: string
  created_at: string
  updated_at: string
}

export type PaginatedIrrigationResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}