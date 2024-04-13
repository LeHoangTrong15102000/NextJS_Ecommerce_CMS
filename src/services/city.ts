// **Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Types
import { convertLength } from '@mui/material/styles/cssUtils'
import { TParamsCreateCity, TParamsDeleteMultipleCity, TParamsEditCity, TParamsGetCities } from 'src/types/city'

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

export const getAllCities = async (data: { params: TParamsGetCities }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.CITY.INDEX}`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create City
export const createCity = async (data: TParamsCreateCity) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.CITY.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Edit City
export const updateCity = async (data: TParamsEditCity) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.CITY.INDEX}/${id}`, rests)
    console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Delete City
export const deleteCity = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.CITY.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}

// Get details City
export const getDetailsCity = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.CITY.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkk error Details Role >>>>', error)
    return error
  }
}

// Delete Multiple City
export const deleteMultipleCity = async (data: TParamsDeleteMultipleCity) => {
  try {
    // Lấy từ query thì là params: data còn lấy từ body thì sẽ là  data: data
    const res = await instanceAxios.delete(`${API_ENDPOINT.CITY.INDEX}/delete-many`, { data })

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
