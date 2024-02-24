import React, { ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'

const MyProfile = () => {
  return <div>My Profile User</div>
}

export default MyProfile

MyProfile.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
