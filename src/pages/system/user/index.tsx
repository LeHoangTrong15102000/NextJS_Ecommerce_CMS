// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** views

type TProps = {}

const User: NextPage<TProps> = () => {
  return <h1>User</h1>
}

User.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default User

// UserSystem.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
// ManageSystem.guestGuard = true
