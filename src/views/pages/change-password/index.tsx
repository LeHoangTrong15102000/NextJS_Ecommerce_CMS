// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// ** React hot toast
import { toast } from 'react-hot-toast'

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
import FallbackSpinner from 'src/components/fall-back'

// ** React-Hook-Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PASSWORD_REG } from 'src/configs/regex'

// ** Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { registerAuthAsync } from 'src/stores/apps/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/apps/auth'

// ** Router
import { useRouter } from 'next/router'

// ** Config
import path from 'src/configs/path'

type TProps = {}

type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ChangePasswordPage: NextPage<TProps> = () => {
  // ** State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // ** I18n
  const { t } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.auth)

  // ** theme
  const theme = useTheme()

  const registerSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .required('The field is required!')
      .matches(PASSWORD_REG, 'The password is contain character, special, number'),
    newPassword: yup
      .string()
      .required('The field is required!')
      .matches(PASSWORD_REG, 'The password is contain character, special, number'),
    confirmNewPassword: yup
      .string()
      .required('The field is required!')
      .matches(PASSWORD_REG, 'The password is must be strong')
      .oneOf([yup.ref('newPassword'), ''], 'the confirm is must match with password')
  })

  const defaultValues: TDefaultValue = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
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

  const handleOnSubmit = (data: { currentPassword: string; newPassword: string }) => {
    console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      dispatch(registerAuthAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
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
            alt='Change-password-image'
            style={{
              height: '100%',
              width: '100%'
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
            <Typography component='h1' variant='h5' sx={{ mb: 2 }}>
              {t('Change_password')}
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
                      label={t('Current_password')}
                      type={showCurrentPassword ? 'text' : 'password'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.currentPassword)}
                      placeholder='Current password'
                      helperText={errors?.currentPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? (
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
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='currentPassword'
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
                      label={t('New_password')}
                      type={showNewPassword ? 'text' : 'password'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.newPassword)}
                      placeholder='New password'
                      helperText={errors?.newPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? (
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
                  name='newPassword'
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
                      label={t('Confirm_new_password')}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.confirmNewPassword)}
                      placeholder='Confirm new password'
                      helperText={errors?.confirmNewPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                              {showConfirmNewPassword ? (
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
                  name='confirmNewPassword'
                />
                {/* {errors.password && <Typography sx={{ color: 'red' }}>{errors?.password.message}</Typography>} */}
              </Box>

              {/* Remember me */}

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 6, mb: 2 }}>
                {t('Change')}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ChangePasswordPage
