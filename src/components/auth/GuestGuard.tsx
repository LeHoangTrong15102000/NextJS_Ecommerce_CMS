// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Config
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** next lib
import { useRouter } from 'next/router'
import { clearLocalUserData } from 'src/helpers/storage'
import path from 'src/configs/path'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()

  // ổ khóa guestGuard sẽ luôn được bật khi mà user đã đăng nhập(user sẽ bị đá về trang login)
  useEffect(() => {
    // Nếu mà first render chưa xong thì sẽ không chạy đoạn code phía dưới
    if (!router.isReady) {
      return
    }
    if (window.localStorage.getItem(ACCESS_TOKEN) && window.localStorage.getItem(USER_DATA)) {
      router.replace(path.HOME)
    }
  }, [router])

  // Trường hợp này là khi người dùng đang ở trang login và khi người dùng đã đăng nhập rồi mà muốn vào lại trang login
  // Trường hợp 2 là loading là false rồi và user đã có mà chưa qua được trang home  thì nó vẫn hiển thị cái fallback cho chúng ta
  if (authContext.loading || (!authContext.loading && authContext.user !== null)) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
