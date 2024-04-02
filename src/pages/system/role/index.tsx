// ** Next
import { NextPage } from 'next'

// ** React
import React, { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** Page
import RoleListPage from 'src/views/pages/system/role/RoleList'

type TProps = {}

const Role: NextPage<TProps> = () => {
  return <RoleListPage />
}

Role.permission = [PERMISSIONS.SYSTEM.ROLE.VIEW]
export default Role 
