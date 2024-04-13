import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'
import CityListPage from 'src/views/pages/settings/city/CityList'

type TProps = {}

const City: NextPage<TProps> = () => {
  return <CityListPage />
}
City.permission = [PERMISSIONS.SETTING.CITY.VIEW]
export default City
