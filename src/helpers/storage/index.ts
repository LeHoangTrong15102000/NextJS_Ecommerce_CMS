import { ACCESS_TOKEN, REFRESH_TOKEN, TEMPORARY_TOKEN, USER_DATA } from 'src/configs/auth'
import { UserDataType } from 'src/contexts/types'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_DATA, userData),
      window.localStorage.setItem(ACCESS_TOKEN, accessToken),
      window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}

//  Trả về những thông tin người dùng
// Lúc đầu là cơ chế SSR nên là nó không hoạt động phải đợi tới lần thứ 2 thì nó mới có thể hoạt động được
export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.getItem(USER_DATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
  }
  return {
    userData: '',
    accessToken: '',
    refreshToken: ''
  }
}

export const clearLocalUserData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_DATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
  }
}

export const setTemporaryToken = (accessToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TEMPORARY_TOKEN, accessToken)
  }
}

//  Trả về những thông tin người dùng
// Lúc đầu là cơ chế SSR nên là nó không hoạt động phải đợi tới lần thứ 2 thì nó mới có thể hoạt động được
export const getTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    return {
      temporaryToken: window.localStorage.getItem(TEMPORARY_TOKEN)
    }
  }
  return {
    temporaryToken: ''
  }
}

export const clearTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TEMPORARY_TOKEN)
  }
}
