export type TItemOrderProduct = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: string // Là idProduct của sản phẩm
  slug: string
}

export type TItemOrderProductOfMe = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: {
    _id: string
    countInStock: number
    slug: string
  }
}

export type TParamsGetOrderProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateOrderProduct = {
  // orderItems là mảng chứa các phần tử TItemOrderProduct
  orderItems: TItemOrderProduct[]

  fullName: string
  address?: string
  city: {
    _id: string
    name: string
  }
  phone: string

  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  user: string
  deliveryMethod: string
  // isPaid: number
  // paidAt: Date | null
  // isDelivered: number
  // deliveredAt: Date | null
  // status: number
}

export type TParamsUpdateOrderProduct = {
  id: string
}

export type TParamsDeleteOrderProduct = {}

export type TCardOrderProductMe = {
  _id: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: number
  }
  orderItems: TItemOrderProductOfMe[]
  paymentMethod: {
    _id: string
    name: string
    type: string
  }
  deliveryMethod: {
    _id: string
    name: string
    price: number
  }
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  user: {
    _id: string
    firstName: string
    lastName: string
    middleName: string
  }
  isPaid: number
  isDeliveries: number
  status: number
}
