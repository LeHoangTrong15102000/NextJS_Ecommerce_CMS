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
  user: string
  product: string
}

export interface TParamsUpdateReviewProduct extends TParamsAddReviewProduct {
  id: string
}

export type TParamsDeleteReviewProduct = {
  reviewId: string
}

export type TParamsDeleteMultipleReviewProduct = {
  reviewIds: string[]
}
