// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createOrderProduct,
  getAllOrderProductsByMe,
  getDetailsOrderProductByMe,
  updateOrderProduct
} from 'src/services/order-product'
import { TParamsCreateOrderProduct, TParamsGetOrderProducts, TParamsUpdateOrderProduct } from 'src/types/order-product'

// ** Axios

export const ServiceName = 'orderProduct'

// ** Get All Users
export const getAllOrderProductsAsync = createAsyncThunk(
  `${ServiceName}/get-all-by-me`,
  async (data: { params: TParamsGetOrderProducts }) => {
    const response = await getAllOrderProductsByMe(data)
    return response
  }
)

// ** Get Detail order product
export const getDetailsOrderProductAsync = createAsyncThunk(
  `${ServiceName}/get-detail-by-me`,
  async (orderId: string) => {
    const response = await getDetailsOrderProductByMe(orderId)
    return response
  }
)

// ** Create Order
export const createOrderProductAsync = createAsyncThunk(
  `${ServiceName}/create`,
  async (data: TParamsCreateOrderProduct) => {
    const response = await createOrderProduct(data)
    return response
  }
)

// ** Create Order
export const updateeOrderProductAsync = createAsyncThunk(
  `${ServiceName}/update`,
  async (data: TParamsUpdateOrderProduct) => {
    const response = await updateOrderProduct(data)
    return response
  }
)
