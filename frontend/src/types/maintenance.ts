export type MaintenanceTaskRecord = {
  id: number
  farm: number
  farm_name: string
  sensor: number | null
  sensor_code: string | null
  title: string
  description: string
  assigned_to: number | null
  assigned_to_username: string | null
  due_date: string | null
  priority: string
  status: string
  created_at: string
  updated_at: string
}

export type PaginatedMaintenanceResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}