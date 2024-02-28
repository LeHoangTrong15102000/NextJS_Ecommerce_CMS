import axios from 'axios'

// **  Config
import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

// ** Types
import { TLoginAuth, TRegisterAuth } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)
  return res.data
}

// ** Logout
export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/logout`)
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
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/register`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

export const getMeAuth = async () => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.AUTH.INDEX}/me`)
    return res.data
  } catch (error) {
    console.log('Checkk Error', error)
  }
}

// ** Update Me
export const updateMeAuth = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${CONFIG_API.AUTH.INDEX}/me`, data)
    return res.data
  } catch (error) {
    console.log('Check Error >>>', error)
    return error
  }
}
