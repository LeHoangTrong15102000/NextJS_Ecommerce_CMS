export type TParamsGetCities = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateCity = {
  firstName?: string
  middleName?: string
  lastName?: string
  email: string
  password: string
  role: string
  phoneNumber: string
  city?: string
  address?: string
  avatar?: string
  status?: number
}

export type TParamsEditCity = {
  id: string
  firstName?: string
  middleName?: string
  lastName?: string
  password?: string
  email: string
  role: string
  phoneNumber: string
  city?: string
  address?: string
  avatar?: string
  status?: number
}

export type TParamsDeleteCity = {
  id: string
}

export type TParamsDeleteMultipleCity = {
  cityIds: string[]
}
