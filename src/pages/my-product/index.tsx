import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProductPage from 'src/views/pages/my-product'
import MyProfilePage from 'src/views/pages/my-profile'

const MyProduct = () => {
  return <MyProductPage />
}

export default MyProduct

MyProduct.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
MyProduct.authGuard = true // Trong trang my-profile thì phải bật authGuard lên
