import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, InputAdornment, Radio, RadioGroup, Switch } from '@mui/material'
import { Avatar, Button, FormHelperText, Grid, IconButton, InputLabel, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomDatePicker from 'src/components/custom-date-picker'
import CustomEditor from 'src/components/custom-editor'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { getAllCities } from 'src/services/city'
import { getDetailsProduct } from 'src/services/product'
import { getAllProductTypes } from 'src/services/product-type'
import { getAllRoles } from 'src/services/role'

// ** Service
import { getDetailsUser } from 'src/services/user'

// ** Redux
import { AppDispatch } from 'src/stores'
import { createProductAsync, updateProductAsync } from 'src/stores/product/actions'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'
import {
  convertFileToBase64,
  convertHTMLToDraftjs,
  formatNumberToLocale,
  handleToFullName,
  seperationFullName,
  stringToSlug
} from 'src/utils'
import * as yup from 'yup'
import draftToHtml from 'draftjs-to-html'
import NoData from 'src/components/no-data'
import { useAuth } from 'src/hooks/useAuth'

interface TModalAddAddress {
  open: boolean
  onClose: () => void
}

type TDefaultValue = {
  fullName: string
  address: string
  city: string
  phoneNumber: string
}

const ModalAddAddress = (props: TModalAddAddress) => {
  // ** Props
  const { open, onClose } = props

  // ** State
  const [loading, setLoading] = useState(false)
  // const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [activeTab, setActiveTab] = useState(1)

  // ** i18next
  const { t, i18n } = useTranslation()

  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const userSchema = yup.object().shape({
    fullName: yup.string().required(t('Required_field')),
    address: yup.string().required(t('Required_field')),
    city: yup.string().required(t('Required_field')),
    phoneNumber: yup.string().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    fullName: '',
    address: '',
    city: '',
    phoneNumber: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(userSchema)
  })

  const handleOnSubmit = (data: any) => {
    // console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
    }
  }

  // handleToFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
  // Fetch
  // const fetchDetailsProduct = async (id: string) => {
  //   setLoading(true)
  //   await getDetailsProduct(id)
  //     .then((res) => {
  //       setLoading(false)
  //       const data = res.data
  //       if (data) {
  //         reset({
  //           name: data.name,
  //           type: data.type,
  //           location: data.location,
  //           discount: data.discount || '',
  //           description: data.description ? convertHTMLToDraftjs(data.description) : '',
  //           slug: data.slug,
  //           countInStock: data.countInStock,
  //           price: data.price,
  //           status: data.status,
  //           discountStartDate: data.discountStartDate ? new Date(data.discountStartDate) : null,
  //           discountEndDate: data.discountEndDate ? new Date(data.discountEndDate) : null
  //         })
  //         setImageProduct(data?.image)
  //       }
  //     })
  //     .catch((e) => {
  //       setLoading(false)
  //     })
  // }

  // Fetch all Cities
  const fetchAllCities = async () => {
    await getAllCities({
      params: {
        page: -1,
        limit: -1
      }
    })
      .then((res) => {
        setLoading(true)
        const data = res?.data.cities
        if (data) {
          setOptionCities(
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    fetchAllCities()
  }, [])

  const addresses = [
    {
      address: 'Lê Văn Chí',
      city: 'Ho Chi Minh city',
      phoneNumber: '0938932953',
      firstName: 'Trọng',
      middleName: 'Hoàng',
      lastName: 'Lê',
      isDefault: false
    },
    {
      address: 'Võ Văn Ngân',
      city: 'Ho Chi Minh city',
      phoneNumber: '0938932953',
      fullName: 'Lê Trọng Hoangg',
      firstName: 'Hoàngg',
      middleName: 'Trọng',
      lastName: 'Lê',
      isDefault: true
    }
  ]

  const handleChangeAddress = (value: string) => {}

  // Fetch all roles của người dùng khi mà vào tạo user

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
          minWidth={{ md: '800px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '80vw' }}
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
              {activeTab === 1 ? <>{t('Address_shipping')}</> : <>{t('Add_address_shipping')}</>}
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
              {activeTab === 1 ? (
                <Box>
                  {addresses.length > 0 ? (
                    <RadioGroup
                      sx={{
                        position: 'relative',
                        top: '-6px'
                      }}
                      // onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAddress(e.target.value)}
                      aria-labelledby='delivery-group'
                      name='radio-delivery-group'
                    >
                      {addresses.map((address, index) => {
                        return (
                          <FormControlLabel
                            key={index}
                            value={address.address}
                            control={<Radio checked={address.isDefault} />}
                            label={`${handleToFullName(
                              address?.lastName as string,
                              address?.middleName as string,
                              address?.firstName as string,
                              i18n.language
                            )} ${address.phoneNumber} ${address.address} ${address.city}`}
                          />
                        )
                      })}
                    </RadioGroup>
                  ) : (
                    <NoData widthImage='60px' heightImage='60px' textNodata={t('No_address_shipping')} />
                  )}
                </Box>
              ) : (
                <Grid container spacing={5}>
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
                  {/* Address */}
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
                  {/* City */}
                  <Grid container item md={6} xs={12}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box sx={{ width: '100%' }}>
                          <InputLabel
                            sx={{
                              fontSize: '13px',
                              mb: 0.5,
                              color: errors?.city ? theme.palette.error.main : theme.palette.customColors.main
                            }}
                          >
                            {t('City')}
                          </InputLabel>
                          <CustomSelect
                            onChange={onChange}
                            fullWidth
                            value={value}
                            options={optionCities}
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
                  {/* Phone number */}
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
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 6, mb: 2 }}>
                {t('Update_address_shipping')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default ModalAddAddress
