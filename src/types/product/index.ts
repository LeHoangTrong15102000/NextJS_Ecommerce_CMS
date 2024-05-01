import { EditorState } from 'draft-js'

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
  location: string
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
  location: string
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

export type TProduct = {
  _id: string
  averageRating: number
  createdAt: Date | null
  image: string
  price: number
  name: string
  slug: string
  sold: number
  totalLike: number
  countInStock: number
  discount: number
  discountStartDate: Date | null
  discountEndDate: Date | null
  totalReviews: number
  location: {
    name: string
    _id: string
  }
}

export type TParamsGetRelatedProduct = {
  limit?: number
  page?: number
  search?: string
  order?: string
  slug: string
}
