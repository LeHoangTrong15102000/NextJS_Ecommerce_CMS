import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

const MyProfile = () => {
  return <MyProfilePage />
}

export default MyProfile

MyProfile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
// Trong trang my-profile thì phải bật authGuard lên
