import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyCartPage from 'src/views/pages/my-cart'

const MyCart = () => {
  return <MyCartPage />
}

export default MyCart
// Mặc định thì authGuard là true nên là người dùng không thể nào mà vào được trang cart
MyCart.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
