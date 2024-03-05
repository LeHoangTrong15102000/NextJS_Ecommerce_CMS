import axios from 'axios'

// **  Config
import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

// ** Types
import { TChangePassword, TLoginAuth, TRegisterAuth } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data)
  return res.data
}

// ** Logout
export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.AUTH.INDEX}/logout`)
    return res.data
  } catch (error) {
    console.log('>>> Check error', error)
    return null
  }
}

// ** Register
// Đối với những thằng action thì try catch nên bọc ở ngoài
export const registerAuth = async (data: TRegisterAuth) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

export const getMeAuth = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.INDEX}/me`)
    return res.data
  } catch (error) {
    console.log('Checkk Error', error)
  }
}

// ** Update Me
export const updateMeAuth = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.AUTH.INDEX}/me`, data)
    return res.data
  } catch (error) {
    console.log('Check Error >>>', error)
    return error
  }
}

export const changePasswordMe = async (data: TChangePassword) => {
  try {
    const res = await instanceAxios.patch(`${API_ENDPOINT.AUTH.INDEX}/change-password`, data)

    return res.data
  } catch (error) {
    console.log('Check Error >>>', error)
    return error
  }
}
