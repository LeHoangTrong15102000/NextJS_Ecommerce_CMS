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
  FormHelperText,
  Grid,
  InputLabel,
  ListItem,
  styled,
  Tab,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { IconButton } from '@mui/material'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// ** Toast

import { TCardOrderProductMe, TItemOrderProduct, TItemOrderProductOfMe } from 'src/types/order-product'
import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import {
  cancelOrderProductOfMeAsync,
  getAllOrderProductsOfMeAsync,
  getDetailsOrderOfMeAsync
} from 'src/stores/order-product/actions'
import CardOrder from 'src/views/pages/my-order/components/CardOrder'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import InputSearch from 'src/components/input-search'
import toast from 'react-hot-toast'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'
import { convertUpdateMultipleProductsCart, formatNumberToLocale } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import CustomIcon from 'src/components/Icon'
import { STATUS_ORDER_PRODUCT } from 'src/configs/statusOrder'
import { getDetailsOrderProductByMe } from 'src/services/order-product'
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import path from 'src/configs/path'
import ConfirmationDialog from 'src/components/confirmation-dialog'

type TProps = {}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const MyOrderDetailsPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

  const [openCancel, setOpenCancel] = useState(false)
  const [dataOrder, setDataOrder] = useState<TItemOrderProductOfMe | any>({} as any)

  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()
  const orderId = router.query.orderId as string

  // ** theme
  const theme = useTheme()

  // ** useAuth
  const { user } = useAuth()

  // ** Status Order Product
  const statusOrderProduct = STATUS_ORDER_PRODUCT()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const {
    ordersProductOfMe,
    orderItems,
    isLoading,
    isSuccessCancelOrderOfMe,
    isErrorCancelOrderOfMe,
    messageCancelOrderOfMe
  } = useSelector((state: RootState) => state.orderProduct)

  // Handle confirm cancel order
  const handleCloseConfirmCancelOrder = () => {
    setOpenCancel(false)
  }

  // Fetch API get order Product of me
  const handleGetDetailsOrderOfMe = async () => {
    setLoading(true)
    await getDetailsOrderProductByMe(orderId)
      .then((res) => {
        setLoading(false)
        setDataOrder(res?.data)
        // console.log('Check res detail order', { res })
      })
      .catch((err) => {
        setLoading(false)
        console.log({ err })
      })
  }

  // handle add product to cart
  const handleUpdateProductToCart = (items: TItemOrderProduct[]) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {} //  mặc định thằng parseData sẽ là một cái object
    // const discountItem = isExpireDiscountDate(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    // Lúc này thì listOrderItems sẽ có kiểu là [{...}, {...}]
    const listOrderItems = convertUpdateMultipleProductsCart(orderItems, items)

    // console.log({ listOrderItems })
    // Nếu có user thì dispatch mua lại sản phẩm
    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setProductCartToLocal({ ...parseData, [user._id]: listOrderItems })
    }
  }

  // Handle buy now product
  const handleBuyAgainProduct = () => {
    // Đầu tiên thêm hàng vào giỏ hàng
    // orderItems là chứa những sản phẩm ở trong đơn đặt hàng của chúng ta
    handleUpdateProductToCart(
      dataOrder.orderItems.map((item: any) => ({
        name: item.name,
        amount: item.amount,
        image: item.image,
        price: item.price,
        discount: item.discount, // về phần validate discount thì chúng ta đã làm ở cart-product nên không cần phải kiểm tra ở đây nữa
        product: item.product._id,
        slug: item.product.slug
      }))
    )
    // Push user đến trang giỏ hàng
    router.push(
      {
        pathname: path.MY_CART,
        query: {
          // Truyền  array productId qua cart component
          productSelected: dataOrder?.orderItems?.map((item: TItemOrderProductOfMe) => item.product._id)
        }
      },
      path.MY_CART
    )
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  // Handle confirm cancel order
  const handleConfirmCancelOrder = () => {
    // dispatch
    dispatch(cancelOrderProductOfMeAsync(dataOrder._id))
  }

  const memoDisabledBuyAgain = useMemo(() => {
    return dataOrder?.orderItems?.some((item: TItemOrderProductOfMe) => !item.product.countInStock)
  }, [dataOrder.orderItems])

  useEffect(() => {
    if (orderId) {
      handleGetDetailsOrderOfMe()
    }
  }, [orderId])

  useEffect(() => {
    if (isSuccessCancelOrderOfMe) {
      toast.success(t('Cancel_order_product_success'))
      handleGetDetailsOrderOfMe()
      dispatch(resetInitialState())
    } else if (isErrorCancelOrderOfMe && messageCancelOrderOfMe) {
      toast.error(t('Cancel_order_product_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCancelOrderOfMe, isErrorCancelOrderOfMe, messageCancelOrderOfMe])

  return (
    <>
      {(loading || isLoading) && <Spinner />}
      <ConfirmationDialog
        open={openCancel}
        handleClose={handleCloseConfirmCancelOrder}
        handleCancel={handleCloseConfirmCancelOrder}
        handleConfirm={handleConfirmCancelOrder}
        title={t('Title_cancel_order')}
        description={t('Confirm_cancel_order')}
      />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        {/* Status order product */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            gap: 2
          }}
        >
          {/* Button back list order */}
          <Button startIcon={<CustomIcon icon='lets-icons:back' />} onClick={() => router.back()}>
            {t('Back_list_order')}
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              jusitfyContent: 'center',
              gap: 2
            }}
          >
            {dataOrder?.status === 2 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <CustomIcon icon='mage:delivery-truck' />
                <Typography>
                  <span
                    style={{
                      color: theme.palette.success.main
                    }}
                  >
                    {t('Order_has_been_delivery')}
                  </span>
                  <span>{' | '}</span>
                </Typography>
              </Box>
            )}
            <Typography
              sx={{
                textTransform: 'uppercase',
                color: theme.palette.primary.main,
                fontWeight: 600
              }}
            >
              {(statusOrderProduct as Record<number, { label: string; value: string }>)[dataOrder?.status]?.label}
            </Typography>
          </Box>
        </Box>
        {/* separate way order product */}
        <Divider />
        {/* Content order product */}
        <Box
          mt={2}
          mb={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4
          }}
        >
          {dataOrder?.orderItems?.map((item: TItemOrderProduct) => {
            return (
              <Box
                key={item.product}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {/* Image Product */}
                <Box
                  sx={{
                    border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
                  }}
                >
                  <StyleAvatar
                    sx={{
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    src={item.image}
                  />
                </Box>
                <Box>
                  {/* Name product */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '18px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        display: 'block'
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  {/* Price product */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    {/* Price Original */}
                    <Typography
                      variant='h6'
                      sx={{
                        color: item.discount > 0 ? theme.palette.error.main : theme.palette.primary.main,
                        textDecoration: item.discount ? 'line-through' : 'normal',
                        fontSize: '14px'
                      }}
                    >
                      {`${formatNumberToLocale(item.price)} VND`}
                    </Typography>
                    {/* Price discount and percent discount */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      {item.discount > 0 && (
                        <Typography
                          variant='h4'
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: '14px'
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
                  </Box>
                  {/* Amount Buy product */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      x {item.amount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          {/* Info user */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            {/* Info address */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 4
              }}
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Address_shipping')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.address} {dataOrder?.shippingAddress?.city.name}
              </Typography>
            </Box>
            {/* Phone Number */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 4
              }}
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Phone_number')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.phone}
              </Typography>
            </Box>
            {/* user name */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 4
              }}
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Order_name_user')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.fullName}
              </Typography>
            </Box>
          </Box>
          {/* Price */}
          <Box>
            {/* Items Price */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 4
              }}
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Price_item')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {`${formatNumberToLocale(dataOrder.itemsPrice)} VND`}
              </Typography>
            </Box>
            {/* Shipping price */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 4
              }}
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Price_shipping')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {`${formatNumberToLocale(dataOrder.shippingPrice)} VND`}
              </Typography>
            </Box>
            {/* Total price */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 4
              }}
            >
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('Sum_price')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {`${formatNumberToLocale(dataOrder.totalPrice)} VND`}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/*Button Cancel  order and Buy again */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            mt: 6
          }}
        >
          {/* Cancel order product of me */}
          {[0, 1].includes(+dataOrder.status) && (
            <Button
              variant='outlined'
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: '#da251d',
                backgroundColor: 'transparent',
                border: '1px solid #da251d'
              }}
              onClick={() => setOpenCancel(true)}
            >
              {t('Cancel_order_product')}
            </Button>
          )}
          {/* Button add to cart */}
          <Button
            variant='contained'
            sx={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontWeight: 'bold'
            }}
            // disabled={memoDisabledBuyAgain}
            onClick={handleBuyAgainProduct}
          >
            {t('Buy_again_product')}
          </Button>
          {/* Buy now button */}
        </Box>
      </Box>
      <Box mt={4}>
        <CustomPagination
          onChangePagination={handleOnChangePagination}
          pageSizeOptions={PAGE_SIZE_OPTION}
          pageSize={pageSize}
          page={page}
          rowLength={ordersProductOfMe.total}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default MyOrderDetailsPage
