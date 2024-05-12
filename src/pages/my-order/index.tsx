import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyCartPage from 'src/views/pages/my-cart'
import MyOrderPage from 'src/views/pages/my-order'

const MyOrder = () => {
  return <MyOrderPage />
}

export default MyOrder
// Mặc định thì authGuard là true nên là người dùng không thể nào mà vào được trang cart
MyOrder.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
