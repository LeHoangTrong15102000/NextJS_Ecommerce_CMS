export type TParamsGetReviewProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateReviewProduct = {}

export type TParamsAddReviewProduct = {
  content: string
  star: number
  user?: string
  product?: string
}

export interface TParamsUpdateReviewProduct {
  id: string
  content: string
  star: number
}

export type TParamsDeleteReviewProduct = {
  reviewId: string
}

export type TParamsDeleteMultipleReviewProduct = {
  reviewIds: string[]
}

export type TReviewItem = {
  _id: string
  user: {
    firstName: string
    lastName: string
    middleName: string
    avatar: string
  }
  product: {
    id: string
    name: string
  }
  content: string
  star: number
  updatedAt: Date
}
