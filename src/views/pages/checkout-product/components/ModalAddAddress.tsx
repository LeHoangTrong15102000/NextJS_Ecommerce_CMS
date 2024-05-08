import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, Switch } from '@mui/material'
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
import NoData from 'src/components/no-data'
import { useAuth } from 'src/hooks/useAuth'
import { TUserAddress } from 'src/contexts/types'

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
  const [addressSelected, setAddressSelected] = useState('')
  const [addresses, setAddresses] = useState<TUserAddress[]>([])
  const [isEdit, setIsEdit] = useState({
    isEdit: false,
    index: 0
  })

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
    phoneNumber: yup
      .string()
      .required(t('Required_field'))
      .min(10, 'The phone number is min 10 number')
      .max(12, 'The phone number is max 12 number')
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
      const findCity = optionCities.find((item) => item.value === data.city)
      const isDefaultAddress = addresses.some((address) => address.isDefault)
      const { firstName, middleName, lastName } = separationFullName(data.fullName, i18n.language)
      if (isEdit.isEdit) {
        const findAddress = addresses[isEdit.index] // Lấyy ra address của thằng có isEdit là true
      } else {
        setAddresses([
          ...addresses,
          {
            firstName,
            middleName,
            lastName,
            phoneNumber: data?.phoneNumber,
            city: findCity ? findCity?.label : '',
            address: data.address,
            isDefault: !isDefaultAddress
          }
        ])
      }
      setActiveTab(1)

      console.log('Check data', {
        data
      })
    }
  }

  const handleChangeAddress = (value: string) => {
    setAddressSelected(value)
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Thêm vào như thế này để không phải nhấn vào cancel thì nó sẽ tạo ra một address mới
  useEffect(() => {
    if (activeTab === 2 && isEdit) {
      // tìm thằng address có isDefault là true
      const findDefaultAddress = addresses.find((item) => item.isDefault)
      const findCity = findDefaultAddress ? optionCities.find((item) => findDefaultAddress.city === item.label) : ''
      const fullName = handleToFullName(
        findDefaultAddress?.lastName as string,
        findDefaultAddress?.middleName as string,
        findDefaultAddress?.firstName as string,
        i18n.language
      )

      reset({
        fullName: fullName,
        phoneNumber: findDefaultAddress?.phoneNumber,
        address: findDefaultAddress?.address,
        city: findCity ? findCity?.value : '' // Chấm value là để lấy ra thằng idCity
      })
    } else {
      reset({
        ...defaultValues
      })
    }
  }, [activeTab, isEdit])

  useEffect(() => {
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (user) {
      setAddresses(user?.addresses)
    }
  }, [user?.addresses])

  // const addresses = [
  //   {
  //     address: 'Lê Văn Chí',
  //     city: 'Ho Chi Minh city',
  //     phoneNumber: '0938932953',
  //     firstName: 'Trọng',
  //     middleName: 'Hoàng',
  //     lastName: 'Lê',
  //     isDefault: false
  //   },
  //   {
  //     address: 'Võ Văn Ngân',
  //     city: 'Ho Chi Minh city',
  //     phoneNumber: '0938932953',
  //     fullName: 'Lê Trọng Hoangg',
  //     firstName: 'Hoàngg',
  //     middleName: 'Trọng',
  //     lastName: 'Lê',
  //     isDefault: true
  //   }
  // ]

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
                    <FormControl>
                      <FormLabel
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          width: '260px',
                          mb: 3
                        }}
                        id='delivery-group'
                      >
                        {t('Select_delivery_type')}
                      </FormLabel>
                      <RadioGroup
                        sx={{
                          position: 'relative',
                          top: '-6px'
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAddress(e.target.value)}
                        aria-labelledby='address-group'
                        name='radio-address-group'
                      >
                        {addresses.map((address, index) => {
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <FormControlLabel
                                value={index}
                                control={<Radio checked={address.isDefault} />}
                                label={`${handleToFullName(
                                  address?.lastName as string,
                                  address?.middleName as string,
                                  address?.firstName as string,
                                  i18n.language
                                )} ${address.phoneNumber} ${address.address} ${address.city}`}
                              />
                              {address.isDefault && (
                                <Button
                                  sx={{
                                    border: `1px solid ${theme.palette.primary.main}`
                                  }}
                                  onClick={() => {
                                    setActiveTab(2)
                                    setIsEdit({
                                      isEdit: true,
                                      index: index
                                    })
                                  }}
                                >
                                  {t('Change_address_shipping')}
                                </Button>
                              )}
                            </Box>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <NoData widthImage='60px' heightImage='60px' textNodata={t('No_address_shipping')} />
                  )}

                  <Box>
                    <Button
                      disabled={Boolean(addresses.length > 3)}
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`
                      }}
                      onClick={() => setActiveTab(2)}
                    >
                      {t('Add_new_address_shipping')}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Grid container spacing={5}>
                  {/* FullName */}
                  <Grid container item md={6} xs={12}>
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
                            required
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
                              sx={{
                                color: errors?.city ? theme.palette.error.main : theme.palette.customColors.main,
                                fontSize: '0.9375rem'
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

            {activeTab === 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                  {t('Update_address_shipping')}
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 4
                }}
              >
                <Button
                  sx={{
                    border: `1px solid ${theme.palette.primary.main}`,
                    mt: 3,
                    mb: 2
                  }}
                  onClick={() => setActiveTab(1)}
                >
                  {t('Cancel_address_shipping')}
                </Button>
                <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                  {t('Confirm_address_shipping')}
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default ModalAddAddress