export type TParamsGetProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateProduct = {
  name: string
  slug: string
  price: number
  image: string
  type: string
  city: string
  countInStock: number
  discount: number
  discountEndDate: Date | null
  discountStartDate: Date | null
  description: string
  status: number
}

export type TParamsEditProduct = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  type: string
  city: string
  countInStock: number
  discount: number
  discountEndDate: Date | null
  discountStartDate: Date | null
  description: string
  status: number
}

export type TParamsDeleteProduct = {
  id: string
}

export type TParamsDeleteMultipleProduct = {
  productIds: string[]
}
