import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'
import DetailsProductPage from 'src/views/pages/product/DetailsProduct'

const DetailsProduct = () => {
  return <DetailsProductPage />
}

export default DetailsProduct

DetailsProduct.authGuard = false
DetailsProduct.guestGuard = false
DetailsProduct.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
