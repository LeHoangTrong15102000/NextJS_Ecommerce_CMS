import { useEffect, useState } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from 'src/hooks/useAuth'

type TActions = 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE'

// custom hook permission cho hệ thống phân quyền
export const usePermission = (key: string, actions: TActions[]) => {
  const { user } = useAuth()
  const defaultValue = {
    VIEW: false,
    CREATE: false,
    UPDATE: false,
    DELETE: false
  }

  const getObjectValue = (obj: any, key: string) => {
    const keys = key.split('.')
    let result = obj
    if (keys && !!keys.length) {
      for (const k of keys) {
        // console.log('Checkkk result', { result })
        if (k in result) {
          result = result[k]
        } else {
          return undefined
        }
      }
    }
    return result
  }

  // getObjectValue(PERMISSIONS, key)

  // ** Context
  const userPermission = user?.role?.permissions
  // const userPermission = ['SYSTEM.ROLE.VIEW']
  // ** State
  const [permission, setPermission] = useState(defaultValue)

  useEffect(() => {
    const mapPermission = getObjectValue(PERMISSIONS, key)
    // console.log('Checkk mapPermission', { mapPermission })
    actions.forEach((mode) => {
      if (userPermission?.includes(PERMISSIONS.ADMIN)) {
        defaultValue[mode] = true
      } else if (userPermission?.includes(mapPermission[mode])) {
        defaultValue[mode] = true
      } else {
        defaultValue[mode] = false
      }
    })
    setPermission(defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  return permission
}
