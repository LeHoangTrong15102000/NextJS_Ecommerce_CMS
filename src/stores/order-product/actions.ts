// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  cancelOrderProduct,
  createOrderProduct,
  deleteOrderProduct,
  getAllOrderProducts,
  getAllOrderProductsByMe,
  getDetailsOrderProduct,
  getDetailsOrderProductByMe,
  updateOrderProduct
} from 'src/services/order-product'
import { TParamsCreateOrderProduct, TParamsGetOrderProducts, TParamsUpdateOrderProduct } from 'src/types/order-product'

// ** Axios

export const ServiceName = 'orderProduct'

// ** Get All Users
export const getAllOrderProductsOfMeAsync = createAsyncThunk(
  `${ServiceName}/get-all-of-me`,
  async (data: { params: TParamsGetOrderProducts }) => {
    const response = await getAllOrderProductsByMe(data)
    return response
  }
)

// ** Get Detail order product
export const getDetailsOrderOfMeAsync = createAsyncThunk(
  `${ServiceName}/get-detail-order-of-me`,
  async (orderId: string) => {
    const response = await getDetailsOrderProductByMe(orderId)
    return response
  }
)

// ** Create Order
export const createOrderProductAsync = createAsyncThunk(
  `${ServiceName}/create-order`,
  async (data: TParamsCreateOrderProduct) => {
    const response = await createOrderProduct(data)
    return response
  }
)

// ** Create Order
// export const updateOrderProductOfMeAsync = createAsyncThunk(
//   `${ServiceName}/update-order-product-of-me`,
//   async (data: TParamsUpdateOrderProduct) => {
//     const response = await updateOrderProduct(data)
//     return response
//   }
// )

// ** Create Order
export const cancelOrderProductOfMeAsync = createAsyncThunk(
  `${ServiceName}/cancel-order-product-of-me`,
  async (idOrder: string) => {
    const response = await cancelOrderProduct(idOrder)
    return response
  }
)

// ** Get All order product
export const getAllOrderProductsAsync = createAsyncThunk(
  `${ServiceName}/get-all-order`,
  async (data: { params: TParamsGetOrderProducts }) => {
    const response = await getAllOrderProducts(data)
    return response
  }
)

// Update Order products
// ** Update User
export const updateOrderProductAsync = createAsyncThunk(
  `${ServiceName}/update-order`,
  async (data: TParamsUpdateOrderProduct) => {
    const response = await updateOrderProduct(data)
    return response
  }
)

// get details order product
export const getDetaillsOrderProductAsync = createAsyncThunk(
  `${ServiceName}/get-detail-order`,
  async (orderId: string) => {
    const response = await getDetailsOrderProduct(orderId)
    return response
  }
)

// ** Delete order product
export const deleteOrderProductAsync = createAsyncThunk(`${ServiceName}/delete`, async (orderId: string) => {
  const response = await deleteOrderProduct(orderId)
  return response
})

// ** Delete many user
// export const deleteMultipleOrderProductAsync = createAsyncThunk(
//   `${ServiceName}/delete-many-order`,
//   async (data: TParamsDeleteMultipleProduct) => {
//     const response = await deleteMultipleProduct(data)
//     return response
//   }
// )
