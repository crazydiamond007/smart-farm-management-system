export type FieldRecord = {
  id: number
  farm: number
  farm_name: string
  name: string
  size_hectares: string
  soil_type: string
  irrigation_type: string
  status: string
  created_at: string
  updated_at: string
}

export type PaginatedFieldResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}