// **Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Types
import { convertLength } from '@mui/material/styles/cssUtils'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

// ** Get All Roles
// export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
//   try {
//     const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}`, data)
//     return res.data
//   } catch (error) {
//     console.log('Checkkk Error>>>', error)
//     return error
//   }
// }

export const getAllUsers = async (data: { params: TParamsGetUsers }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.USER.INDEX}`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create User
export const createUser = async (data: TParamsCreateUser) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.SYSTEM.USER.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Edit User
export const updateUser = async (data: TParamsEditUser) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`, rests)
    console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Delete User
export const deleteUser = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}

// Get details User
export const getDetailsUser = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkk error Details Role >>>>', error)
    return error
  }
}

// Delete Multiple User
export const deleteMultipleUser = async (data: TParamsDeleteMultipleUser) => {
  try {
    // Lấy từ query thì là params: data còn lấy từ body thì sẽ là  data: data
    const res = await instanceAxios.delete(`${API_ENDPOINT.SYSTEM.USER.INDEX}/delete-many`, { data })

    if (res?.data?.status === 'Success') {
      return res.data
    }

    return {
      data: null
    }
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}
