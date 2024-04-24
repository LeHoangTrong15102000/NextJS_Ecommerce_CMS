import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'
import DetailsProductPage from 'src/views/pages/product/DetailsProduct'

const DetailsProduct = () => {
  return <DetailsProductPage />
}

export default DetailsProduct

DetailsProduct.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
DetailsProduct.guestGuard = true // Trong trang my-profile thì phải bật authGuard lên
