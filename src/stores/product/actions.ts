// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

import {
  TParamsCreateProduct,
  TParamsDeleteMultipleProduct,
  TParamsEditProduct,
  TParamsGetProducts
} from 'src/types/product'
import {
  createProduct,
  deleteMultipleProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsLiked,
  getAllProductsViewed,
  likeProduct,
  unlikeProduct,
  updateProduct
} from 'src/services/product'

export const ServiceName = 'product'

// ** Get All Users
export const getAllProductsAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetProducts }) => {
    const response = await getAllProducts(data)
    return response
  }
)

// ** Create User
export const createProductAsync = createAsyncThunk(`${ServiceName}/create`, async (data: TParamsCreateProduct) => {
  const response = await createProduct(data)
  return response
})

// ** Update User
export const updateProductAsync = createAsyncThunk(`${ServiceName}/update`, async (data: TParamsEditProduct) => {
  const response = await updateProduct(data)
  return response
})

// ** Delete User
export const deleteProductAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deleteProduct(id)
  return response
})

// ** Delete many user
export const deleteMultipleProductAsync = createAsyncThunk(
  `${ServiceName}/delete-many`,
  async (data: TParamsDeleteMultipleProduct) => {
    const response = await deleteMultipleProduct(data)
    return response
  }
)

// ** Like Product
export const likeProductAsync = createAsyncThunk(`${ServiceName}/like`, async (data: { productId: string }) => {
  const response = await likeProduct(data)
  return response
})

// ** Unlike Product
export const unlikeProductAsync = createAsyncThunk(`${ServiceName}/unlike`, async (data: { productId: string }) => {
  const response = await unlikeProduct(data)
  return response
})

export const getAllProductsViewedAsync = createAsyncThunk(
  `${ServiceName}/get-all-viewed`,
  async (data: { params: TParamsGetProducts }) => {
    const response = await getAllProductsViewed(data)
    return response
  }
)

export const getAllProductsLikedAsync = createAsyncThunk(
  `${ServiceName}/get-all-liked`,
  async (data: { params: TParamsGetProducts }) => {
    const response = await getAllProductsLiked(data)
    return response
  }
)
