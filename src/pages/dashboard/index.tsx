import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const DashBoard: NextPage<TProps> = () => {
  return <h1>this is DashBoard</h1>
}

DashBoard.permission = [PERMISSIONS.DASHBOARD]
export default DashBoard
