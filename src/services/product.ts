// **Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Types
import { convertLength } from '@mui/material/styles/cssUtils'

import {
  TParamsCreateProductType,
  TParamsDeleteMultipleProductType,
  TParamsEditProductType,
  TParamsGetProductTypes
} from 'src/types/product-type'
import {
  TParamsCreateProduct,
  TParamsDeleteMultipleProduct,
  TParamsEditProduct,
  TParamsGetProducts
} from 'src/types/product'

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

export const getAllProducts = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create City
export const createProduct = async (data: TParamsCreateProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Edit City
export const updateProduct = async (data: TParamsEditProduct) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`, rests)
    console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Delete City
export const deleteProduct = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}

// Get details City
export const getDetailsProduct = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkk error Details Role >>>>', error)
    return error
  }
}

// Delete Multiple City
export const deleteMultipleProduct = async (data: TParamsDeleteMultipleProduct) => {
  try {
    // Lấy từ query thì là params: data còn lấy từ body thì sẽ là  data: data
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/delete-many`, { data })

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
