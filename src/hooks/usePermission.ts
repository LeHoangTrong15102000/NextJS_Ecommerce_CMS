import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from 'src/hooks/useAuth'

// custom hook permission cho hệ thống phân quyền
export const usePermission = (key: string) => {
  const { user } = useAuth()

  const getObjectValue = (obj: any, key: string) => {
    const keys = key.split('.')
    let result = obj
    if (keys && !!keys.length) {
      for (const k of keys) {
        console.log('Checkkk result', { result })
        if (k in obj) {
          result = result[k]
        } else {
          return undefined
        }
      }
      return result
    }
    return null
  }

  getObjectValue(PERMISSIONS, key)

  const userPermission = user?.role?.permissions ?? []
}
