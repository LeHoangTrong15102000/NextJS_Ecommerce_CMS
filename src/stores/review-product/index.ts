// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import {
  addReviewProductAsync,
  deleteMultipleReviewProductAsync,
  deleteMyReviewProductAsync,
  deleteReviewProductAsync,
  getAllReviewProductsAsync,
  ServiceName,
  updateMyReviewProductAsync,
  updateReviewProductAsync
} from 'src/stores/review-product/actions'

const initialState = {
  // State cho giỏ hàng
  isLoading: false,
  isSuccessAddReview: false,
  isErrorAddReview: false,
  messageErrorAddReview: '',
  isSuccessUpdateReview: false,
  isErrorUpdateReview: false,
  messageErrorUpdateReview: '',
  isSuccessDeleteReview: false,
  isErrorDeleteReview: false,
  messageErrorDeleteReview: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  typeError: '',
  // State cho order of me
  reviewsProduct: {
    data: [],
    total: 0
  }
}

export const reviewProductSlice = createSlice({
  name: ServiceName,
  initialState,
  reducers: {
    resetInitialState: (state) => {
      state.isLoading = false
      state.isSuccessAddReview = false
      state.isErrorAddReview = false
      state.messageErrorAddReview = ''
      state.isSuccessUpdateReview = false
      state.isErrorUpdateReview = false
      state.messageErrorUpdateReview = ''
      state.isSuccessDeleteReview = false
      state.isErrorDeleteReview = false
      state.messageErrorDeleteReview = ''
      state.typeError = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.messageErrorMultipleDelete = ''
      // state.orderItems = []
    }
  },
  extraReducers: (builder) => {
    // ** Get All Review product
    builder.addCase(getAllReviewProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllReviewProductsAsync.fulfilled, (state, action) => {
      console.log('Check action all products', { action })
      state.isLoading = false
      state.reviewsProduct.data = action.payload?.data?.reviews || []
      state.reviewsProduct.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllReviewProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.reviewsProduct.data = []
      state.reviewsProduct.total = 0
    })
    // ** Create order product
    builder.addCase(addReviewProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(addReviewProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessAddReview = !!action.payload?.data?._id
      state.isErrorAddReview = !action.payload?.data?._id
      state.messageErrorAddReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // Do thằng typescript nó check type của thằng action này có đúng hay không
    builder.addCase(addReviewProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessAddReview = false
      state.isErrorAddReview = true
      state.messageErrorAddReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Update review product
    builder.addCase(updateReviewProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateReviewProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessUpdateReview = !!action.payload?.data?._id
      state.isErrorUpdateReview = !action.payload?.data?._id
      state.messageErrorUpdateReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateReviewProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessUpdateReview = false
      state.isErrorUpdateReview = true
      state.messageErrorUpdateReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Update my review product
    builder.addCase(updateMyReviewProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateMyReviewProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessUpdateReview = !!action.payload?.data?._id
      state.isErrorUpdateReview = !action.payload?.data?._id
      state.messageErrorUpdateReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateMyReviewProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessUpdateReview = false
      state.isErrorUpdateReview = true
      state.messageErrorUpdateReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete review product
    builder.addCase(deleteReviewProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteReviewProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessDeleteReview = !!action.payload?.data?._id
      state.isErrorDeleteReview = !action.payload?.data?._id
      state.messageErrorDeleteReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteReviewProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessDeleteReview = false
      state.isErrorDeleteReview = true
      state.messageErrorDeleteReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete my review product
    builder.addCase(deleteMyReviewProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMyReviewProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessDeleteReview = !!action.payload?.data?._id
      state.isErrorDeleteReview = !action.payload?.data?._id
      state.messageErrorDeleteReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteMyReviewProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessDeleteReview = false
      state.isErrorDeleteReview = true
      state.messageErrorDeleteReview = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete multiple review product
    builder.addCase(deleteMultipleReviewProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleReviewProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action.payload?.data?._id
      state.isErrorMultipleDelete = !action.payload?.data?._id
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteMultipleReviewProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = true
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = reviewProductSlice.actions

export default reviewProductSlice.reducer
