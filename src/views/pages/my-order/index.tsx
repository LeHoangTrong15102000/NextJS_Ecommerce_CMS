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
  const [amountProduct, setAmountProduct] = useState()

  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** ContextApi
  const { user, setUser } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // Lấy ra các danh sách ProductId của orderItems
  const memoListAllProductIds = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item.product)
  }, [orderItems])

  // Handle get selected product haved choose
  const memoSelectedProducts = useMemo(() => {
    // Sẽ lấy ra được cái array chứa các object sản phẩm đã được chọn
    return selectedRows.map((idSelected) => {
      const findItem: any = orderItems.find((item: TItemOrderProduct) => item.product === idSelected)
      if (findItem) {
        return {
          ...findItem
        }
      }
    })
  }, [selectedRows, orderItems])

  // Handle Calculator price sum minus price discount
  // Belong on memoSelectedProducts
  const memoTotalPriceSelectedProducts = useMemo(() => {
    const total = memoSelectedProducts.reduce((result, current: TItemOrderProduct) => {
      const currentPrice = current?.discount > 0 ? (current?.price * (100 - current?.discount)) / 100 : current?.price
      return result + currentPrice * current?.amount
    }, 0)

    return total
  }, [memoSelectedProducts])

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

  //  Handle Checbox All Item Product, xử lý  thay đổi thằng checkboxAll
  const handleChangeCheckAll = () => {
    // Nếu mà đã check rồi thì bỏ check đi và lúc này các checkbox con cũng sẽ bỏ check
    if (isAllChecked) {
      setSelectedRows([])
    } else {
      setSelectedRows(memoListAllProductIds)
    }
  }

  // Handle Buy Now
  const handleNavigateCheckoutProduct = () => {
    // Do thằng productsSelected là một cái array cho nên cần phải đổi sang thằng JSON
    const formatData = JSON.stringify(
      memoSelectedProducts.map((item) => ({ product: item.product, amount: item.amount }))
    )
    router.push({
      pathname: path.CHECKOUT_PRODUCT,
      query: {
        totalPrice: memoTotalPriceSelectedProducts,
        productsSelected: formatData
      }
    })
  }

  // useEffect handle router.query product when user click buy now button
  useEffect(() => {
    // console.log({ value: router.query })
    const productSelected = router.query?.productSelected as string
    // Nếu có productSelected thì mới set nó vào không thì nó sẽ bị undefined
    if (productSelected) {
      setSelectedRows([productSelected])
    }
    console.log({ productSelected })
  }, [router.query])

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
                  flexBasis: '15%',
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
                    <CustomIcon fontSize={35} icon='material-symbols-light:delete-outline-sharp' />
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
                          width: 'calc(15% - 120px)'
                        }}
                      >
                        <Checkbox
                          // lúc này nếu mà những productId của những sản phẩm đều nằm trong selectedRows khi mà người dùng nhấn vào button checkAll
                          checked={selectedRows.includes(item.product)}
                          value={item.product}
                          onChange={(e) => {
                            // Lúc này value sẽ là idProduct của sản phẩm
                            // console.log('E', { value: e.target.value })
                            handleChangeCheckbox(e.target.value)
                          }}
                        />
                      </Box>
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
                          <CustomIcon fontSize={35} icon='material-symbols-light:delete-outline-sharp' />
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
            {`${formatNumberToLocale(memoTotalPriceSelectedProducts)} VND`}
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
          onClick={handleNavigateCheckoutProduct}
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </>
  )
}

export default MyOrderPage
