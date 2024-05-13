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
import { formatNumberToLocale } from 'src/utils'

// ** Redux

// ** Toast

import { TCardOrderProductMe, TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrderProductOfMeAsync } from 'src/stores/order-product/actions'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/order-product'

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

  // ** State
  const [openCancel, setOpenCancel] = useState(false)

  const { t, i18n } = useTranslation()

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

  // ** theme
  const theme = useTheme()

  // Handle confirm cancel order
  const handleCloseConfirmCancelOrder = () => {
    setOpenCancel(false)
  }

  const handleConfirmCancelOrder = () => {
    // dispatch
    dispatch(cancelOrderProductOfMeAsync(dataOrder._id))
  }

  // bên đây thì chỉ cần dùng lại isSuccessCancelOrderOfMe
  useEffect(() => {
    if (isSuccessCancelOrderOfMe) {
      handleCloseConfirmCancelOrder()
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCancelOrderOfMe])

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
        <Divider />
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
          >
            {t('View_detail_order_product')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CardOrder
