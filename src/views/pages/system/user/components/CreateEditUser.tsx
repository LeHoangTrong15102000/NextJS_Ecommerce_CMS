import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, Switch } from '@mui/material'
import { Avatar, Button, FormHelperText, Grid, IconButton, InputLabel, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { getAllRoles } from 'src/services/role'

// ** Service
import { getDetailsUser } from 'src/services/user'

// ** Redux
import { AppDispatch } from 'src/stores'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'
import { convertFileToBase64 } from 'src/utils'
import * as yup from 'yup'

interface TCreateEditUser {
  open: boolean
  onClose: () => void
  idUser?: string
}

type TDefaultValue = {
  fullName: string
  email: string
  password: string
  role: string
  phoneNumber: string
  city: string
  address: string
  avatar: string
  status: number
}

const CreateEditUser = (props: TCreateEditUser) => {
  // ** Props
  const { open, onClose, idUser } = props

  // ** State
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const userSchema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, 'This field should be an email address'),
    password: yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    fullName: yup.string().required(t('Required_field')),
    role: yup.string().required(t('Required_field')),
    address: yup.string().notRequired(),
    city: yup.string().notRequired(),
    phoneNumber: yup
      .string()
      .required(t('Required_field'))
      .min(8, 'The phone number is min 8 number')
      .max(12, 'The phone number is max 12 number'),
    avatar: yup.string().required(t('Required_field')),
    status: yup.number().notRequired()
  })

  const defaultValues: TDefaultValue = {
    fullName: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    city: '',
    address: '',
    avatar: '',
    status: 1 // 1 là đã verify rồi, còn để không thì mặc định là tạm khóa
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(userSchema)
  })

  const handleOnSubmit = (data: any) => {
    console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      if (idUser) {
        // update
        dispatch(updateUserAsync({ name: data?.name, id: idUser }))
      } else {
        // create
        dispatch(createUserAsync({ name: data?.name }))
      }
    }
  }

  // Handle upload avatar
  const handleUploadAvatar = async (file: File) => {
    // console.log('Checkk File', { file })
    const base64 = await convertFileToBase64(file)
    setAvatar(base64 as string)
  }
  // Fetch
  const fetchDetailsUser = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
      .then((res) => {
        setLoading(false)
        // console.log('Checkk res details role', { res })
        const data = res.data
        if (data) {
          reset({
            ...defaultValues
          })
        }
      })
      .catch((e) => {
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
    if (!open) {
      reset({
        ...defaultValues
      })
    } else if (idUser) {
      fetchDetailsUser(idUser)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idUser])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: theme.palette.customColors.bodyBg,
            padding: '30px 20px',
            borderRadius: '15px'
          }}
          minWidth={{ md: '400px', xs: '80vw' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              paddingBottom: '20px'
            }}
          >
            <Typography
              variant='h4'
              sx={{
                fontWeight: 600
              }}
            >
              {idUser ? t('Edit_user') : t('Create_user')}
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                top: '-6px',
                right: '-10px'
              }}
              onClick={onClose}
            >
              <CustomIcon icon='clarity:close-line' fontSize={'30px'} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
            >
              <Grid container spacing={5}>
                {/* Grid Left */}
                <Grid container item md={6} xs={12}>
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
                                  value={value}
                                  options={optionRoles}
                                  error={Boolean(errors?.role)}
                                  onBlur={onBlur}
                                  placeholder={t('Enter_your_role')}
                                />
                                {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                                {errors?.role?.message && (
                                  <FormHelperText
                                    sx={{
                                      color: errors?.role ? theme.palette.error.main : theme.palette.customColors.main,
                                      fontSize: '0.9375rem'
                                    }}
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
                <Grid container item md={6} xs={12}>
                  {/* FullName */}
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
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
                      <Grid item md={6} xs={12}>
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
                      <Grid item md={6} xs={12}>
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
                                  sx={{
                                    color: errors?.city ? theme.palette.error.main : theme.palette.customColors.main
                                  }}
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
                      {/* PhoneNumber */}
                      <Grid item md={6} xs={12}>
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
                      {/* Status */}

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            console.log('value', { value })
                            return (
                              <FormControlLabel
                                control={
                                  <Switch
                                    value={value}
                                    checked={Boolean(value)}
                                    onChange={(e) => {
                                      // Lúc onChange thì sẽ đưa thằng checked vào để thay đổi status của nó
                                      onChange(e.target.checked)
                                      console.log('Checkkk event.target', e.target.checked)
                                    }}
                                  />
                                }
                                label={t('Đang hoạt động')}
                              />
                            )
                          }}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='status'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 6, mb: 2 }}>
                {!idUser ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditUser
