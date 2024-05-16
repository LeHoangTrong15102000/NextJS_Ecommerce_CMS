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

import { TCardOrderProductMe, TItemOrderProductOfMe } from 'src/types/order-product'
import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { getAllOrderProductsOfMeAsync, getDetailsOrderOfMeAsync } from 'src/stores/order-product/actions'
import CardOrder from 'src/views/pages/my-order/components/CardOrder'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import InputSearch from 'src/components/input-search'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/order-product'
import { formatNumberToLocale } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import CustomIcon from 'src/components/Icon'

type TProps = {}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

const VALUE_OPTION_STATUS = {
  // 0: wait payment, 1: wait delivery, 2: done, 3: cancel
  WAIT_PAYMENT: 0,
  WAIT_DELIVERY: 1,
  DONE: 2,
  CANCEL: 3,
  ALL: 4
}

const MyOrderDetailsPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

  const dataOrder: any = []
  const [searchBy, setSearchBy] = useState('')
  // Mặc định nó sẽ là all
  const [statusSelected, setStatusSelected] = useState(VALUE_OPTION_STATUS.ALL)

  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()
  const orderId = router.query.orderId as string

  const OPTIONS_STATUS = [
    {
      label: t('All_status_order'),
      value: VALUE_OPTION_STATUS.ALL
    },
    {
      label: t('Wait_payment'),
      value: VALUE_OPTION_STATUS.WAIT_PAYMENT
    },
    {
      label: t('Wait_delivery'),
      value: VALUE_OPTION_STATUS.WAIT_DELIVERY
    },
    {
      label: t('Done_order_product'),
      value: VALUE_OPTION_STATUS.DONE
    },
    {
      label: t('Canceled_order_product'),
      value: VALUE_OPTION_STATUS.CANCEL
    }
  ]

  // ** theme
  const theme = useTheme()

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

  // Fetch API get order Product of me
  const handleGetDetailsOrderOfMe = async () => {
    const res = await getDetailsOrderOfMeAsync(orderId)
    console.log('Check res get details order', { res })
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  const handleChangeStatusTabOrder = (event: React.SyntheticEvent, newValue: string) => {
    setStatusSelected(+newValue)
  }

  useEffect(() => {
    if (orderId) {
      handleGetDetailsOrderOfMe()
    }
  }, [orderId])

  // useEffect(() => {
  //   if (isSuccessCancelOrderOfMe) {
  //     toast.success(t('Cancel_order_product_success'))
  //     handleGetDetailsOrderOfMe()
  //     dispatch(resetInitialState())
  //   } else if (isErrorCancelOrderOfMe && messageCancelOrderOfMe) {
  //     toast.error(t('Cancel_order_product_error'))
  //     dispatch(resetInitialState())
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccessCancelOrderOfMe, isErrorCancelOrderOfMe, messageCancelOrderOfMe])

  return (
    <>
      {(loading || isLoading) && <Spinner />}
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
            justifyContent: 'flex-end',
            mb: 2,
            gap: 2
          }}
        >
          {/* {dataOrder.status === 2 && (
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
          )} */}
          <Typography
            sx={{
              textTransform: 'uppercase',
              color: theme.palette.primary.main,
              fontWeight: 600
            }}
          >
            {/* {(statusOrderProduct as Record<number, { label: string; value: number }>)[dataOrder.status].label} */}
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
        >
          {dataOrder.length > 0 &&
            dataOrder?.orderItems?.map((item: TItemOrderProductOfMe) => {
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
            {/* {`${formatNumberToLocale(dataOrder.totalPrice)} VND`} */}
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
          {/* {[0, 1].includes(+dataOrder.status) && (
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
              // onClick={() => setOpenCancel(true)}
            >
              {t('Cancel_order_product')}
            </Button>
          )} */}
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
            // onClick={handleBuyAgainProduct}
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
            // onClick={handleViewDetailOrder}
          >
            {t('View_detail_order_product')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default MyOrderDetailsPage
