// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig, { LIST_PAGE_PUBLIC } from 'src/configs/auth'
import { API_ENDPOINT } from 'src/configs/api'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Services
import { loginAuth, logoutAuth } from 'src/services/auth'

// ** helper
import instanceAxios from 'src/helpers/axios'
import { clearLocalUserData, setLocalUserData, setTemporaryToken } from 'src/helpers/storage'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import path from 'src/configs/path'
import { AppDispatch } from 'src/stores'
import { useDispatch } from 'react-redux'
import { updateProductToCart } from 'src/stores/order-product'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const { t } = useTranslation()

  // ** Hooks
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // Dùng useEffect để khi mà reload lại user vẫn đăng nhập
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      console.log('Check StoredToken', storedToken)
      if (storedToken) {
        setLoading(true)
        await instanceAxios
          // vừa thay meEndPoint bằng storageTokenKeyName
          .get(API_ENDPOINT.AUTH.AUTH_ME)
          .then(async (response) => {
            // console.log('Check response >>> ', response)
            setLoading(false)
            setUser({ ...response.data.data })
            // setLocalUserData(
            //   JSON.stringify(response.data.user),
            //   response.data.access_token,
            //   response.data.refresh_token
            // )
          })
          .catch(() => {
            clearLocalUserData()
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password })
      .then(async (response) => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }

        toast.success(t('Login_success'))
        const returnUrl = router.query.returnUrl
        // console.log('Check Response >>>> ', response)
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })

      .catch((err) => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Gọi API thực hiện việc logout cho trang web
  // Router.asPath là đường dẫn cái trang hiện tại đang đứng
  const handleLogout = () => {
    logoutAuth().then((res) => {
      toast.success(res?.message)
      setUser(null)
      clearLocalUserData()
      // Nếu không nằm trong trang public thì nó sẽ được đá về trang login
      // Chỉ cần URL bắt đầu từ thằng router.asPath là được vì thằng trang chi tiết product của chúng ta là /product/:slug
      if (!LIST_PAGE_PUBLIC.some((item) => router.asPath?.startsWith(item))) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: path.LOGIN,
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace(path.LOGIN)
        }
      }
      // Còn không khi mà logout thì sẽ ở lại trang đó bình thường
      dispatch(
        updateProductToCart({
          orderItems: []
        })
      )
      // router.push(path.LOGIN)
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
