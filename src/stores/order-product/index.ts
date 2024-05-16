// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {
  cancelOrderProductOfMeAsync,
  createOrderProductAsync,
  getAllOrderProductsOfMeAsync,
  getDetailsOrderOfMeAsync,
  ServiceName
} from 'src/stores/order-product/actions'

const initialState = {
  orderItems: [],
  isLoading: false,
  isSuccessCreateOrder: false,
  isErrorCreateOrder: false,
  messageErrorCreateOrder: '',
  isSuccessCancelOrderOfMe: false,
  isErrorCancelOrderOfMe: false,
  messageCancelOrderOfMe: '',
  typeError: '',
  ordersProductOfMe: {
    data: [],
    total: 0
  }
}

export const orderProductSlice = createSlice({
  name: ServiceName,
  initialState,
  reducers: {
    updateProductToCart: (state, action) => {
      state.orderItems = action.payload.orderItems
    },
    increaseProductOrder: (state, action) => {},
    decreaseProductOrder: (state, action) => {},
    resetInitialState: (state) => {
      state.isLoading = false
      state.isSuccessCreateOrder = false
      state.isErrorCreateOrder = false
      state.messageErrorCreateOrder = ''
      state.typeError = ''
      state.isSuccessCancelOrderOfMe = false
      state.isErrorCancelOrderOfMe = false
      state.messageCancelOrderOfMe = ''
      // state.orderItems = []
    }
  },
  extraReducers: (builder) => {
    // ** Get All Order Product by me
    builder.addCase(getAllOrderProductsOfMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderProductsOfMeAsync.fulfilled, (state, action) => {
      console.log('Check action all products', { action })
      state.isLoading = false
      state.ordersProductOfMe.data = action.payload?.data?.orders || []
      state.ordersProductOfMe.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsOfMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersProductOfMe.data = []
      state.ordersProductOfMe.total = 0
    })
    // ** Create order product
    builder.addCase(createOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createOrderProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateOrder = !!action.payload?.data?._id
      state.isErrorCreateOrder = !action.payload?.data?._id
      state.messageErrorCreateOrder = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // Do thằng typescript nó check type của thằng action này có đúng hay không
    builder.addCase(createOrderProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateOrder = false
      state.isErrorCreateOrder = true
      state.messageErrorCreateOrder = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Cancel order product of me
    builder.addCase(cancelOrderProductOfMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(cancelOrderProductOfMeAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCancelOrderOfMe = !!action.payload?.data?._id
      state.isErrorCancelOrderOfMe = !action.payload?.data?._id
      state.messageCancelOrderOfMe = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // Do thằng typescript nó check type của thằng action này có đúng hay không
    builder.addCase(cancelOrderProductOfMeAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCancelOrderOfMe = false
      state.isErrorCancelOrderOfMe = true
      state.messageCancelOrderOfMe = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // Get Details order of me async

    builder.addCase(getDetailsOrderOfMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getDetailsOrderOfMeAsync.fulfilled, (state, action) => {
      console.log('Check action all products', { action })
      state.isLoading = false
      state.ordersProductOfMe.data = action.payload?.data?.orders || []
      state.ordersProductOfMe.total = action.payload?.data?.totalCount
    })
    builder.addCase(getDetailsOrderOfMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersProductOfMe.data = []
      state.ordersProductOfMe.total = 0
    })
  }
})

export const { updateProductToCart, increaseProductOrder, decreaseProductOrder, resetInitialState } =
  orderProductSlice.actions

export default orderProductSlice.reducer
