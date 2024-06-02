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
  convertUpdateMultipleProductsCart,
  convertUpdateProductToCart,
  formatNumberToLocale,
  isExpireDiscountDate
} from 'src/utils'

// ** Redux

// ** Toast

import { TCardOrderProductMe, TItemOrderProduct, TItemOrderProductOfMe } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrderProductOfMeAsync } from 'src/stores/order-product/actions'
import toast from 'react-hot-toast'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'
import { STATUS_ORDER_PRODUCT } from 'src/configs/statusOrder'
import { TProduct } from 'src/types/product'
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import { useRouter } from 'next/router'
import path from 'src/configs/path'

type TProps = {
  dataOrder: TCardOrderProductMe
}

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

const CardOrder: NextPage<TProps> = (props) => {
  const { dataOrder } = props

  // ** Status Order Product
  const statusOrderProduct = STATUS_ORDER_PRODUCT()

  // ** State
  const [openCancel, setOpenCancel] = useState(false)

  const { t, i18n } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isSuccessCancelOrderOfMe, orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** theme
  const theme = useTheme()

  // ** Router
  const router = useRouter()

  // ** useAuth hook
  const { user } = useAuth()

  // Handle confirm cancel order
  const handleCloseConfirmCancelOrder = () => {
    setOpenCancel(false)
  }

  const handleConfirmCancelOrder = () => {
    // dispatch
    dispatch(cancelOrderProductOfMeAsync(dataOrder._id))
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
      dataOrder.orderItems.map((item) => ({
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

  // bên đây thì chỉ cần dùng lại isSuccessCancelOrderOfMe
  useEffect(() => {
    if (isSuccessCancelOrderOfMe) {
      handleCloseConfirmCancelOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCancelOrderOfMe])

  // Disabled buy again if countInStock sold out
  const memoDisabledBuyAgain = useMemo(() => {
    return dataOrder?.orderItems?.some((item: TItemOrderProductOfMe) => !item.product.countInStock)
  }, [dataOrder.orderItems])

  // Handle navigate details order
  const handleNavigateDetailsOrder = () => {
    router.push(`${path.MY_ORDER}/${dataOrder._id}`)
  }

  return (
    <>
      {/* {loading && <Spinner />} */}

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
          // height: '80vh',
          // width: '100%',
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
            justifyContent: 'flex-end',
            mb: 2,
            gap: 2
          }}
        >
          {dataOrder.status === 2 && (
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
            {(statusOrderProduct as Record<number, { label: string; value: string }>)[dataOrder.status].label}
          </Typography>
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
            gap: 4,
            cursor: 'pointer'
          }}
          onClick={handleNavigateDetailsOrder}
        >
          {dataOrder?.orderItems?.map((item: TItemOrderProductOfMe) => {
            return (
              <Box
                key={item.product._id}
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
        {/*Button add-to-cart and buy-now */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            mt: 6
            // padding: '0 12px 10px'
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
            disabled={memoDisabledBuyAgain}
            onClick={handleBuyAgainProduct}
          >
            {t('Buy_again_product')}
          </Button>
          {/* Buy now button */}
          <Button
            variant='outlined'
            sx={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontWeight: 'bold'
            }}
            onClick={handleNavigateDetailsOrder}
          >
            {t('View_detail_order_product')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CardOrder
