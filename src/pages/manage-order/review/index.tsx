import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ReviewProductListPage from 'src/views/pages/manage-order/reviews/ReviewOrderList'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Review: NextPage<TProps> = () => {
  return <ReviewProductListPage />
}

// Review.permission = [PERMISSIONS.MANAGE_ORDER.REVIEW.VIEW]
export default Review
