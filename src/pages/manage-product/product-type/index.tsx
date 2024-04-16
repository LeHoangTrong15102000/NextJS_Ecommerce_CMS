import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ProductTypeListPage from 'src/views/pages/manage-product/product-type/ProductTypeList'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const ProductType: NextPage<TProps> = () => {
  return <ProductTypeListPage />
}

ProductType.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.VIEW]
export default ProductType
