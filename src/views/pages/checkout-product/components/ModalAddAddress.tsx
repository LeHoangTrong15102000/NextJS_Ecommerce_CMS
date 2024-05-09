import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, Switch } from '@mui/material'
import { Avatar, Button, FormHelperText, Grid, IconButton, InputLabel, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
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
import { AppDispatch, RootState } from 'src/stores'
import { createProductAsync, updateProductAsync } from 'src/stores/product/actions'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'
import {
  cloneDeep,
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
import { updateMeAuthAsync } from 'src/stores/auth/actions'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/auth'

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

  // Nên mà khi set lại  user thì lúc này user sẽ có dữ liệu mới
  const { user, setUser } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

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
      if (activeTab === 2) {
        // activeTab === 2 thì xử lý logic tạo và sửa thông tin giao hàng
        // const findCity = optionCities.find((item) => item.value === data.city)
        const isDefaultAddress = addresses.some((address) => address.isDefault)
        const { firstName, middleName, lastName } = separationFullName(data.fullName, i18n.language)
        if (isEdit.isEdit) {
          const cloneAddresses = cloneDeep(addresses)
          // Thì 2 thz object con của cloneAddresses và thằng findAddress cùng trỏ 1 địaa chỉ
          const findAddress = cloneAddresses[isEdit.index] // Lấyy ra address của thằng có isEdit là true
          if (findAddress) {
            findAddress.address = data.address
            findAddress.firstName = firstName
            findAddress.middleName = middleName
            findAddress.lastName = lastName
            // findAddress.city = findCity ? findCity?.label : ''
            findAddress.city = data.city
            findAddress.phoneNumber = data.phoneNumber
          }
          setAddresses(cloneAddresses)
        } else {
          setAddresses([
            ...addresses,
            {
              firstName,
              middleName,
              lastName,
              phoneNumber: data?.phoneNumber,
              // city: findCity ? findCity?.label : '',
              city: data?.city,
              address: data.address,
              isDefault: !isDefaultAddress
            }
          ])
        }
        setActiveTab(1)
        setIsEdit({
          isEdit: false,
          index: 0
        })
      }
    }
  }

  const handleChangeAddress = (value: string) => {
    const cloneAddresses = [...addresses]
    setAddresses(
      cloneAddresses?.map((address, index) => {
        return {
          ...address,
          isDefault: Boolean(+value === index) // cập nhật lại isDefault
        }
      })
    )
    // setAddressSelected(value)
  }

  // Fetch all Cities
  const fetchAllCities = async () => {
    setLoading(true)
    await getAllCities({
      params: {
        page: -1,
        limit: -1
      }
    })
      .then((res) => {
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
    if (activeTab === 2 && isEdit.isEdit) {
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

  // Handle Update address
  const handleUpdateAddress = () => {
    // Lúc nó gọi tới thằng  này thì chúng ta sẽ call API luôn để cập nhật lại thông tin
    dispatch(
      updateMeAuthAsync({
        addresses: addresses
      })
    )
  }

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        if (user) {
          setUser({ ...user, addresses })
        }
      }
      dispatch(resetInitialState())
      onClose() // Cập nhật xongg đóng modal
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe, dispatch])

  return (
    <>
      {(isLoading || loading) && <Spinner />}
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
                          const findCity = optionCities.find((item) => item.value === address.city)
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
                                )} ${address.phoneNumber} ${address.address} ${findCity?.label}`}
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
                          {/* <InputLabel
                            sx={{
                              fontSize: '13px',
                              mb: 0.5,
                              color: errors?.city ? theme.palette.error.main : theme.palette.customColors.main
                            }}
                          >
                            {t('City')}
                          </InputLabel> */}
                          <label
                            style={{
                              fontSize: '13px',
                              marginBottom: '5px',
                              display: 'block',
                              color: errors?.city
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {t('City')}{' '}
                            <span
                              style={{
                                color: errors?.city
                                  ? theme.palette.error.main
                                  : `rgba(${theme.palette.customColors.main}, 0.42)`
                              }}
                            >
                              *
                            </span>
                          </label>
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
                <Button onClick={handleUpdateAddress} variant='contained' sx={{ mt: 3, mb: 2 }}>
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
                  onClick={() => {
                    setActiveTab(1)
                    setIsEdit({
                      isEdit: false,
                      index: 0
                    })
                  }}
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
