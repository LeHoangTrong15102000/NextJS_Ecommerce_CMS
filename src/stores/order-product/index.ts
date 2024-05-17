// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {
  cancelOrderProductOfMeAsync,
  createOrderProductAsync,
  deleteOrderProductAsync,
  getAllOrderProductsAsync,
  getAllOrderProductsOfMeAsync,
  getDetailsOrderOfMeAsync,
  ServiceName,
  updateOrderProductAsync
} from 'src/stores/order-product/actions'

const initialState = {
  // State cho giỏ hàng
  orderItems: [],
  isLoading: false,
  isSuccessCreateOrder: false,
  isErrorCreateOrder: false,
  messageErrorCreateOrder: '',
  isSuccessUpdateOrder: false,
  isErrorUpdateOrder: false,
  messageErrorUpdateOrder: '',
  isSuccessDeleteOrder: false,
  isErrorDeleteOrder: false,
  messageErrorDeleteOrder: '',
  isSuccessCancelOrderOfMe: false,
  isErrorCancelOrderOfMe: false,
  messageCancelOrderOfMe: '',
  typeError: '',
  // State cho order of me
  ordersProductOfMe: {
    data: [],
    total: 0
  },
  // State order in system
  ordersProduct: {
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
      state.isSuccessUpdateOrder = false
      state.isErrorUpdateOrder = false
      state.messageErrorUpdateOrder = ''
      state.isSuccessDeleteOrder = false
      state.isErrorDeleteOrder = false
      state.messageErrorDeleteOrder = ''
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

    // builder.addCase(getDetailsOrderOfMeAsync.pending, (state, action) => {
    //   state.isLoading = true
    // })
    // builder.addCase(getDetailsOrderOfMeAsync.fulfilled, (state, action) => {
    //   console.log('Check action all products', { action })
    //   state.isLoading = false
    //   state.ordersProductOfMe.data = action.payload?.data?.orders || []
    //   state.ordersProductOfMe.total = action.payload?.data?.totalCount
    // })
    // builder.addCase(getDetailsOrderOfMeAsync.rejected, (state, action) => {
    //   state.isLoading = false
    //   state.ordersProductOfMe.data = []
    //   state.ordersProductOfMe.total = 0
    // })

    // ** Get All Order Product in system
    builder.addCase(getAllOrderProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderProductsAsync.fulfilled, (state, action) => {
      console.log('Check action all order products', { action })
      state.isLoading = false
      state.ordersProduct.data = action.payload?.data?.orders || []
      state.ordersProduct.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersProduct.data = []
      state.ordersProduct.total = 0
    })

    // ** Update order product
    builder.addCase(updateOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateOrderProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessUpdateOrder = !!action.payload?.data?._id
      state.isErrorUpdateOrder = !action.payload?.data?._id
      state.messageErrorUpdateOrder = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateOrderProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessUpdateOrder = false
      state.isErrorUpdateOrder = true
      state.messageErrorUpdateOrder = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete order product
    builder.addCase(deleteOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteOrderProductAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessDeleteOrder = !!action.payload?.data?._id
      state.isErrorDeleteOrder = !action.payload?.data?._id
      state.messageErrorDeleteOrder = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteOrderProductAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessDeleteOrder = false
      state.isErrorDeleteOrder = true
      state.messageErrorDeleteOrder = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { updateProductToCart, increaseProductOrder, decreaseProductOrder, resetInitialState } =
  orderProductSlice.actions

export default orderProductSlice.reducer
