export type CropTypeRecord = {
  id: number
  name: string
  scientific_name: string
  ideal_temperature_min: string | null
  ideal_temperature_max: string | null
  notes: string
  created_at: string
  updated_at: string
}

export type PlantingRecord = {
  id: number
  field: number
  field_name: string
  farm_name: string
  crop_type: number
  crop_type_name: string
  planting_date: string
  expected_harvest_date: string | null
  actual_harvest_date: string | null
  planted_area_hectares: string
  status: string
  created_by: number | null
  created_at: string
  updated_at: string
}

export type PaginatedPlantingResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}