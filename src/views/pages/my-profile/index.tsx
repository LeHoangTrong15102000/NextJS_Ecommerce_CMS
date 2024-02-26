// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState } from 'react'

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
import WrapperFileUpload from 'src/components/wrapper-file-upload'

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
import { UserDataType } from 'src/contexts/types'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Service
import { getMeAuth } from 'src/services/auth'

// ** Utils
import { convertFileToBase64, handleToFullName } from 'src/utils'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  role: string
  phoneNumber: string
  fullName: string
}

const MyProfilePage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserDataType | null>(null)
  const [avatar, setAvatar] = useState('')
  // const { user } = useAuth()
  const { t, i18n } = useTranslation()

  // ** theme
  const theme = useTheme()

  const myProfileSchema = yup.object().shape({
    email: yup.string().required('The field is required!').matches(EMAIL_REG, 'This field should be an email address'),
    fullName: yup.string().notRequired(),
    role: yup.string().required('The field is required!'),
    address: yup.string().notRequired(),
    city: yup.string().notRequired(),
    phoneNumber: yup
      .string()
      .required('The field is required!')
      .min(8, 'The phone number is min 8 number')
      .max(12, 'The phone number is max 12 number')
  })

  const defaultValues: TDefaultValue = {
    email: '',
    address: '',
    city: '',
    phoneNumber: '',
    role: '',
    fullName: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(myProfileSchema)
  })

  const fetchGetMeAuth = async () => {
    await getMeAuth()
      .then(async (response) => {
        const data = response?.data
        // console.log('Check response >>> ', response)
        if (data) {
          reset({
            email: data?.email,
            role: data?.role?.name,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            fullName: handleToFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
          })
        }
        setLoading(false)
        setUser({ ...response.data })
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGetMeAuth()
  }, [])

  // console.log('Error', { user })
  const handleOnSubmit = (data: any) => {
    console.log('checkk data form', { data })
  }

  const handleUploadAvatar = async (file: File) => {
    // console.log('Checkk File', { file })
    const base64 = await convertFileToBase64(file)
    setAvatar(base64 as string)
  }

  // console.log('Checkk Avatar base64', avatar)

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
      <Grid container>
        {/* Grid Left */}
        <Grid
          container
          item
          md={6}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            <Grid container spacing={4}>
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
                  <Box
                    sx={{
                      position: 'relative'
                    }}
                  >
                    <IconButton
                      edge='start'
                      color='inherit'
                      sx={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-6px',
                        zIndex: 2
                      }}
                      onClick={() => {}}
                    >
                      <CustomIcon icon='material-symbols-light:delete-outline' />
                    </IconButton>
                    {avatar ? (
                      <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                        <CustomIcon icon='ph:user-thin' fontSize={70} />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ width: 100, height: 100 }}>
                        <CustomIcon icon='ph:user-thin' fontSize={70} />
                      </Avatar>
                    )}
                  </Box>

                  <WrapperFileUpload
                    uploadFunc={handleUploadAvatar}
                    objectAcceptFile={{
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png']
                    }}
                  >
                    <Button variant='outlined' sx={{ mt: 3, width: 'auto', display: 'flex' }}>
                      <span>{avatar ? t('Change_Avatar') : t('Upload_Avatar')}</span>
                      <CustomIcon icon='material-symbols-light:upload-sharp' />
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Grid>
              {/* Email */}
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
                      disabled
                      label={t('Email')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.email)}
                      placeholder={t('enter_your_email')}
                      helperText={errors?.email?.message}
                    />
                  )}
                  name='email'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Grid>
              {/* Role */}
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
                      disabled
                      label={t('Role')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.role)}
                      placeholder={t('enter_your_role')}
                      helperText={errors?.role?.message}
                    />
                  )}
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='role'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* Grid Right */}
        <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
            marginLeft={{ md: 5, xs: 0 }}
          >
            <Grid container spacing={4}>
              {/* FullName */}
              <Grid container item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      fullWidth
                      label={t('Full_name')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.fullName)}
                      placeholder={t('enter_your_full_name')}
                      helperText={errors?.fullName?.message}
                    />
                  )}
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='fullName'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Grid>
              <Grid container item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Address')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.address)}
                      placeholder={t('enter_your_address')}
                      helperText={errors?.address?.message}
                    />
                  )}
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='address'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Grid>
              <Grid container item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('City')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.city)}
                      placeholder={t('enter_your_city')}
                      helperText={errors?.city?.message}
                    />
                  )}
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='city'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Grid>
              <Grid container item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Phone_number')}
                      onChange={(e) => {
                        const numValue = e.target.value.replace(/\D/g, '')
                        onChange(numValue)
                      }}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                      }}
                      onBlur={onBlur}
                      value={value}
                      error={Boolean(errors?.phoneNumber)}
                      placeholder={t('enter_your_phone')}
                      helperText={errors?.phoneNumber?.message}
                    />
                  )}
                  // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                  name='phoneNumber'
                />
                {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Remember me */}
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' sx={{ mt: 6, mb: 2 }}>
          {t('Update')}
        </Button>
      </Box>
    </form>
  )
}

export default MyProfilePage
