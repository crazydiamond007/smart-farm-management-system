export type SensorRecord = {
  id: number
  field: number
  field_name: string
  farm_name: string
  sensor_code: string
  sensor_type: string
  installation_date: string
  status: string
  manufacturer: string
  created_at: string
  updated_at: string
}

export type PaginatedSensorResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}