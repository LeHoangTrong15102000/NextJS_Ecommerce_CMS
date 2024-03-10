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
import { changePasswordMeAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/auth'

// ** Router
import { useRouter } from 'next/router'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

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

  // ** Context
  const { logout } = useAuth()

  // ** I18n
  const { t } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessChangePassword, isErrorChangePassword, messageChangePassword } = useSelector(
    (state: RootState) => state.auth
  )
  // 'The password is contain character, special, number'
  // ** theme
  const theme = useTheme()

  const registerSchema = yup.object().shape({
    currentPassword: yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_passwowrd')),
    newPassword: yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_password')),
    confirmNewPassword: yup
      .string()
      .required(t('required_field'))
      .matches(PASSWORD_REG, t('rule_password'))
      .oneOf([yup.ref('newPassword'), ''], t('rules_confirm_new_password'))
  })

  const defaultValues: TDefaultValue = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(registerSchema)
  })

  const handleOnSubmit = (data: { currentPassword: string; newPassword: string }) => {
    console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      dispatch(changePasswordMeAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
    }
  }

  const handleResetForm = () => {
    reset({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
  }

  useEffect(() => {
    if (messageChangePassword) {
      if (isErrorChangePassword) {
        toast.error(messageChangePassword)
      } else if (isSuccessChangePassword) {
        toast.success(messageChangePassword)
        handleResetForm()
        setTimeout(() => {
          logout()
        }, 300)
        // logout()
      }

      dispatch(resetInitialState())
    }
  }, [isSuccessChangePassword, isErrorChangePassword, messageChangePassword, dispatch, router])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          // height: '80vh',
          // width: '100%',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Box
          display={{
            xs: 'none', // Ipad trở xuống
            sm: 'flex' // từ laptop trở lên
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.customColors.bodyBg,
            height: '90%',
            minWidth: '50vw',
            borderRadius: theme.shape.borderRadius
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='Change-password-image'
            style={{
              height: '50%',
              width: '50%'
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
                      placeholder={t('Enter_password')}
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
                      placeholder={t('Enter_new_password')}
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
                      placeholder={t('Enter_confirm_new_password')}
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
