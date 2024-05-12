// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { createOrderProductAsync, getAllOrderProductsAsync, ServiceName } from 'src/stores/order-product/actions'

const initialState = {
  orderItems: [],
  isLoading: false,
  isSuccessCreateOrder: false,
  isErrorCreateOrder: false,
  messageErrorCreateOrder: '',
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
      // state.orderItems = []
    }
  },
  extraReducers: (builder) => {
    // ** Get All Order Product by me
    builder.addCase(getAllOrderProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderProductsAsync.fulfilled, (state, action) => {
      console.log('Check action all products', { action })
      state.isLoading = false
      state.ordersProductOfMe.data = action.payload?.data?.orders || []
      state.ordersProductOfMe.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersProductOfMe.data = []
      state.ordersProductOfMe.total = 0
    })
    // ** Get create users
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
  }
})

export const { updateProductToCart, increaseProductOrder, decreaseProductOrder, resetInitialState } =
  orderProductSlice.actions

export default orderProductSlice.reducer
