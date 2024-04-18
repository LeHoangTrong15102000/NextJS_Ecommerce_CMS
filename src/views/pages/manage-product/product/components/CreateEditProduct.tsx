import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, InputAdornment, Switch } from '@mui/material'
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
import { convertFileToBase64, handleToFullName, seperationFullName, stringToSlug } from 'src/utils'
import * as yup from 'yup'

interface TCreateEditProduct {
  open: boolean
  onClose: () => void
  idProduct?: string
}

type TDefaultValue = {
  name: string
  type: string
  slug: string
  city: string
  discount?: string | null
  description: string
  countInStock: string
  status?: number
  price: string
  discountStartDate?: Date | null
  discountEndDate?: Date | null
}

const CreateEditProduct = (props: TCreateEditProduct) => {
  // ** Props
  const { open, onClose, idProduct } = props

  // ** State
  const [loading, setLoading] = useState(false)
  const [imageProduct, setImageProduct] = useState('')
  // const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])

  // ** i18next
  const { t, i18n } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const userSchema = yup.object().shape({
    name: yup.string().required(t('Required_field')),
    type: yup.string().required(t('Required_field')),
    slug: yup.string().required(t('Required_field')),
    price: yup
      .string()
      .required(t('Required_field'))
      .test('least_price', t('Least_1_in_price'), (value) => {
        return Number(value) >= 1000
      }),
    city: yup.string().required(t('Required_field')),
    discount: yup.string().notRequired(),
    description: yup.string().required(),
    countInStock: yup
      .string()
      .required(t('Required_field'))
      .test('least_count', t('Least_1_in_stock'), (value) => {
        return Number(value) >= 1
      }),
    discountStartDate: yup.date().notRequired(), // Khi mà  để là nonNullable thì nó có thể là Date hoặc là undefined
    discountEndDate: yup.date().notRequired(),

    // avatar: yup.string().nonNullable(),
    status: yup.number().nonNullable()
  })

  const defaultValues: TDefaultValue = {
    name: '',
    type: '',
    slug: '',
    discount: '',
    description: '',
    countInStock: '',
    city: '',
    // avatar?: ''
    status: 0,
    price: '',
    discountStartDate: null,
    discountEndDate: null
  }

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(userSchema)
  })

  const handleOnSubmit = (data: TDefaultValue) => {
    // console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      // console.log('Checkk data Create user', { data })
      if (idProduct) {
        // update
        dispatch(
          updateProductAsync({
            id: idProduct,
            name: data.name,
            slug: data.slug,
            price: Number(data.price),
            city: data.city,
            countInStock: Number(data.countInStock),
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description,
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
            city: data.city,
            price: Number(data.price),
            countInStock: Number(data.countInStock),
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description,
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
  const fetchDetailsProduct = async (id: string) => {
    setLoading(true)
    await getDetailsProduct(id)
      .then((res) => {
        setLoading(false)
        const data = res.data
        if (data) {
          reset({})
          setImageProduct(data?.image)
        }
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  // Fetch all Cities
  const fetchAllProductTypes = async () => {
    await getAllProductTypes({
      params: {
        page: -1,
        limit: -1
      }
    })
      .then((res) => {
        setLoading(true)
        console.log('Checkkk Res Role', { res })
        const data = res?.data.productTypes
        if (data) {
          setOptionTypes(
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
    } else if (idProduct) {
      fetchDetailsProduct(idProduct)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idProduct])

  // Fetch all roles của người dùng khi mà vào tạo user
  useEffect(() => {
    fetchAllProductTypes()
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
              {idProduct ? t('Edit_product') : t('Create_product')}
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
                      {/* Avatar */}
                      <Grid item md={12} xs={12}>
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
                            {imageProduct && (
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
                                  onClick={() => setImageProduct('')}
                                >
                                  <CustomIcon icon='material-symbols-light:delete-outline' fontSize={25} />
                                </IconButton>
                              </Avatar>
                            )}
                            {imageProduct ? (
                              <Avatar src={imageProduct} sx={{ width: 100, height: 100 }}>
                                <CustomIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            ) : (
                              <Avatar sx={{ width: 100, height: 100 }}>
                                <CustomIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            )}
                          </Box>

                          <WrapperFileUpload
                            uploadFunc={handleUploadImageProduct}
                            objectAcceptFile={{
                              'image/jpeg': ['.jpg', '.jpeg'],
                              'image/png': ['.png']
                            }}
                          >
                            <Button variant='outlined' sx={{ mt: 3, width: 'auto', display: 'flex' }}>
                              <span>{imageProduct ? t('Change_image_product') : t('Upload_image_product')}</span>
                              <CustomIcon icon='material-symbols-light:upload-sharp' />
                            </Button>
                          </WrapperFileUpload>
                        </Box>
                      </Grid>
                      {/* Name */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Name_product_type')}
                              onChange={(e) => {
                                const value = e.target.value
                                const replaced = stringToSlug(value)
                                onChange(value)
                                reset({
                                  ...getValues(),
                                  slug: replaced
                                })
                              }}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.name)}
                              placeholder={t('Enter_name_product_type')}
                              helperText={errors?.name?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='name'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* Slug field */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              disabled
                              fullWidth
                              label={t('Slug')}
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
                              error={Boolean(errors?.slug)}
                              placeholder={t('Enter_slug')}
                              helperText={errors?.slug?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='slug'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/*  Status - trạng thái của sản phẩm */}
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
                                    color: `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {t('Status_product')}
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
                                  label={Boolean(value) ? t('Active') : t('Block')}
                                />
                              </Box>
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
                {/* Grid Right */}
                <Grid container item md={6} xs={12}>
                  {/* FullName */}
                  <Box>
                    <Grid container spacing={4}>
                      {/* Price */}
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Price')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.price)}
                              placeholder={t('Enter_price')}
                              helperText={errors?.price?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='price'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* Count in stock */}
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Count_in_stock')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.countInStock)}
                              placeholder={t('Enter_count_in_stock')}
                              helperText={errors?.countInStock?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='countInStock'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* type */}
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box sx={{ width: '100%' }}>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  mb: 1.5,
                                  color: errors?.type ? theme.palette.error.main : theme.palette.customColors.main
                                }}
                              >
                                {t('Type_product')}
                              </InputLabel>
                              <CustomSelect
                                onChange={onChange}
                                fullWidth
                                value={value}
                                options={optionTypes}
                                error={Boolean(errors?.type)}
                                onBlur={onBlur}
                                placeholder={t('Select')}
                              />
                              {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                              {errors?.type?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.type ? theme.palette.error.main : theme.palette.customColors.main
                                  }}
                                >
                                  {errors?.type?.message}
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
                          name='type'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* discount */}
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Discount')}
                              onChange={(e) => {
                                const numValue = e.target.value.replace(/\D/g, '')
                                onChange(numValue)
                              }}
                              inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                minLength: 9
                              }}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.discount)}
                              placeholder={t('Enter_discount')}
                              helperText={errors?.discount?.message}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='discount'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* Status */}
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
                {!idProduct ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditProduct
