// ** Config
import { BASE_URL, API_ENDPOINT } from 'src/configs/api'

// ** Storage
import {
  clearLocalUserData,
  clearTemporaryToken,
  getLocalUserData,
  getTemporaryToken,
  setLocalUserData,
  setTemporaryToken
} from '../storage'

// ** JWT Decoded
import { jwtDecode } from 'jwt-decode'

// ** Axios
import axios from 'axios'

// ** React
import { FC } from 'react'

// ** Next
import { NextRouter, useRouter } from 'next/router'

// ** path
import path from 'src/configs/path'

// ** Type
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

type TAxiosInterceptor = {
  children: React.ReactNode
}

const instanceAxios = axios.create({ baseURL: BASE_URL })

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== path.HOME && router.asPath !== path.LOGIN) {
    router.replace({
      pathname: path.LOGIN,
      query: { returnUrl: router.asPath }
    })
  } else {
    router.replace(path.LOGIN)
  }
  setUser(null)
  clearLocalUserData()
  clearTemporaryToken()
}

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { setUser, user } = useAuth()

  instanceAxios.interceptors.request.use(async (config) => {
    // Đảm bảo accessToken luôn lấy mới nhất từ locaStorage
    const { accessToken, refreshToken } = getLocalUserData()
    const { temporaryToken } = getTemporaryToken()

    if (accessToken || temporaryToken) {
      let decodedAccessToken: any = {}
      if (accessToken) {
        decodedAccessToken = jwtDecode(accessToken)
      } else if (temporaryToken) {
        decodedAccessToken = jwtDecode(temporaryToken)
      }

      if (decodedAccessToken.exp > Date.now() / 1000) {
        config.headers['Authorization'] = `Bearer ${accessToken ? accessToken : temporaryToken}`
      } else {
        // Nếu accessToken hết hạn
        if (refreshToken) {
          const decodedRefreshToken: any = jwtDecode(refreshToken)
          if (decodedRefreshToken.exp > Date.now() / 1000) {
            // callApi
            await axios
              .post(
                `${API_ENDPOINT.AUTH.INDEX}/refresh-token`,
                {},
                {
                  //
                  headers: {
                    Authorization: `Bearer ${refreshToken}`
                  }
                }
              )
              .then((res) => {
                // lấy ra được access_token mới
                const newAccessToken = res?.data?.data?.accessToken
                if (newAccessToken) {
                  config.headers['Authorization'] = `Bearer ${newAccessToken}`
                  if (accessToken) {
                    setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken)
                  } else {
                    //
                    setLocalUserData(JSON.stringify(user), '', refreshToken)
                    setTemporaryToken(newAccessToken)
                  }
                } else {
                  handleRedirectLogin(router, setUser)
                }
                // console.log('>>> Check response refresh_token', res)
              })
              .catch((error) => {
                console.log('Lỗi refresh token từ server ', error)
                handleRedirectLogin(router, setUser)
              })
          } else {
            handleRedirectLogin(router, setUser)
          }
        } else {
          // Nếu refreshToken hết hạn thì đá về trang login
          handleRedirectLogin(router, setUser)
        }
      }
    } else {
      handleRedirectLogin(router, setUser)
    }

    return config
  })

  instanceAxios.interceptors.response.use((response) => {
    return response
  })

  return <>{children}</>
}

export default instanceAxios
export { AxiosInterceptor }
