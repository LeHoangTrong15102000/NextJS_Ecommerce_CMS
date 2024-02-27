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

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGuard = (props: NoGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()

  if (authContext.loading) {
    return fallback
  }

  return <>{children}</>
}

export default NoGuard
