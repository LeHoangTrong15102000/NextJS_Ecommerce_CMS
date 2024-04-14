import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'
import DeliveryTypeListPage from 'src/views/pages/settings/delivery-method/DeliveryTypeList'

type TProps = {}

const Delivery: NextPage<TProps> = () => {
  return <DeliveryTypeListPage />
}

Delivery.permission = [PERMISSIONS.SETTING.DELIVERY_TYPE.VIEW]
export default Delivery
