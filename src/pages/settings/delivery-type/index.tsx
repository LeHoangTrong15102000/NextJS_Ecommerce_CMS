import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'
import DeliveryTypeListPage from 'src/views/pages/settings/delivery-method/DeliveryTypeList'

type TProps = {}

const Delivery: NextPage<TProps> = () => {
  return <DeliveryTypeListPage />
}

export default Delivery
