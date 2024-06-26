// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import auth from 'src/stores/auth'
import role from 'src/stores/role'
import user from 'src/stores/user'
import city from 'src/stores/city'
import deliveryType from 'src/stores/delivery-type'
import paymentType from 'src/stores/payment-type'
import productType from 'src/stores/product-type'
import product from 'src/stores/product'
import orderProduct from 'src/stores/order-product'
import reviewProduct from 'src/stores/review-product'

export const store = configureStore({
  reducer: {
    auth,
    role,
    user,
    city,
    deliveryType,
    paymentType,
    productType,
    product,
    orderProduct,
    reviewProduct
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
