// **Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Types
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'
import { convertLength } from '@mui/material/styles/cssUtils'

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

export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create Role
export const createRole = async (data: TParamsCreateRole) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.ROLE.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Edit Role
export const updateRole = async (data: TParamsEditRole) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.ROLE.INDEX}/${id}`, rests)
    console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Delete Role
export const deleteRole = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.ROLE.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}

// Get details role
export const getDetailsRole = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkk error Details Role >>>>', error)
    return error
  }
}
