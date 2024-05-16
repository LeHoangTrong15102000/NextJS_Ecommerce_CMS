import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyOrderDetailsPage from 'src/views/pages/my-order/DetailsOrder'

const MyOrderDetail = () => {
  return <MyOrderDetailsPage />
}

export default MyOrderDetail
// Mặc định thì authGuard là true nên là người dùng không thể nào mà vào được trang cart
MyOrderDetail.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
