// **Axios
import instanceAxios from 'src/helpers/axios'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'

// ** Types

import {
  TParamsAddReviewProduct,
  TParamsDeleteMultipleReviewProduct,
  TParamsGetReviewProducts,
  TParamsUpdateReviewProduct
} from 'src/types/review-product'

export const getAllReviews = async (data: { params: TParamsGetReviewProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}`, data)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Create Review
export const updateMyReview = async (data: TParamsUpdateReviewProduct) => {
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/me`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

export const deleteMyReview = async (reviewId: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/me/${reviewId}`)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Create Review
export const addReviewProduct = async (data: TParamsAddReviewProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}`, data)
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Get detail review
export const getDetailsReview = async (reviewId: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${reviewId}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error>>>', error)
    return error
  }
}

// Edit Product
export const updateReview = async (data: TParamsUpdateReviewProduct) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${id}`, rests)
    // console.log('Checkkkk res update roles', { res })
    return res.data
  } catch (error: any) {
    console.log('Checkkk Error >>>', error)
    return error?.response?.data
  }
}

// Delete Product
export const deleteReview = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${id}`)
    return res.data
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}

// Delete Multiple Review
export const deleteMultipleReview = async (data: TParamsDeleteMultipleReviewProduct) => {
  try {
    // Lấy từ query thì là params: data còn lấy từ body thì sẽ là  data: data
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/delete-many`, { data })

    if (res?.data?.status === 'Success') {
      return res.data
    }

    return {
      data: null
    }
  } catch (error) {
    console.log('Checkkk Error >>>', error)
    return error
  }
}
