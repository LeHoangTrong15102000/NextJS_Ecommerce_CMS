import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyCartPage from 'src/views/pages/my-cart'

const MyCart = () => {
  return <MyCartPage />
}

export default MyCart

MyCart.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
MyCart.authGuard = true // Trong trang my-cart thì phải bật authGuard lên
