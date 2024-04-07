export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateUser = {
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

export type TParamsEditUser = {
  id: string
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

export type TParamsDeleteUser = {
  id: string
}
