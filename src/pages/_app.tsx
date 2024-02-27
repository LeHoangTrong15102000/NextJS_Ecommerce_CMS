// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { Provider } from 'react-redux'
import { store } from 'src/stores'

// ** Loader Import
import NProgress from 'nprogress'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Contexts
import { AuthProvider } from 'src/contexts/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/contexts/SettingsContext'

// ** Global css styles
import 'src/styles/globals.scss'

// ** Components
import GuestGuard from 'src/components/auth/GuestGuard'
import AuthGuard from 'src/components/auth/AuthGuard'
import AclGuard from 'src/components/auth/AclGuard'
import FallbackSpinner from 'src/components/fall-back'
import ReactHotToast from 'src/components/react-hot-toast'

// ** Hooks
import { useSettings } from 'src/hooks/useSettings'

// ** Theme
import ThemeComponent from 'src/theme/ThemeComponent'

// ** Layouts
import UserLayout from 'src/views/layouts/UserLayout'

// ** Interceptor
import { AxiosInterceptor } from 'src/helpers/axios'
import NoGuard from 'src/components/auth/NoGuard'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <NoGuard fallback={<FallbackSpinner />}>{children}</NoGuard>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

export default function App(props: ExtendedAppProps) {
  // Thì lúc này component nó sẽ gồm những thằng như login, register
  const { Component, pageProps } = props

  // console.log('Check re-render App')

  const { settings } = useSettings()

  // Variables
  const getLayout = Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  // Mặc định của app thì guest là false, nếu component đó có guestGuard thì sẽ lấy Component.guestGuard còn không thì sẽ lấy là false
  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const toastOptions = {
    success: {
      className: 'react-hot-toast',
      style: {
        background: '#DDF6E8'
      }
    },
    error: {
      className: 'react-hot-toast',
      style: {
        background: '#FDE4D5'
      }
    }
  }

  return (
    <Provider store={store}>
      <Head>
        <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
        />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <AuthProvider>
        <AxiosInterceptor>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={toastOptions} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AxiosInterceptor>
      </AuthProvider>
    </Provider>
  )
}
