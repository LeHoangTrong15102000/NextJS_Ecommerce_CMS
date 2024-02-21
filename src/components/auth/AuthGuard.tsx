// ** React Imports
import { useRouter } from 'next/router'

import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'
import path from 'src/configs/path'
import { clearLocalUserData } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
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
      !window.localStorage.getItem(USER_DATA)
    ) {
      if (router.asPath !== path.home) {
        router.replace({
          pathname: path.login,
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace(path.login)
      }
      authContext.setUser(null)
      clearLocalUserData()
    }
  }, [authContext, router])

  if (authContext.loading || authContext.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
