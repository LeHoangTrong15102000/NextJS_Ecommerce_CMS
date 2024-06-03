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
