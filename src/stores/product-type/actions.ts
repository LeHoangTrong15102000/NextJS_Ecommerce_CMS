// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

import {
  TParamsCreateProductType,
  TParamsDeleteMultipleProductType,
  TParamsEditProductType,
  TParamsGetProductTypes
} from 'src/types/product-type'
import {
  createProductType,
  deleteMultipleProductType,
  deleteProductType,
  getAllProductTypes,
  updateProductType
} from 'src/services/product-type'

export const ServiceName = 'product-type'

// ** Get All Users
export const getAllProductTypesAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetProductTypes }) => {
    const response = await getAllProductTypes(data)
    return response
  }
)

// ** Create User
export const createProductTypeAsync = createAsyncThunk(
  `${ServiceName}/create`,
  async (data: TParamsCreateProductType) => {
    const response = await createProductType(data)
    return response
  }
)

// ** Update User
export const updateProductTypeAsync = createAsyncThunk(
  `${ServiceName}/update`,
  async (data: TParamsEditProductType) => {
    const response = await updateProductType(data)
    return response
  }
)

// ** Delete User
export const deleteProductTypeAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deleteProductType(id)
  return response
})

// ** Delete many user
export const deleteMultipleProductTypeAsync = createAsyncThunk(
  `${ServiceName}/delete-many`,
  async (data: TParamsDeleteMultipleProductType) => {
    const response = await deleteMultipleProductType(data)
    return response
  }
)
