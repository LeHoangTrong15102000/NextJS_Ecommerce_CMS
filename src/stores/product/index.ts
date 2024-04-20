// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  createProductAsync,
  deleteMultipleProductAsync,
  deleteProductAsync,
  getAllProductsAsync,
  ServiceName,
  updateProductAsync
} from './actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  products: {
    data: [],
    total: 0 // số lượng record có trong role của chúng ta, để chúng ta biết số lượng record để mà còn phân trang ở đây
  }
}

export const productSlice = createSlice({
  name: ServiceName,
  initialState,
  reducers: {
    resetInitialState: (state) => {
      state.isLoading = false
      state.isSuccess = true
      state.isError = false
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.messageErrorCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageErrorDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.messageErrorMultipleDelete = ''
    }
  },
  extraReducers: (builder) => {
    // ** Get All Roles
    builder.addCase(getAllProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllProductsAsync.fulfilled, (state, action) => {
      console.log('Check action all products', { action })
      state.isLoading = false
      state.products.data = action.payload?.data?.products || []
      state.products.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.products.data = []
      state.products.total = 0
    })

    // ** Get create users
    builder.addCase(createProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // Do thằng typescript nó check type của thằng action này có đúng hay không
    builder.addCase(createProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Get update users
    builder.addCase(updateProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete User
    builder.addCase(deleteProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete multiple users
    builder.addCase(deleteMultipleProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleProductAsync.fulfilled, (state, action) => {
      console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action.payload?.status
      state.isErrorMultipleDelete = !action.payload?.status
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteMultipleProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = true
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = productSlice.actions

export default productSlice.reducer
