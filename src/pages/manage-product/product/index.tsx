import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ProductListPage from 'src/views/pages/manage-product/product/ProductList'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Product: NextPage<TProps> = () => {
  return <ProductListPage />
}
Product.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default Product
