// **  Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** MUI
import {
  Avatar,
  AvatarProps,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  ListItem,
  Radio,
  RadioGroup,
  styled,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
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
import {
  cloneDeep,
  convertFileToBase64,
  convertUpdateProductToCart,
  formatNumberToLocale,
  handleToFullName,
  seperationFullName
} from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// ** Toast
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'
import CustomModal from 'src/components/custom-modal'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'
import { TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

import NoData from 'src/components/no-data'
import product from 'src/stores/product'
import { useRouter } from 'next/router'
import { getAllPaymentTypes } from 'src/services/payment-type'
import { getAllDeliveryTypes } from 'src/services/delivery-type'
import { FormControl } from '@mui/material'
import { createOrderProductAsync } from 'src/stores/order-product/actions'
import { resetInitialState } from 'src/stores/order-product'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  role: string
  phoneNumber: string
  fullName: string
}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const CheckoutProductpage: NextPage<TProps> = () => {
  // ** State
  // const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [amountProduct, setAmountProduct] = useState()
  const [optionPayments, setOptionPayments] = useState<{ label: string; value: string }[]>([])
  const [optionDeliveries, setOptionDeliveries] = useState<{ label: string; value: string; price: string }[]>([])
  const [paymentSelected, setPaymentSelected] = useState('')
  const [deliverySelected, setDeliverySelected] = useState('')

  const { t, i18n } = useTranslation()
  const router = useRouter()

  // ** ContextApi
  const { user, setUser } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems, isLoading, isSuccessCreateOrder, isErrorCreateOrder, messageErrorCreateOrder, typeError } =
    useSelector((state: RootState) => state.orderProduct)

  // Memo query product -> get data from query router
  const memoQueryProduct = useMemo(() => {
    const result = {
      totalPrice: 0,
      productsSelected: []
    }
    const data: any = router.query
    if (data) {
      ;(result.totalPrice = data.totalPrice || 0),
        (result.productsSelected = data.productsSelected ? JSON.parse(data.productsSelected) : [])
    }
    return result
  }, [router.query])

  // ** theme
  const theme = useTheme()

  // Handle fetch API payment
  const handleGetListPaymentMethod = async () => {
    await getAllPaymentTypes({ params: { limit: -1, page: -1 } })
      .then((res) => {
        if (res.data) {
          setOptionPayments(
            res?.data?.paymentTypes.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item._id
            }))
          )
          setPaymentSelected(res?.data?.paymentTypes?.[0]?._id)
        }
      })
      .catch((err) => {
        console.log('Checkk error paymentTypes', err)
      })
  }

  // Handle fetch API payment
  const handleGetListDeliveryMethod = async () => {
    await getAllDeliveryTypes({ params: { limit: -1, page: -1 } })
      .then((res) => {
        if (res.data) {
          setOptionDeliveries(
            res?.data?.deliveryTypes.map((item: { name: string; _id: string; price: string }) => ({
              label: item.name,
              value: item._id,
              price: item.price
            }))
          )
          setDeliverySelected(res?.data?.deliveryTypes?.[0]?._id)
        }
      })
      .catch((err) => {
        console.log('Checkk error deliveryTypes', err)
      })
  }

  // Handle Change delivery
  const handleChangeDelivery = (value: string) => {
    setDeliverySelected(value)
  }

  // Handle Change payment
  const handleChangePayment = (value: string) => {
    setPaymentSelected(value)
  }

  useEffect(() => {
    handleGetListPaymentMethod()
    handleGetListDeliveryMethod()
  }, [])

  // Handle Buy Now
  const handleOrderProduct = () => {
    const findItemDelivery = optionDeliveries.find((item) => item.value === deliverySelected)
    const shippingPrice = findItemDelivery ? +findItemDelivery.price : 0
    const totalPrice = memoQueryProduct.totalPrice + shippingPrice
    dispatch(
      createOrderProductAsync({
        orderItems: memoQueryProduct.productsSelected as TItemOrderProduct[],
        itemsPrice: +memoQueryProduct.totalPrice,
        paymentMethod: paymentSelected,
        deliveryMethod: deliverySelected,
        user: user ? user._id : '',
        fullName: user
          ? handleToFullName(
              user?.lastName as string,
              user?.middleName as string,
              user?.firstName as string,
              i18n.language
            ) || 'Le Hoang Trong'
          : '',
        address: user ? user?.address || 'Hồ Chí Minh' : '',
        city: user?.city as string,
        phone: user?.phoneNumber as string,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice
      })
    )
  }

  useEffect(() => {
    if (isSuccessCreateOrder) {
      toast.success(t('Create_order_success'))
      dispatch(resetInitialState())
      // Set  selectedRow lại thành một cái array rỗng
    } else if (isErrorCreateOrder && messageErrorCreateOrder) {
      toast.error(t('Create_order_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateOrder, isErrorCreateOrder, messageErrorCreateOrder])

  return (
    <>
      {/* {loading && <Spinner />} */}
      {/* Phương thức thanh toán của checkout */}
      <Box
        sx={{
          // height: '80vh',
          // width: '100%',
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',

          borderRadius: '15px'
        }}
      >
        {memoQueryProduct?.productsSelected?.length > 0 ? (
          <Fragment>
            {/* Rows Name field order product table */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '8px',
                mb: '10px'
              }}
            >
              <Typography
                sx={{
                  width: '120px',
                  marginLeft: '10px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontWeight: 600
                }}
              >
                {t('Image_product')}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexBasis: '30%',
                  fontWeight: 600
                }}
              >
                {t('Name_product')}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexBasis: '20%',
                  fontWeight: 600
                }}
              >
                {t('Price_original')}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexBasis: '20%',
                  fontWeight: 600
                }}
              >
                {t('Price_discount')}
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexBasis: '10%',
                  fontWeight: 600
                }}
              >
                {t('Amount_product')}
              </Typography>
            </Box>
            <Divider />
            {/* Grid Content Order Product */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '10px',
                mt: '10px'
              }}
            >
              {memoQueryProduct?.productsSelected?.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {/* <Box
                        sx={{
                          width: 'calc(15% - 120px)'
                        }}
                      >
                        <Checkbox
                          checked={selectedRows.includes(item.product)}
                          value={item.product}
                          onChange={(e) => {
                            handleChangeCheckbox(e.target.value)
                          }}
                        />
                      </Box> */}
                      {/* Image Product */}
                      <StyleAvatar
                        sx={{
                          width: '120px',
                          height: '120px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        src={item.image}
                      />

                      {/* Name product */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexBasis: '30%',
                          maxWidth: '100%'
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '20px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                            mt: 2
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                      {/* Price Original */}

                      <Box
                        sx={{
                          flexBasis: '20%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant='h6'
                          mt={2}
                          sx={{
                            color: item.discount > 0 ? theme.palette.error.main : theme.palette.primary.main,
                            fontWeight: 'bold',
                            textDecoration: item.discount ? 'line-through' : 'normal',
                            fontSize: '16px'
                          }}
                        >
                          {`${formatNumberToLocale(item.price)} VND`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexBasis: '20%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        {item.discount > 0 && (
                          <Typography
                            variant='h4'
                            mt={2}
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                              fontSize: '17px'
                            }}
                          >
                            {`${formatNumberToLocale((item.price * (100 - item.discount)) / 100)} VND`}
                          </Typography>
                        )}
                        {/* Discount percent */}
                        {item.discount > 0 && (
                          <Box
                            sx={{
                              backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                              width: '32px',
                              height: '14px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '2px'
                            }}
                          >
                            <Typography
                              variant='h6'
                              sx={{
                                color: theme.palette.error.main,
                                fontSize: '10px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              -{item.discount}%
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {/* Button Increase Decrease */}
                      <Box
                        sx={{
                          flexBasis: '10%',
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant='h6'
                          mt={2}
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}
                        >
                          {item.amount}
                        </Typography>
                      </Box>
                      {/* Xoá */}
                      {/* <Box
                        sx={{
                          flexBasis: '5%',
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <IconButton
                          sx={{
                            color: theme.palette.primary.main
                          }}
                        >
                          <CustomIcon fontSize={35} icon='material-symbols-light:delete-outline-sharp' />
                        </IconButton>
                      </Box> */}
                    </Box>
                    {/* Khi mà index > 0 và thằng cuối cùng sẽ không hiển thị */}
                    {index !== memoQueryProduct?.productsSelected?.length - 1 && <Divider />}
                  </Fragment>
                )
              })}
            </Box>
          </Fragment>
        ) : (
          // Width 100% để thằng này nó nằm ở chính giữa luôn
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                padding: '20px',
                width: '100%'
              }}
            >
              <NoData widthImage='60px' heightImage='60px' textNodata={t('No_data_product')} />
            </Box>
          </Box>
        )}
        {/* Sum tổng giá tiền của giỏ hàng  */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>{t('Sum_price')}:</Typography>
          <Typography sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.primary.main }}>
            {`${formatNumberToLocale(memoQueryProduct.totalPrice)} VND`}
          </Typography>
        </Box>
      </Box>
      {/* Sản phẩm của checkout */}
      <Box
        sx={{
          // height: '80vh',
          // width: '100%',
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px',
          mt: 6
        }}
      >
        {/* Delivery type */}
        <Box>
          <FormControl
            sx={{
              flexDirection: 'row !important',
              gap: 10
            }}
          >
            <FormLabel
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                width: '260px'
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeDelivery(e.target.value)}
              aria-labelledby='delivery-group'
              name='radio-delivery-group'
            >
              {optionDeliveries.map((delivery) => {
                return (
                  <FormControlLabel
                    key={delivery.value}
                    value={delivery.value}
                    control={<Radio checked={deliverySelected === delivery.value} />}
                    label={delivery.label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>
        {/* Payment type */}
        <Box
          sx={{
            mt: 2
          }}
        >
          <FormControl
            sx={{
              flexDirection: 'row !important',
              gap: 10
            }}
          >
            <FormLabel
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                width: '260px'
              }}
              id='payment-group'
            >
              {t('Select_payment_type')}
            </FormLabel>
            <RadioGroup
              sx={{
                position: 'relative',
                top: '-6px'
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangePayment(e.target.value)}
              aria-labelledby='payment-group'
              name='radio-payment-group'
            >
              {optionPayments.map((payment) => {
                return (
                  <FormControlLabel
                    key={payment.value}
                    value={payment.value}
                    control={<Radio checked={paymentSelected === payment.value} />}
                    label={payment.label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      {/* Button Buy Now */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          mt: 4
        }}
      >
        <Button
          // disabled={!selectedRows.length}
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 'bold'
          }}
          onClick={handleOrderProduct}
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Place_your_order')}
        </Button>
      </Box>
    </>
  )
}

export default CheckoutProductpage
