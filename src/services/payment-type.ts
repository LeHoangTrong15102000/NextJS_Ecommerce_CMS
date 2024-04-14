// **Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Types
import { convertLength } from '@mui/material/styles/cssUtils'

import {
  TParamsCreateDeliveryType,
  TParamsDeleteMultipleDeliveryType,
  TParamsEditDeliveryType,
  TParamsGetDeliveryTypes
} from 'src/types/delivery-type'
import {
  TParamsCreatePaymentType,
  TParamsDeleteMultiplePaymentType,
  TParamsEditPaymentType,
  TParamsGetPaymentTypes
} from 'src/types/payment-type'

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

export const getAllPaymentTypes = async (data: { params: TParamsGetPaymentTypes }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTING.PAYMENT_TYPE.INDEX}`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create City
export const createPaymentType = async (data: TParamsCreatePaymentType) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.SETTING.PAYMENT_TYPE.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Edit City
export const updatePaymentType = async (data: TParamsEditPaymentType) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.SETTING.PAYMENT_TYPE.INDEX}/${id}`, rests)
    console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Delete City
export const deletePaymentType = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTING.PAYMENT_TYPE.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}

// Get details City
export const getDetailsPaymentType = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SETTING.PAYMENT_TYPE.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkk error Details Role >>>>', error)
    return error
  }
}

// Delete Multiple City
export const deleteMultiplePaymentType = async (data: TParamsDeleteMultiplePaymentType) => {
  try {
    // Lấy từ query thì là params: data còn lấy từ body thì sẽ là  data: data
    const res = await instanceAxios.delete(`${API_ENDPOINT.SETTING.PAYMENT_TYPE.INDEX}/delete-many`, { data })

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
