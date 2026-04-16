export type Farm = {
  id: number
  name: string
  location: string
  area_hectares: string
  owner_name: string
  is_active: boolean
  created_by: number | null
  created_by_username: string | null
  created_at: string
  updated_at: string
}

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}