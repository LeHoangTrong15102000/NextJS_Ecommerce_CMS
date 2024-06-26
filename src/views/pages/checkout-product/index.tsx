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
import { FormControl } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import ModalAddAddress from 'src/views/pages/checkout-product/components/ModalAddAddress'

// ** React-Hook-Form

// ** Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Types
// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Utils
import {
  cloneDeep,
  convertUpdateProductToCart,
  formatNumberToLocale,
  handleToFullName,
  separationFullName
} from 'src/utils'

// ** Toast
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import { TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'
// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { createOrderProductAsync } from 'src/stores/order-product/actions'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'

// ** Service
import { getAllDeliveryTypes } from 'src/services/delivery-type'
import { getAllCities } from 'src/services/city'
import { getAllPaymentTypes } from 'src/services/payment-type'
import ModalWarning from 'src/views/pages/checkout-product/components/ModalWarning'

//  Swal
import Swal from 'sweetalert2'
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'

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
  const [openAddress, setOpenAddress] = useState(false)
  const [loading, setLoading] = useState(false)

  const [openWarning, setOpenWarning] = useState(false)

  // option City
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  // ** theme
  const theme = useTheme()

  const { t, i18n } = useTranslation()
  const router = useRouter()

  // ** ContextApi
  const { user, setUser } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems, isLoading, isSuccessCreateOrder, isErrorCreateOrder, messageErrorCreateOrder, typeError } =
    useSelector((state: RootState) => state.orderProduct)

  // Handle data of productsSelected(dataQuery) from productId and amount
  const handleFormatDataProductSelected = (items: TItemOrderProduct[]) => {
    const objectMap: Record<string, TItemOrderProduct> = {}

    // Gán order cho key(là id orderProduct) của objectMap lúc này object sẽ có key là idProduct và value là `order`
    orderItems.forEach((order: TItemOrderProduct) => {
      objectMap[order.product] = order
    })
    return items.map((item: { product: string; amount: number }) => {
      return {
        ...objectMap[item.product],
        amount: item.amount
      }
    })
  }

  // Memo query product -> get data from query router
  const memoQueryProduct = useMemo(() => {
    const result: {
      totalPrice: number
      productsSelected: TItemOrderProduct[]
    } = {
      totalPrice: 0,
      productsSelected: []
    }
    // Lấy ra data từ router.query, khi mà reload  lại thì dữ liệu trên cái query vẫn còn
    const data: any = router.query
    if (data) {
      ;(result.totalPrice = data.totalPrice || 0),
        (result.productsSelected = data.productsSelected
          ? handleFormatDataProductSelected(JSON.parse(data.productsSelected))
          : [])
    }
    return result
  }, [router.query, orderItems])

  // Handle fetch API payment
  const handleGetListPaymentMethod = async () => {
    setLoading(true)
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
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log('Checkk error paymentTypes', err)
      })
  }

  // Handle fetch API payment
  const handleGetListDeliveryMethod = async () => {
    setLoading(true)
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
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
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

  // Handle default value
  const memoDefaultAddress = useMemo(() => {
    const findAddress = user?.addresses?.find((item) => item.isDefault)
    // const findCity = optionCities.find((item) => item.value === findAddress.city)

    return findAddress
  }, [user?.addresses])

  // Create name City from idCity
  const memoNameCity = useMemo(() => {
    if (memoDefaultAddress) {
      const findCity = optionCities.find((item) => item.value === memoDefaultAddress?.city)

      return findCity?.label
    }
    return ''
  }, [memoDefaultAddress, optionCities])

  // Handle memo Price shipping - Lấy ra giá trị của shipping price
  // Khi mà phương thức giao hàng thay đổi thì giá  tiền sẽ được cập nhật lại
  const memoPriceShipping = useMemo(() => {
    const findItemDelivery = optionDeliveries.find((item) => item.value === deliverySelected)

    return findItemDelivery ? +findItemDelivery?.price : 0
  }, [deliverySelected, optionDeliveries])

  // Handle Buy Now
  const handleOrderProduct = () => {
    // const shippingPrice = findItemDelivery ? +findItemDelivery.price : 0
    const totalPrice = Number(memoQueryProduct.totalPrice) + memoPriceShipping
    dispatch(
      createOrderProductAsync({
        orderItems: memoQueryProduct.productsSelected as TItemOrderProduct[],
        itemsPrice: +memoQueryProduct.totalPrice,
        paymentMethod: paymentSelected,
        deliveryMethod: deliverySelected,
        user: user ? user._id : '',
        fullName: memoDefaultAddress
          ? handleToFullName(
              memoDefaultAddress?.lastName as string,
              memoDefaultAddress?.middleName as string,
              memoDefaultAddress?.firstName as string,
              i18n.language
            )
          : '',
        address: memoDefaultAddress ? memoDefaultAddress?.address : '',
        city: memoDefaultAddress ? memoDefaultAddress?.city : '',
        phone: memoDefaultAddress ? memoDefaultAddress?.phoneNumber : '',
        shippingPrice: memoPriceShipping,
        totalPrice: totalPrice
      })
    )
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

  // Handle change amount product in cart when user order product success
  const handleChangeAmountCart = (items: TItemOrderProduct[]) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}

    // Lúc này objectMap sẽ là những sản phẩm chúng ta vừa mới thêm vào
    const objectMap: Record<string, number> = {}
    items.forEach((item: any) => {
      // Thêm -item.amount là value của key(là idProduct của sản phẩm được thêm vào giỏ hàng)
      // Nên là khi mà  objectMap
      objectMap[item.product] = -item.amount
    })
    const listOrderItems: TItemOrderProduct[] = []
    orderItems?.forEach((order: TItemOrderProduct) => {
      // Nếu n hư mà objectMap[order.product] tức là nó có value từ key của thằng objectMap -> Có nghĩa là thầng chúng ta đang đặt hàng
      if (objectMap[order.product]) {
        listOrderItems.push({
          ...order,
          amount: order.amount + objectMap[order.product] // Thường thì cái  amount chỗ này sau khi mua hàng sẽ về là 0
        })
      } else {
        // Còn những sản phẩm không có trong đơn đặt hàng thì chúng ta se push lại bình thường
        listOrderItems.push(order)
      }
    })

    // Mình sẽ map ở đây để mà giảm thiểu cái update cho redux của chúng ta ở đây
    // const listOrderItems = items.map((item) => {
    //   convertUpdateProductToCart(orderItems, {
    //     name: item.name,
    //     amount: -item.amount,
    //     image: item.image,
    //     price: item.price,
    //     discount: item.discount,
    //     product: item.product,
    //     slug: item.slug
    //   })
    // })
    // Tại vì chúng ta biết rằng cái trang này của chúng ta cũng đã đăng nhập rồi nhưng mà chúng ta vẫn check cho chắc
    const filterListOrder = listOrderItems.filter((item: TItemOrderProduct) => item.amount)
    if (user) {
      dispatch(
        updateProductToCart({
          //  filter listOrderItems một lần nữa
          orderItems: filterListOrder
        })
      )
      // giữ lại giá trị của các tài khoản khác, thay đổi listOrderItems của thằng user đang thưc hiện
      setProductCartToLocal({ ...parseData, [user?._id]: filterListOrder })
    }
  }

  // Handle warning if router.query no exist data
  useEffect(() => {
    // type TQueryProduct = { totalPrice: number, productsSelected: TItemOrderProduct }
    const data: any = router.query
    if (!data?.productsSelected) {
      setOpenWarning(true)
    }
  }, [router.query])

  useEffect(() => {
    if (isSuccessCreateOrder) {
      // toast.success(t('Create_order_success'))
      Swal.fire({
        title: t('Congratulation'),
        text: t('Order_product_success'),
        icon: 'success',
        confirmButtonText: t('Confirm'),
        background: theme.palette.background.paper,
        color: `rgba(${theme.palette.customColors.main},0.78)`
      }).then((result) => {
        if (result.isConfirmed) {
          // console.log('object')
        }
        // console.log({ isConfirm })
      })

      // Xử lý như thế này thì nó sẽ đập redux vào chỉ có một lần duy nhất
      handleChangeAmountCart(memoQueryProduct.productsSelected)
      // Change product cart when user order success, làm theo cách như này thì nó sẽ đập vào redux chúng ta rất nhiều lần
      // memoQueryProduct.productsSelected.map((item: TItemOrderProduct) => {
      //   handleChangeAmountCart(item, -item?.amount)
      // })
      dispatch(resetInitialState())
      // Set  selectedRow lại thành một cái array rỗng
    } else if (isErrorCreateOrder && messageErrorCreateOrder) {
      // toast.error(t('Create_order_error'))
      Swal.fire({
        title: t('Oppps'),
        text: t('Order_product_error'),
        icon: 'error',
        confirmButtonText: t('Confirm'),
        background: theme.palette.background.paper,
        color: `rgba(${theme.palette.customColors.main},0.78)`
      })
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateOrder, isErrorCreateOrder, messageErrorCreateOrder])

  useEffect(() => {
    handleGetListPaymentMethod()
    handleGetListDeliveryMethod()
    fetchAllCities()
  }, [])

  // useEffect(() => {
  //   Swal.fire({
  //     title: t('Congratulation'),
  //     text: t('Order_product_success'),
  //     icon: 'success',
  //     confirmButtonText: t('Confirm'),
  //     background: theme.palette.background.paper,
  //     color: `rgba(${theme.palette.customColors.main},0.78)`
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //     }
  //     // console.log({ isConfirm })
  //   })
  // }, [])

  return (
    <>
      {(loading || isLoading) && <Spinner />}
      <ModalWarning open={openWarning} onClose={() => setOpenWarning(false)} />
      <ModalAddAddress open={openAddress} onClose={() => setOpenAddress(false)} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px',
          mb: 6
        }}
      >
        <Box sx={{ mb: 8 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              flexDirection: 'column'
            }}
          >
            {/* Địa chỉ giao hàng */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <CustomIcon
                icon='carbon:location'
                style={{
                  color: theme.palette.primary.main
                }}
              />
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: theme.palette.primary.main
                }}
              >
                {t('Address_shipping')}
              </Typography>
            </Box>
            {/* Tên người nhận hàng */}
            {/* {user?.address} */}
            <Box
              sx={
                {
                  // backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)}`
                }
              }
            >
              {user && user?.addresses?.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Typography
                    component='span'
                    sx={{
                      color: `rgba(${theme.palette.customColors.main} , 0.78)`,
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                  >
                    {memoDefaultAddress?.phoneNumber}{' '}
                    {handleToFullName(
                      memoDefaultAddress?.lastName as string,
                      memoDefaultAddress?.middleName as string,
                      memoDefaultAddress?.firstName as string,
                      i18n.language
                    )}
                  </Typography>
                  <Typography
                    sx={{
                      color: `rgba(${theme.palette.customColors.main} , 0.78)`,
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                    component='span'
                  >
                    {memoDefaultAddress?.address} {memoNameCity}
                  </Typography>
                  <Button
                    sx={{
                      border: `1px solid ${theme.palette.primary.main}`
                    }}
                    onClick={() => setOpenAddress(true)}
                  >
                    {t('Change_address_shipping')}
                  </Button>
                </Box>
              ) : (
                <Button
                  sx={{
                    border: `1px solid ${theme.palette.primary.main}`
                  }}
                  onClick={() => setOpenAddress(true)}
                >
                  {t('Add_address_shipping')}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

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
        {/* <Box
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
        </Box> */}
      </Box>
      {/* Phương thưc giao hàng và phương thức thah toán */}
      <Box
        sx={{
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
        {/* Tổng tiền thanh toán đơn hàng */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {/* Giá tiền sản phẩm */}
          <Box
            sx={{
              display: 'flex',
              gap: 1
            }}
          >
            <Typography sx={{ fontSize: '20px', width: '200px' }}>{t('Price_item')}:</Typography>
            <Typography sx={{ fontSize: '20px', width: '200px', color: theme.palette.primary.main }}>
              {`${formatNumberToLocale(memoQueryProduct.totalPrice)} VND`}
            </Typography>
          </Box>
          {/* Phí giao hàng */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1
            }}
          >
            <Typography sx={{ fontSize: '20px', width: '200px' }}>{t('Price_shipping')}:</Typography>
            <Typography sx={{ fontSize: '20px', width: '200px', color: theme.palette.primary.main }}>
              {`${formatNumberToLocale(memoPriceShipping)} VND`}
            </Typography>
          </Box>
          {/* Divider phân cách */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '200px'
            }}
          >
            <Typography>
              <Divider />
            </Typography>
          </Box>
          {/* Tổng tiền */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1
            }}
          >
            <Typography sx={{ fontSize: '20px', fontWeight: 600, width: '200px' }}>{t('Sum_price')}:</Typography>
            <Typography sx={{ fontSize: '20px', fontWeight: 600, width: '200px', color: theme.palette.primary.main }}>
              {`${formatNumberToLocale(Number(memoQueryProduct.totalPrice) + memoPriceShipping)} VND`}
            </Typography>
          </Box>
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
