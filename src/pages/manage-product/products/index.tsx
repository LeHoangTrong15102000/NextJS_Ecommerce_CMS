import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Product: NextPage<TProps> = () => {
  return <h1>Product</h1>
}
Product.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default Product
