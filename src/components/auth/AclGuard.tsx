// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, AppAbility } from 'src/configs/acl'

//
import BlankLayout from 'src/views/layouts/BlankLayout'

// ** Pages
import NotAuthorized from 'src/pages/401'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { AbilityContext } from '../acl/Can'
import { PERMISSIONS } from 'src/configs/permission'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
  permission?: string[]
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true, permission } = props

  // ** Hooks
  const router = useRouter()
  const auth = useAuth()
  const permissionUser = auth.user?.role?.permissions
    ? auth.user?.role?.permissions?.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : auth?.user?.role?.permissions
    : []

  // const permissionUser = ['SYSTEM.USER.VIEW']
  // console.log('Checkk permissions user', permissionUser, permission)

  // Check thêm điều kiện khi người dùng vào route `/`
  useEffect(() => {
    if (router.route === '/') {
      router.push(path.HOME)
    }
  }, [router])

  // Tạm thời để như vậy xíu nữa quay lại check sau
  let ability: AppAbility

  // Đã đăng nhập rồi và chưa có ability thì sẽ tiến hành build `ability`
  if (auth.user && !ability) {
    // Build Ability trong User
    ability = buildAbilityFor(permissionUser, permission)
  }

  // Check thêm một lần điều kiện nữa
  // if guest guard or no guard is true or any error page
  // Sau này khi mà thằng if này nó không chạy vào được là do không có quyền thực hiện một vài cái `subject` thì nó sẽ nhảy xuống thằng if kia để check xem có quyền thực hiện các action theo subject không
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    // Nếu nó đã đăng nhập rồi và nó đáng build cái quyền của chúng ta rồi thì sẽ return để hạn chế trường hợp nó undefined
    if (auth.user && ability) {
      // Sẽ trả về AbilityContext để sau này sử dụng ở các trang tạo này kia
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // Nếu là guestGuard, không đăng nhập và không có ability thì return về thằng children(đã không đăng nhập thì đâu có role đâu mà check quyền)
      return children
    }
  }

  // Check thêm 1 case user nữa, phải đăng nhập rồi , có ability và phải có  quyền truy cập vào action với thằng subject này
  // Check  access off current user
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    // user hiện tại có quyền truy cập vào cái trang này
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }
  // Sẽ trả về một Ability dạng Map()

  // Nếu như không rơi vào 2 trường hợp thì trả về trang lỗi ở đây
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
