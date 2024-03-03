// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'

// ** views

type TProps = {}

const User: NextPage<TProps> = () => {
  return <h1>User</h1>
}

export default User

// UserSystem.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
// ManageSystem.guestGuard = true
