import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import CheckoutProductpage from 'src/views/pages/checkout-product'

const CheckoutProduct = () => {
  return <CheckoutProductpage />
}

export default CheckoutProduct

CheckoutProduct.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
