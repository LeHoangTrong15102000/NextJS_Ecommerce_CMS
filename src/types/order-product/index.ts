export type TItemOrderProduct = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: string // Là idProduct của sản phẩm
  slug: string
}

export type TParamsGetOrderProducts = {}

export type TParamsCreateOrderProduct = {
  orderItems: TItemOrderProduct[]

  fullName: string
  address?: string
  city: string
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
