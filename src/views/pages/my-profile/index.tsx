// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import { Avatar, Box, Button, FormHelperText, Grid, InputLabel, useTheme } from '@mui/material'
import { IconButton } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import CustomIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import FallbackSpinner from 'src/components/fall-back'

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
import { convertFileToBase64, handleToFullName, seperationFullName } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateMeAuthAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// ** Toast
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'
import CustomModal from 'src/components/custom-modal'
import { getAllRoles } from 'src/services/role'

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
  // const [roleId, setRoleId] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)

  // const { user } = useAuth()
  const { t, i18n } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  // ** theme
  const theme = useTheme()

  const myProfileSchema = yup.object().shape({
    email: yup.string().required(t('required_field')).matches(EMAIL_REG, 'This field should be an email address'),
    fullName: yup.string().notRequired(),
    role: isDisabledRole ? yup.string().notRequired() : yup.string().required(t('required_field')),
    address: yup.string().notRequired(),
    city: yup.string().notRequired(),
    phoneNumber: yup
      .string()
      .required(t('required_field'))
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
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(myProfileSchema)
  })

  // Fetch Get me
  const fetchGetMeAuth = async () => {
    setLoading(true)
    await getMeAuth()
      .then(async (response) => {
        setLoading(false)
        const data = response?.data
        console.log('Checkkkk data', { data })
        // console.log('Check response >>> ', response)
        if (data) {
          setIsDisabledRole(!data?.role.permissions?.length)
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            role: data?.role?._id,
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

  // Fetch ALl Role
  const fetchAllRoles = async () => {
    await getAllRoles({
      params: {
        page: -1,
        limit: -1
      }
    })
      .then((res) => {
        setLoading(true)
        console.log('Checkkk Res Role', { res })
        const data = res?.data.roles
        if (data) {
          setOptionRoles(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item.name,
                value: item._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('Checkkkk Error', { error })
      })
  }

  useEffect(() => {
    if (i18n.language) {
      fetchGetMeAuth()
    }
  }, [i18n.language])

  // Fetch getAllRoles
  useEffect(() => {
    fetchAllRoles()
  }, [])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetMeAuth()
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe, dispatch])

  // console.log('Error', { user })
  const handleOnSubmit = (data: any) => {
    const { firstName, lastName, middleName } = seperationFullName(data.fullName, i18n.language)
    console.log('checkk data form', { data })
    dispatch(
      updateMeAuthAsync({
        email: data.email,
        firstName,
        lastName,
        middleName,
        role: data.role,
        phoneNumber: data.phoneNumber,
        avatar,
        address: data.address
        // city: data.city
      })
    )
  }

  const handleUploadAvatar = async (file: File) => {
    // console.log('Checkk File', { file })
    const base64 = await convertFileToBase64(file)
    setAvatar(base64 as string)
  }

  // console.log('Checkk Avatar base64', avatar)

  return (
    <>
      {(loading || isLoading) && <Spinner />}
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
                      {avatar && (
                        <Avatar
                          sx={{
                            position: 'absolute',
                            bottom: '-4px',
                            right: '-10px',
                            zIndex: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <IconButton
                            sx={{
                              position: 'absolute',
                              left: '12px',
                              color: theme.palette.primary.main
                            }}
                            edge='start'
                            color='inherit'
                            onClick={() => setAvatar('')}
                          >
                            <CustomIcon icon='material-symbols-light:delete-outline' fontSize={25} />
                          </IconButton>
                        </Avatar>
                      )}
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
                  {!isDisabledRole && (
                    <Controller
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box sx={{ width: '100%' }}>
                          <InputLabel
                            disabled
                            sx={{
                              fontSize: '13px',
                              mb: 1.5,
                              color: errors?.role ? theme.palette.error.main : theme.palette.customColors.main
                            }}
                          >
                            {t('Role')}
                          </InputLabel>
                          <CustomSelect
                            onChange={onChange}
                            fullWidth
                            disabled
                            value={value}
                            options={optionRoles}
                            error={Boolean(errors?.role)}
                            onBlur={onBlur}
                            placeholder={t('Enter_your_role')}
                          />
                          {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                          {errors?.role?.message && (
                            <FormHelperText
                              sx={{ color: errors?.role ? theme.palette.error.main : theme.palette.customColors.main }}
                            >
                              {errors?.role?.message}
                            </FormHelperText>
                          )}
                        </Box>

                        // <CustomTextField
                        //   required
                        //   fullWidth
                        //   disabled
                        //   label={t('Role')}
                        //   onChange={onChange}
                        //   onBlur={onBlur}
                        //   value={value}
                        //   error={Boolean(errors?.role)}
                        //   placeholder={t('Enter_your_role')}
                        //   helperText={errors?.role?.message}
                        // />
                      )}
                      // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                      name='role'
                    />
                  )}
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
                        placeholder={t('Enter_your_full_name')}
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
                        placeholder={t('Enter_your_address')}
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
                      <Box sx={{ width: '100%' }}>
                        <InputLabel
                          sx={{
                            fontSize: '13px',
                            mb: 1.5,
                            color: errors?.city ? theme.palette.error.main : theme.palette.customColors.main
                          }}
                        >
                          {t('City')}
                        </InputLabel>
                        <CustomSelect
                          onChange={onChange}
                          fullWidth
                          value={value}
                          options={[]}
                          error={Boolean(errors?.city)}
                          onBlur={onBlur}
                          placeholder={t('Enter_your_city')}
                        />
                        {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                        {errors?.city?.message && (
                          <FormHelperText
                            sx={{ color: errors?.city ? theme.palette.error.main : theme.palette.customColors.main }}
                          >
                            {errors?.city?.message}
                          </FormHelperText>
                        )}
                      </Box>
                      // <CustomTextField
                      //   required
                      //   fullWidth
                      //   label={t('City')}
                      //   onChange={onChange}
                      //   onBlur={onBlur}
                      //   value={value}
                      //   error={Boolean(errors?.city)}
                      //   placeholder={t('Enter_your_city')}
                      //   helperText={errors?.city?.message}
                      // />
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
                        placeholder={t('Enter_your_phone')}
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

        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='submit' variant='contained' sx={{ mt: 6, mb: 2, width: { lg: '10%', md: '15%', xs: '100%' } }}>
            {t('Update')}
          </Button>
        </Box>
      </form>
    </>
  )
}

export default MyProfilePage
