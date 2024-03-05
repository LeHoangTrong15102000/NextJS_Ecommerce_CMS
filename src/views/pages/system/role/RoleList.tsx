// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  InputAdornment,
  Typography,
  useTheme
} from '@mui/material'
import { IconButton } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import CustomIcon from 'src/components/Icon'

// ** React-Hook-Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Image
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { getAllRolesAsync } from 'src/stores/role/actions'
import { AppDispatch } from 'src/stores'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // ** I18n
  const { t } = useTranslation()

  // ** context
  const { login, user } = useAuth()

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()

  // ** theme
  const theme = useTheme()

  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1 } }))
  }

  useEffect(() => {}, [])

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
