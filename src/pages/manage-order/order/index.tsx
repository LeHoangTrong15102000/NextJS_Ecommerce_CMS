import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import OrderProductListPage from 'src/views/pages/manage-order/order-product/OrderProductList'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Order: NextPage<TProps> = () => {
  return <OrderProductListPage />
}

// Thì nó phải có permission là VIEW thì mới được vào trang order-product này
Order.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Order
