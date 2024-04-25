// ** Import Next
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'
import LoginPage from 'src/views/pages/login'

// type TProps = {}

const Login: NextPage = () => {
  return <LoginPage />
}

export default Login

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
// Trường hợp khi mà đăng nhập rôi thì bật qua guestGuard là true để không thể quay lại login
Login.guestGuard = true
