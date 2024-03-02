// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'

// ** views
import UserLayout from 'src/views/layouts/UserLayout'

// type TProps = {}

const ManageSystem: NextPage = () => {
  return <></>
}

export default ManageSystem

ManageSystem.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
// ManageSystem.guestGuard = true
