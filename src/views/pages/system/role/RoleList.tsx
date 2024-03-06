// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect } from 'react'

// ** MUI
import { Box, Grid, useTheme } from '@mui/material'

// ** Components

// ** React-Hook-Form

// ** Image
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRolesAsync } from 'src/stores/role/actions'
import { AppDispatch, RootState } from 'src/stores'

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
    dispatch(getAllRolesAsync({ limit: -1, page: -1 }))
  }

  useEffect(() => {
    handleGetListRoles()
  }, [])

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
        <Grid item md={6} xs={12}></Grid>
        {/* Grid right - List Permission */}
        <Grid md={6} xs={12}>
          List Permission
        </Grid>
      </Grid>
    </Box>
  )
}

export default RoleListPage
