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
  cloneDeep,
  convertFileToBase64,
  convertUpdateProductToCart,
  formatNumberToLocale,
  handleToFullName,
  separationFullName
} from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateMeAuthAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// ** Toast
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'
import CustomModal from 'src/components/custom-modal'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'
import { TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { increaseProductOrder, updateProductToCart } from 'src/stores/order-product'
import { TProduct } from 'src/types/product'
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import NoData from 'src/components/no-data'
import product from 'src/stores/product'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { getAllOrderProductsAsync } from 'src/stores/order-product/actions'

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

const MyOrderPage: NextPage<TProps> = () => {
  // ** State
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** ContextApi
  const { user, setUser } = useAuth()

  // ** theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { ordersProductOfMe, orderItems } = useSelector((state: RootState) => state.orderProduct)

  // Fetch API get order Product of me
  const handleGetListOrderProductsOfMe = () => {
    const query = {
      params: { limit: pageSize, page: page }
    }
    dispatch(getAllOrderProductsAsync(query))
  }

  useEffect(() => {
    handleGetListOrderProductsOfMe()
  }, [i18n.language, page, pageSize])

  return (
    <>
      {/* {loading && <Spinner />} */}
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
        {ordersProductOfMe?.data?.length > 0 ? (
          <Fragment>
            {/* Name field order product table */}
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
                  width: '200px',
                  marginLeft: '20px',
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
                  flexBasis: '15%',
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
              {ordersProductOfMe?.data.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {/* Checkbox product cart */}
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
                          flexBasis: '12%',
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <CustomTextField
                          type='number'
                          size='small'
                          value={item.amount}
                          // onChange={(e) => {
                          //   handleChangeAmountCart(item, +e.target.value)
                          // }}
                          inputProps={{
                            inputMode: 'numeric',
                            min: 1
                            // max: item.countInStock
                          }}
                          // style={{
                          //   WebkitAppearance: 'none',
                          //   appearance: 'none',
                          //   MozAppearance: 'none'
                          // }}
                          sx={{
                            // '.MuiInputBase-root.MuiFilledInput-root': {
                            //   borderRadius: '0px',
                            //   borderTop: 'none',
                            //   borderRight: 'none'
                            // },
                            '.MuiInputBase-input.MuiFilledInput-input': {
                              width: '30px'
                            },
                            '& .MuiInputBase-root.MuiInputBase-input': {
                              width: '20px !important',
                              color: 'blue'
                            }
                          }}
                        />
                      </Box>
                      {/* Xoá */}
                    </Box>
                    {/* Khi mà index > 0 và thằng cuối cùng sẽ không hiển thị */}
                    {index !== ordersProductOfMe?.data?.length - 1 && <Divider />}
                  </Fragment>
                )
              })}
            </Box>
          </Fragment>
        ) : (
          // Width 100% để thằng này nó nằm ở chính giữa luôn
          <Box
            sx={{
              padding: '20px',
              width: '100%'
            }}
          >
            <NoData widthImage='60px' heightImage='60px' textNodata={t('No_data_product')} />
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
            {/* {`${formatNumberToLocale(memoTotalPriceSelectedProducts)} VND`} */}
          </Typography>
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
          disabled={!selectedRows.length}
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 'bold'
          }}
          // onClick={handleNavigateCheckoutProduct}
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </>
  )
}

export default MyOrderPage
