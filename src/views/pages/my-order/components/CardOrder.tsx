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
import { TCardOrderProductMe, TItemOrderProduct } from 'src/types/order-product'
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
import CustomPagination from 'src/components/custom-pagination'

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
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

  const { t, i18n } = useTranslation()

  // ** theme
  const theme = useTheme()

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
            {/* <CustomIcon icon='fa6-solid:cart-plus' style={{ position: 'relative', top: '-2px' }} /> */}
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
            {/* <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} /> */}
            {t('View_detail_order_product')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CardOrder
