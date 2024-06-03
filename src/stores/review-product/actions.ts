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
import {
  TParamsAddReviewProduct,
  TParamsDeleteMultipleReviewProduct,
  TParamsGetReviewProducts,
  TParamsUpdateReviewProduct
} from 'src/types/review-product'
import {
  addReviewProduct,
  deleteMultipleReview,
  deleteMyReview,
  deleteReview,
  getAllReviews,
  getDetailsReview,
  updateMyReview,
  updateReview
} from 'src/services/review-product'

// ** Axios

export const ServiceName = 'reviewProduct'

// ** Get All Users
export const getAllReviewProductsAsync = createAsyncThunk(
  `${ServiceName}/get-all-review`,
  async (data: { params: TParamsGetReviewProducts }) => {
    const response = await getAllReviews(data)
    return response
  }
)

// ** Get Detail order product
export const getDetailsReviewAsync = createAsyncThunk(`${ServiceName}/get-detail-review`, async (reviewId: string) => {
  const response = await getDetailsReview(reviewId)
  return response
})

// ** Create Order
export const addReviewProductAsync = createAsyncThunk(
  `${ServiceName}/add-review`,
  async (data: TParamsAddReviewProduct) => {
    const response = await addReviewProduct(data)
    return response
  }
)

// Update Order review
// ** Update User
export const updateMyReviewProductAsync = createAsyncThunk(
  `${ServiceName}/update-my-review`,
  async (data: TParamsUpdateReviewProduct) => {
    const response = await updateMyReview(data)
    return response
  }
)

// ** Delete order product
export const deleteMyReviewProductAsync = createAsyncThunk(
  `${ServiceName}/delete-my-review`,
  async (reviewId: string) => {
    const response = await deleteMyReview(reviewId)
    return response
  }
)

// Update Order review
// ** Update User
export const updateReviewProductAsync = createAsyncThunk(
  `${ServiceName}/update-review`,
  async (data: TParamsUpdateReviewProduct) => {
    const response = await updateReview(data)
    return response
  }
)

// ** Delete order review
export const deleteReviewProductAsync = createAsyncThunk(`${ServiceName}/delete-review`, async (reviewId: string) => {
  const response = await deleteReview(reviewId)
  return response
})

// ** Delete many user
export const deleteMultipleReviewProductAsync = createAsyncThunk(
  `${ServiceName}/delete-many-review`,
  async (data: TParamsDeleteMultipleReviewProduct) => {
    const response = await deleteMultipleReview(data)
    return response
  }
)
