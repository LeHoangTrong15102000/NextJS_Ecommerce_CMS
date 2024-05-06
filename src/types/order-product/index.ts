export type TItemOrderProduct = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: string
  slug: string
}

export type TParamsGetOrderProducts = {}

export type TParamsCreateOrderProduct = {}

export type TParamsUpdateOrderProduct = {
  id: string
}

export type TParamsDeleteOrderProduct = {}
