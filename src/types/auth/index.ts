export type TLoginAuth = {
  email: string
  password: string
}

export type TRegisterAuth = {
  email: string
  password: string
  confirmPassword: string
}

export type TUpdateMeAuth = {}

export type TChangePassword = {
  currentPassword: string
  newPassword: string

}
