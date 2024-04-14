import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'
import PaymentTypeListPage from 'src/views/pages/settings/payment-method/PaymentTypeList'

type TProps = {}

const Payment: NextPage<TProps> = () => {
  return <PaymentTypeListPage />
}

export default Payment
