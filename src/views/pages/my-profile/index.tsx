// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useState } from 'react'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  Card,
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
import * as yup from 'yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Types
import { TLoginAuth } from 'src/types/auth'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

type TProps = {}

type TDefaultValue = {
  email: string
  password: string
  confirm_password: string
}

const MyProfilePage: NextPage<TProps> = () => {
  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRemember, setIsRemember] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  const registerSchema = yup.object().shape({
    email: yup.string().required('The field is required!').matches(EMAIL_REG, 'This field should be an email address'),
    password: yup
      .string()
      .required('The field is required!')
      .matches(PASSWORD_REG, 'The password is contain character, special, number'),
    confirm_password: yup
      .string()
      .required('The field is required!')
      .matches(PASSWORD_REG, 'The password is must be strong')
      .oneOf([yup.ref('password'), ''], 'the confirm is must match with password')
  })

  const defaultValues: TDefaultValue = {
    email: '',
    password: '',
    confirm_password: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(registerSchema)
  })

  const handleOnSubmit = (data: TLoginAuth) => {
    console.log('checkk data form', { data })
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
      {/* Email */}
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          p: 4
        }}
      >
        <Grid container spacing={5}>
          {/* Grid Left */}
          <Grid container item md={6} xs={12} spacing={5}>
            <Grid container item md={12} xs={12}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Avatar sx={{ width: 100, height: 100 }}>
                  {/* {user?.avatar ? (
                    <Image
                      src={user?.avatar || ''}
                      alt='avatar-user'
                      style={{
                        height: 'auto',
                        width: 'auto'
                      }}
                    />
                  ) : ( */}
                  <CustomIcon icon='ph:user-thin' />
                  {/* )} */}
                </Avatar>
                <Button variant='outlined' sx={{ mt: 3, width: 'auto' }}>
                  {t('Upload')}
                  <CustomIcon icon='material-symbols-light:upload-sharp' />
                </Button>
              </Box>
            </Grid>
            <Grid container item md={6} xs={12}>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label='Email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder='Email'
                    helperText={errors?.email?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='email'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Grid>
            <Grid container item md={6} xs={12}>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label='Email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder='Email'
                    helperText={errors?.email?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='email'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Grid>
          </Grid>
          {/* Grid Right */}
          <Grid container item md={6} xs={12} spacing={5}>
            <Grid container item md={6} xs={12}>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label='Email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder='Email'
                    helperText={errors?.email?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='email'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Grid>
            <Grid container item md={6} xs={12}>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label='Email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder='Email'
                    helperText={errors?.email?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='email'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Grid>
            <Grid container item md={6} xs={12}>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label='Email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder='Email'
                    helperText={errors?.email?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='email'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Grid>
            <Grid container item md={6} xs={12}>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label='Email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder='Email'
                    helperText={errors?.email?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='email'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Remember me */}

      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' sx={{ mt: 6, mb: 2 }}>
          {t('Change')}
        </Button>
      </Box>
    </form>
  )
}

export default MyProfilePage
