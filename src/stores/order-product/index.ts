// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { ServiceName } from 'src/stores/order-product/actions'

const initialState = {
  orderItems: []
}

export const orderProductSlice = createSlice({
  name: ServiceName,
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      state.orderItems = action.payload.orderItems
    },
    increaseProductOrder: (state, action) => {},
    decreaseProductOrder: (state, action) => {}
  }
  // extraReducers: (builder) => {}
})

export const { addProductToCart, increaseProductOrder, decreaseProductOrder } = orderProductSlice.actions

export default orderProductSlice.reducer
