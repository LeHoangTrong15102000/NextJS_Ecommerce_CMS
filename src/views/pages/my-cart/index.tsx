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
  seperationFullName
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

const MyCartPage: NextPage<TProps> = () => {
  // ** State
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [amountProduct, setAmountProduct] = useState()

  const { t, i18n } = useTranslation()

  // ** ContextApi
  const { user, setUser } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // Lấy ra các danh sách ProductId của orderItems
  const memoListAllProductIds = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item.product)
  }, [orderItems])

  // is All Checked
  const isAllChecked = memoListAllProductIds.every((productId) => selectedRows.includes(productId))

  // ** theme
  const theme = useTheme()

  // Handle Increase Cart
  const handleIncreaseCart = (item: TItemOrderProduct) => {
    // Cũng phải lấy data trong localStorage ra
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug
    })
    // Tại vì chúng ta biết rằng cái trang này của chúng ta cũng đã đăng nhập rồi nhưng mà chúng ta vẫn check cho chắc
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      // giữ lại giá trị của các tài khoản khác, thay đổi listOrderItems của thằng user đang thưc hiện
      setProductCartToLocal({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  // Handle Decrease Cart
  const handleDecreaseCart = (item: TItemOrderProduct) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: -1,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug
    })
    // Tại vì chúng ta biết rằng cái trang này của chúng ta cũng đã đăng nhập rồi nhưng mà chúng ta vẫn check cho chắc
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      // giữ lại giá trị của các tài khoản khác, thay đổi listOrderItems của thằng user đang thưc hiện
      setProductCartToLocal({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  const handleChangeAmountCart = (item: TItemOrderProduct, amount: number) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: amount,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug
    })
    // Tại vì chúng ta biết rằng cái trang này của chúng ta cũng đã đăng nhập rồi nhưng mà chúng ta vẫn check cho chắc
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      // giữ lại giá trị của các tài khoản khác, thay đổi listOrderItems của thằng user đang thưc hiện
      setProductCartToLocal({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  // Handle Delete Product Cart
  const handleDeleteProductCart = (productId: string) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItems = cloneDeep(orderItems) // Tạo ra một cloneOrderItems
    // Filter cái orderItems (Cái nào xoá thì bỏ đi)
    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => item.product !== productId)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setProductCartToLocal({ ...parseData, [user?._id]: filteredItems })
    }
  }

  // Handle Delete All Product Cart
  const handleDeleteAllProductCart = () => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItems = cloneDeep(orderItems) // Tạo ra một cloneOrderItems
    // Trả về những thằng nào không n ằm trong thằng selectedRows
    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => !selectedRows.includes(item.product))
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setProductCartToLocal({ ...parseData, [user?._id]: filteredItems })
    }
  }

  // Handle Checkbox Item Product
  const handleChangeCheckbox = (value: string) => {
    const isChecked = selectedRows.includes(value) // bằng true là thằng này đã được checked rồi
    if (isChecked) {
      const filtered = selectedRows.filter((item) => item !== value)
      setSelectedRows(filtered)
    } else {
      setSelectedRows([...selectedRows, value])
    }
  }

  //  Handle Checbox All Item Product
  const handleChangeCheckAll = () => {
    if (isAllChecked) {
      setSelectedRows([])
    } else {
      setSelectedRows(memoListAllProductIds)
    }
  }

  // Handle Buy Now
  const handleBuyNow = () => {}

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
        {orderItems.length > 0 ? (
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
              <Box
                sx={{
                  width: 'calc(10% -220px)'
                }}
              >
                <Tooltip title={t('Select_all')}>
                  <Checkbox checked={isAllChecked} onChange={handleChangeCheckAll} />
                </Tooltip>
              </Box>
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
                  flexBasis: '10%',
                  fontWeight: 600
                }}
              >
                {t('Amount_product')}
              </Typography>
              <Box
                sx={{
                  flexBasis: '5%',
                  display: 'flex'
                }}
              >
                <Tooltip title={t('Delete_all')}>
                  <IconButton
                    disabled={!selectedRows.length}
                    sx={{
                      color: theme.palette.primary.main
                    }}
                    onClick={() => handleDeleteAllProductCart()}
                  >
                    <CustomIcon fontSize={35} icon='material-symbols-light:delete-forever-sharp' />
                  </IconButton>
                </Tooltip>
              </Box>
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
              {orderItems.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Box
                        sx={{
                          width: 'calc(15% - 150px)'
                        }}
                      >
                        <Checkbox
                          checked={selectedRows.includes(item.product)}
                          value={item.product}
                          onChange={(e) => {
                            handleChangeCheckbox(e.target.value)
                          }}
                        />
                      </Box>
                      {/* Image Product */}
                      <StyleAvatar
                        sx={{
                          width: '150px',
                          height: '150px'
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
                            fontSize: '24px',
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
                        {item.discount > 0 && (
                          <Typography
                            variant='h6'
                            mt={2}
                            sx={{
                              color: theme.palette.error.main,
                              fontWeight: 'bold',
                              textDecoration: 'line-through',
                              fontSize: '20px'
                            }}
                          >
                            {`${formatNumberToLocale(item.price)} VND`}
                          </Typography>
                        )}
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
                        <Typography
                          variant='h4'
                          mt={2}
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            fontSize: '20px'
                          }}
                        >
                          {item.discount > 0 ? (
                            <>{`${formatNumberToLocale((item.price * (100 - item.discount)) / 100)} VND`}</>
                          ) : (
                            <> {`${formatNumberToLocale(item.price)} VND`}</>
                          )}
                        </Typography>
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
                          gap: 2
                        }}
                      >
                        <IconButton
                          onClick={() => handleChangeAmountCart(item, -1)}
                          sx={{
                            border: `1px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white
                          }}
                        >
                          <CustomIcon icon='ic:sharp-minus' />
                        </IconButton>
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
                            },
                            'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0
                            },
                            'input[type=number]': {
                              MozAppearance: 'textfield'
                            }
                          }}
                        />
                        <IconButton
                          onClick={() => handleChangeAmountCart(item, +1)}
                          sx={{
                            border: `1px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white
                          }}
                        >
                          <CustomIcon icon='ic:sharp-plus' />
                        </IconButton>
                      </Box>
                      {/* Xoá */}
                      <Box
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
                          onClick={() => handleDeleteProductCart(item.product)}
                        >
                          <CustomIcon fontSize={35} icon='material-symbols-light:delete-forever-sharp' />
                        </IconButton>
                      </Box>
                    </Box>
                    {/* Khi mà index > 0 và thằng cuối cùng sẽ không hiển thị */}
                    {index !== orderItems.length - 1 && <Divider />}
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
          onClick={handleBuyNow}
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </>
  )
}

export default MyCartPage
