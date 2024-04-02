import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Order: NextPage<TProps> = () => {
  return <h1>Order</h1>
}

Order.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Order
