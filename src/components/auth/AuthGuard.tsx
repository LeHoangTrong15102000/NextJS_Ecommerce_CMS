// ** React Imports
import { useRouter } from 'next/router'

import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'
import path from 'src/configs/path'
import { clearLocalUserData, clearTemporaryToken, getTemporaryToken } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { temporaryToken } = getTemporaryToken()
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (
      authContext.user === null &&
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      !window.localStorage.getItem(USER_DATA) &&
      !temporaryToken
    ) {
      if (router.asPath !== path.HOME && router.asPath !== path.LOGIN) {
        router.replace({
          pathname: path.LOGIN,
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace(path.LOGIN)
      }
      // set về null và clearLocalStorage cho chắc để mà người dùng đăng nhập
      authContext.setUser(null)
      clearLocalUserData()
    }
  }, [router, temporaryToken])

  // Clear đi temporaryToken mỗi khi reload lại trang
  useEffect(() => {
    const handleUnload = () => {
      clearTemporaryToken()
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  // Trường hợp đầu tiên là đang lấy ra authContext(do first render)
  // Và khi user === null
  if (authContext.loading || authContext.user === null) {
    return fallback
  }

  // Sau khi đã chạy qua được 2 thằng if ở trên thì nó sẽ return về children
  return <>{children}</>
}

export default AuthGuard
