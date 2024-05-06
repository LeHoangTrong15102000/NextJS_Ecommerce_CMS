export type ErrCallbackType = (err: any) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  _id: string
  role: {
    name: string
    permissions: string[]
  }
  email: string
  fullName: string
  firstName: string
  middleName: string
  lastName: string
  likedProducts: string[]
  // username: string
  password: string
  avatar?: string | null
  city: string
  phoneNumber: string
  address?: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
