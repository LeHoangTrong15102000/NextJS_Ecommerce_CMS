// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect } from 'react'

// ** MUI
import { Box, Grid, useTheme } from '@mui/material'
import CustomDataGrid from 'src/components/custom-data-grid'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

// ** Components

// ** React-Hook-Form

// ** Image
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'

// ** Redux
import { getAllRolesAsync } from 'src/stores/role/actions'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

// ** i18next
import { useTranslation } from 'react-i18next'

// **

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // ** State
  const { roles } = useSelector((state: RootState) => state.role)

  // ** I18n
  const { t } = useTranslation()

  // ** context
  const { login, user } = useAuth()

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()

  console.log('Checkkkk roles', { roles })

  // ** theme
  const theme = useTheme()

  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1 } }))
  }

  useEffect(() => {
    handleGetListRoles()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Name'),
      width: 150,
      editable: true
    }
  ]

  return (
    <Box
      sx={{
        // overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      <Grid container>
        {/* Grid left - List Role */}
        <Grid item md={6} xs={12}>
          <CustomDataGrid
            rows={roles.data}
            columns={columns}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       pageSize: 5
            //     }
            //   }
            // }}
            getRowId={(row) => row._id}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            // slots={{
            //    pagination: // Sẽ nhận vào component của chúng ta
            // }}
          />
        </Grid>
        {/* Grid right - List Permission */}
        <Grid item md={6} xs={12}>
          List Permission
        </Grid>
      </Grid>
    </Box>
  )
}

export default RoleListPage
