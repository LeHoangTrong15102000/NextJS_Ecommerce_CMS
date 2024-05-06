// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrderProduct, updateOrderProduct } from 'src/services/order-product'
import { TParamsCreateOrderProduct, TParamsUpdateOrderProduct } from 'src/types/order-product'

// ** Axios

export const ServiceName = 'orderProduct'

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
