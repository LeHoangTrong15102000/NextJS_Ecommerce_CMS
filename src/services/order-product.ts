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
  TParamsGetProducts,
  TParamsGetRelatedProduct
} from 'src/types/product'
import axios from 'axios'
import { TParamsCreateOrderProduct, TParamsUpdateOrderProduct, TParamsGetOrderProducts } from 'src/types/order-product'

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

// Get All product order in system by userId

// Get detail product order in system by orderId

// Get all Product order by me
export const getAllOrderProductsByMe = async (data: { params: TParamsGetOrderProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Get details Product order by me
export const getDetailsOrderProductByMe = async (orderId: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/${orderId}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create Product
export const createOrderProduct = async (data: TParamsCreateOrderProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// // Edit Product
export const updateOrderProduct = async (data: TParamsUpdateOrderProduct) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`, rests)
    // console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// // Delete Product
// export const deleteProduct = async (id: string) => {
//   try {
//     const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`)
//     return res.data
//   } catch (error) {
//     console.log('Checkkk Error >>>', error)
//     return error
//   }
// }

// // Delete Multiple Product
// export const deleteMultipleProduct = async (data: TParamsDeleteMultipleProduct) => {
//   try {
//     // Lấy từ query thì là params: data còn lấy từ body thì sẽ là  data: data
//     const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/delete-many`, { data })

//     if (res?.data?.status === 'Success') {
//       return res.data
//     }

//     return {
//       data: null
//     }
//   } catch (error) {
//     console.log('Checkkk Error >>>', error)
//     return error
//   }
// }
