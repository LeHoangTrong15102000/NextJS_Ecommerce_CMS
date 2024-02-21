// ** Import Next
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

// ** views
import BlankLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'

// type TProps = {}

const Register: NextPage = () => {
  return <RegisterPage />
}

export default Register

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
