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
import { TLoginAuth } from 'src/types/auth'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { registerAuthAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'

// ** React hot toast
import { toast } from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/auth'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { useTranslation } from 'react-i18next'

type TProps = {}

type TDefaultValue = {
  email: string
  password: string
  confirm_password: string
}

const RegisterPage: NextPage<TProps> = () => {
  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRemember, setIsRemember] = useState(true)

  // ** Router
  const router = useRouter()

  // ** I18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.auth)

  // ** theme
  const theme = useTheme()

  const registerSchema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, 'This field should be an email address'),
    password: yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    confirm_password: yup
      .string()
      .required(t('Required_field'))
      .matches(PASSWORD_REG, t('Rules_password'))
      .oneOf([yup.ref('password'), ''], t('Rules_confirm_password'))
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
    if (!Object.keys(errors).length) {
      dispatch(registerAuthAsync({ email: data.email, password: data.password }))
    }
  }

  useEffect(() => {
    if (message) {
      if (isError) {
        toast.error(message)
      } else if (isSuccess) {
        toast.success(message)
        router.push(path.LOGIN)
      }

      dispatch(resetInitialState())
    }
  }, [isSuccess, isError, message, dispatch, router])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        <Box
          display={{
            sm: 'flex', // từ laptop trở lên
            xs: 'none' // Ipad trở xuống
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            backgroundColor: theme.palette.customColors.bodyBg,
            height: '100%',
            minWidth: '50vw'
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='Login-image'
            style={{
              height: '100%',
              width: 'auto'
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
          component='main'
          maxWidth='xs'
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {t('Register')}
            </Typography>
            <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
              {/* Email */}
              <Box sx={{ mt: 1, width: '300px', marginBottom: '-11px' }} width={{ md: '300px', xs: '200px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Email')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.email)}
                      placeholder={t('Enter_your_email')}
                      helperText={errors?.email?.message}
                    />
                  )}
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='email'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Box>
              {/* Password */}
              <Box sx={{ mt: 1, width: '300px', marginBottom: '-11px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      margin='normal'
                      required
                      fullWidth
                      label={t('Password')}
                      type={showPassword ? 'text' : 'password'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.password)}
                      placeholder={t('Enter_your_password')}
                      helperText={errors?.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <CustomIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <CustomIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='password'
                />
                {/* {errors.password && <Typography sx={{ color: 'red' }}>{errors?.password.message}</Typography>} */}
              </Box>
              {/* Confirm Password */}
              <Box sx={{ mt: 1, width: '300px', marginBottom: '-11px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      margin='normal'
                      required
                      fullWidth
                      label={t('Confirm_password')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.confirm_password)}
                      placeholder={t('Enter_confirm_password')}
                      helperText={errors?.confirm_password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? (
                                <CustomIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <CustomIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='confirm_password'
                />
                {/* {errors.password && <Typography sx={{ color: 'red' }}>{errors?.password.message}</Typography>} */}
              </Box>

              {/* Remember me */}

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 6, mb: 2 }}>
                {t('Sign_up')}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography>{t('You_have_account')}</Typography>
                <Link
                  href='/login'
                  style={{
                    fontSize: theme.typography.body1.fontSize,
                    color: theme.palette.primary.main
                  }}
                >
                  {t('Login')}
                </Link>
              </Box>
              <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>Or</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <IconButton
                  sx={{
                    color: '#497ce2'
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                    style={{
                      height: '40px',
                      width: '40px'
                    }}
                  >
                    <path
                      fill='currentColor'
                      d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                    ></path>
                  </svg>
                </IconButton>
                <IconButton sx={{ color: theme.palette.error.main }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                    style={{
                      height: '40px',
                      width: '40px'
                    }}
                  >
                    <path
                      fill='currentColor'
                      d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                    ></path>
                  </svg>
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RegisterPage
