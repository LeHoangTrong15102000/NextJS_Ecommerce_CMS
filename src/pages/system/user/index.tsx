// ** Import Next
import { NextPage } from 'next'

//  ** Config permission
import { PERMISSIONS } from 'src/configs/permission'

// ** Page
import UserListPage from 'src/views/pages/system/user/UserList'

// ** views

type TProps = {}

const User: NextPage<TProps> = () => {
  return <UserListPage />
}

User.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default User

// UserSystem.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
// ManageSystem.guestGuard = true
