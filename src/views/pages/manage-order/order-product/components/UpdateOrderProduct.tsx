import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, InputAdornment, Switch } from '@mui/material'
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
  separationFullName,
  stringToSlug
} from 'src/utils'
import * as yup from 'yup'
import draftToHtml from 'draftjs-to-html'
import { getDetailsOrderProduct } from 'src/services/order-product'

interface TUpdateOrderProduct {
  open: boolean
  onClose: () => void
  idOrder?: string
}

type TDefaultValue = {
  fullName: string
  phone: string
  address: string
  city: string
  paymentMethod: string
  deliveryMethod: string
  isPaid: number
  isDelivered: number
}

const UpdateOrderProduct = (props: TUpdateOrderProduct) => {
  // ** Props
  const { open, onClose, idOrder } = props

  // ** State
  const [loading, setLoading] = useState(false)
  const [imageProduct, setImageProduct] = useState('')
  // const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  // const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [optionPaymentMethod, setOptionPaymentMethod] = useState<{ label: string; value: string }[]>([])
  const [optionDeliveryMethod, setOptionDeliveryMethod] = useState<{ label: string; value: string }[]>([])

  // ** i18next
  const { t, i18n } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const orderProductSchema = yup.object().shape({
    fullName: yup.string().required(t('Required_field')),
    phone: yup.string().required(t('Required_field')),
    address: yup.string().required(t('Required_field')),
    city: yup.string().required(t('Required_field')),
    paymentMethod: yup.string().required(t('Required_field')),
    deliveryMethod: yup.string().required(t('Required_field')),
    isPaid: yup.number().required(t('Required_field')),
    isDelivered: yup.number().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: '',
    deliveryMethod: '',
    isPaid: 0,
    isDelivered: 0
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
    resolver: yupResolver(orderProductSchema)
  })

  const handleOnSubmit = (data: any) => {
    // console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      // console.log('Checkk data Create user', { data })
      if (idOrder) {
        // update
        dispatch(
          updateProductAsync({
            id: idOrder,
            name: data.name,
            slug: data.slug,
            price: Number(data.price),
            location: data.location,
            countInStock: Number(data.countInStock),
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
            discountEndDate: data?.discountEndDate || null,
            discountStartDate: data?.discountStartDate || null,
            status: data.status ? 1 : 0,
            image: imageProduct
          })
        )
      } else {
        // create
        dispatch(
          createProductAsync({
            name: data.name,
            slug: data.slug,
            location: data.location,
            price: Number(data.price),
            countInStock: Number(data.countInStock),
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
            discountEndDate: data?.discountEndDate || null,
            discountStartDate: data?.discountStartDate || null,
            status: data.status ? 1 : 0,
            image: imageProduct
          })
        )
      }
    }
  }

  // Handle upload avatar
  const handleUploadImageProduct = async (file: File) => {
    const base64 = await convertFileToBase64(file)
    setImageProduct(base64 as string)
  }

  // handleToFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
  // Fetch
  const fetchDetailsOrderProduct = async (id: string) => {
    setLoading(true)
    await getDetailsOrderProduct(id)
      .then((res) => {
        setLoading(false)
        const data = res.data
        // if (data) {
        //   reset({
        //     name: data.name,
        //     type: data.type,
        //     location: data.location,
        //     discount: data.discount || '',
        //     description: data.description ? convertHTMLToDraftjs(data.description) : '',
        //     slug: data.slug,
        //     countInStock: data.countInStock,
        //     price: data.price,
        //     status: data.status,
        //     discountStartDate: data.discountStartDate ? new Date(data.discountStartDate) : null,
        //     discountEndDate: data.discountEndDate ? new Date(data.discountEndDate) : null
        //   })
        //   setImageProduct(data?.image)
        // }
      })
      .catch((e) => {
        setLoading(false)
      })
  }

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
      setImageProduct('')
    } else if (idOrder) {
      fetchDetailsOrderProduct(idOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idOrder])

  // Fetch all roles của người dùng khi mà vào tạo user
  useEffect(() => {
    fetchAllCities()
  }, [])

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
              {t('Edit_order_product')}
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
              {/* Grid tổng chung của 2 thằng right và left */}
              <Grid container spacing={5}>
                {/* Grid Left */}
                <Grid container item md={6} xs={12}>
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    {/* Grid Container */}
                    <Grid container spacing={4}>
                      {/* Name */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Name_user_order_product')}
                              // onChange={(e) => {
                              //   const value = e.target.value
                              //   const replaced = stringToSlug(value)
                              //   onChange(value)
                              //   reset({
                              //     ...getValues(),
                              //     slug: replaced
                              //   })
                              // }}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_name_user')}
                              error={Boolean(errors?.fullName)}
                              helperText={errors?.fullName?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='fullName'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* address field */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Address')}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.address)}
                              placeholder={t('Enter_address_order')}
                              helperText={errors?.address?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='address'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* phone number field */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Phone_number_user_order')}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.phone)}
                              placeholder={t('Enter_phone_number_user')}
                              helperText={errors?.phone?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='phone'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* City */}
                      <Grid item md={12} xs={12}>
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
                                {t('City_order_product')}
                              </InputLabel>
                              <CustomSelect
                                onChange={onChange}
                                fullWidth
                                value={value}
                                options={optionCities}
                                error={Boolean(errors?.city)}
                                onBlur={onBlur}
                                placeholder={t('Select')}
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
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='city'
                        />
                      </Grid>
                      {/* Delivery method */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box sx={{ width: '100%' }}>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  mb: 1.5,
                                  color: errors?.deliveryMethod
                                    ? theme.palette.error.main
                                    : theme.palette.customColors.main
                                }}
                              >
                                {t('Delivery_method_order_product')}
                              </InputLabel>
                              <CustomSelect
                                onChange={onChange}
                                fullWidth
                                value={value}
                                options={optionDeliveryMethod}
                                error={Boolean(errors?.deliveryMethod)}
                                onBlur={onBlur}
                                placeholder={t('Select')}
                              />
                              {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                              {errors?.deliveryMethod?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.deliveryMethod
                                      ? theme.palette.error.main
                                      : theme.palette.customColors.main
                                  }}
                                >
                                  {errors?.deliveryMethod?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='deliveryMethod'
                        />
                      </Grid>
                      {/* Payment method */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box sx={{ width: '100%' }}>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  mb: 1.5,
                                  color: errors?.paymentMethod
                                    ? theme.palette.error.main
                                    : theme.palette.customColors.main
                                }}
                              >
                                {t('Payment_method_order_product')}
                              </InputLabel>
                              <CustomSelect
                                onChange={onChange}
                                fullWidth
                                value={value}
                                options={optionPaymentMethod}
                                error={Boolean(errors?.paymentMethod)}
                                onBlur={onBlur}
                                placeholder={t('Select')}
                              />
                              {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                              {errors?.paymentMethod?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.paymentMethod
                                      ? theme.palette.error.main
                                      : theme.palette.customColors.main
                                  }}
                                >
                                  {errors?.paymentMethod?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='paymentMethod'
                        />
                      </Grid>
                      {/* Status delivery */}
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            console.log('value', { value })
                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                <InputLabel
                                  sx={{
                                    fontSize: '13px',
                                    mb: 1.5,
                                    color: `rgba(${theme.palette.customColors.main}, 0.68)`
                                  }}
                                >
                                  {t('Status_delivery')}
                                </InputLabel>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={(e) => {
                                        // Lúc onChange thì sẽ đưa thằng checked vào để thay đổi status của nó
                                        onChange(e.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('Delivery') : t('Not_delivery')}
                                />
                              </Box>
                            )
                          }}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='isDelivered'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* Status payment */}
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            console.log('value', { value })
                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                <InputLabel
                                  sx={{
                                    fontSize: '13px',
                                    mb: 1.5,
                                    color: `rgba(${theme.palette.customColors.main}, 0.68)`
                                  }}
                                >
                                  {t('Status_payment')}
                                </InputLabel>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={(e) => {
                                        // Lúc onChange thì sẽ đưa thằng checked vào để thay đổi status của nó
                                        onChange(e.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('Paid') : t('Not_pay')}
                                />
                              </Box>
                            )
                          }}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='isPaid'
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
                {!idOrder ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default UpdateOrderProduct
