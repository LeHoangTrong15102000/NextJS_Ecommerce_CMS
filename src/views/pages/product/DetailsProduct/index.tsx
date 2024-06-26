// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'

// ** MUI
import { Avatar, Box, Button, FormHelperText, Grid, InputLabel, Rating, Typography, useTheme } from '@mui/material'
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
// import RegisterDark from '/public/images/register-dark.png'
// import RegisterLight from '/public/images/register-light.png'

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
  convertFileToBase64,
  convertUpdateProductToCart,
  formatFilter,
  formatNumberToLocale,
  handleToFullName,
  isExpireDiscountDate,
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
import {
  getDetailsProductPublic,
  getDetailsProductPublicBySlug,
  getListRelatedProductBySlug
} from 'src/services/product'
import { useRouter } from 'next/router'
import { TProduct } from 'src/types/product'
import Image from 'next/image'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import { updateProductToCart } from 'src/stores/order-product'
import NoData from 'src/components/no-data'
import CardRelatedProduct from 'src/views/pages/product/components/CardRelatedProduct'
import path from 'src/configs/path'
import { getAllReviews } from 'src/services/review-product'
import { TReviewItem } from 'src/types/review-product'
import CardReviewProduct from 'src/views/pages/product/components/CardReviewProduct'
import UpdateReviewProduct from 'src/views/pages/product/components/UpdateReviewProduct'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { deleteReviewProductAsync } from 'src/stores/review-product/actions'
import { resetInitialStateReview } from 'src/stores/review-product'
import { OBJECT_TYPE_ERROR_REVIEW } from 'src/configs/error'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  role: string
  phoneNumber: string
  fullName: string
}

const DetailsProductPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct | any>({})
  const [listRelatedProduct, setListRelatedProduct] = useState<TProduct[]>([])
  const [listReview, setListReview] = useState<TReviewItem[]>([])

  const [amountProduct, setAmountProduct] = useState(1)

  // ** Router
  const router = useRouter()
  // Slug sản phẩm
  const productId = router.query?.productId as string

  // ** Translation
  const { t, i18n } = useTranslation()

  const { user } = useAuth()

  // ** theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  // ** Redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const {
    reviewsProduct,
    isSuccessUpdateReview,
    isErrorUpdateReview,
    isLoading,
    messageErrorUpdateReview,
    isSuccessDeleteReview,
    isErrorDeleteReview,
    messageErrorDeleteReview,
    typeError
  } = useSelector((state: RootState) => state.reviewProduct)

  // Fetch detail product
  const fetchGetDetailsProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublicBySlug(slug)
      .then(async (response) => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setDataProduct(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // Fetch list relate product
  const fetchListRelatedProduct = async (slug: string) => {
    setLoading(true)
    await getListRelatedProductBySlug({ params: { slug: slug } })
      .then(async (response) => {
        setLoading(false)
        const data = response?.data

        if (data) {
          setListRelatedProduct(data.products)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // Fetch All Review Product
  const fetchGetAllListReview = async (productId: string) => {
    setLoading(true)
    await getAllReviews({
      params: {
        limit: -1,
        page: -1,
        order: 'createdAt desc',
        isPublic: true,
        ...formatFilter({ productId })
      }
    })
      .then(async (response) => {
        setLoading(false)
        const data = response?.data?.reviews

        if (data) {
          setListReview(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // handle add product to cart
  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {} //  mặc định thằng parseData sẽ là một cái object
    const discountItem = isExpireDiscountDate(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: amountProduct,
      image: item.image,
      price: item.price,
      discount: discountItem,
      product: item._id,
      slug: item.slug
    })

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setProductCartToLocal({ ...parseData, [user._id]: listOrderItems })
    } else {
      //  Giữ lại cái url để quay lại sau khi đã đăng nhập
      router.replace({
        pathname: path.LOGIN,
        query: { returnUrl: router.asPath }
      })
    }
  }

  // Xử lý
  const memoDiscountDate = useMemo(() => {
    return isExpireDiscountDate(dataProduct.discountStartDate, dataProduct.discountEndDate)
  }, [dataProduct])

  useEffect(() => {
    if (productId) {
      fetchGetDetailsProduct(productId)
      fetchListRelatedProduct(productId)
    } else {
      router.replace({
        pathname: path.LOGIN,
        query: { returnUrl: router.asPath }
      })
    }
  }, [productId, router])

  useEffect(() => {
    if (dataProduct?._id) {
      // Hàm lấy ra những cái danh sách đó
      fetchGetAllListReview(dataProduct._id)
    }
  }, [dataProduct._id])

  // Handle buy now product
  const handleBuyNowProduct = (item: TProduct) => {
    // Đầu tiên thêm hàng vào giỏ hàng
    handleUpdateProductToCart(item)
    // Push user đến trang giỏ hàng
    router.push(
      {
        pathname: path.MY_CART,
        query: {
          productSelected: item._id
        }
      },
      path.MY_CART
    )
  }

  useEffect(() => {
    if (isSuccessUpdateReview) {
      toast.success(t('Update_review_success'))
      fetchGetAllListReview(dataProduct._id)
      dispatch(resetInitialStateReview())
    } else if (isErrorUpdateReview && messageErrorUpdateReview && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_REVIEW[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Update_review_error'))
      }
      // handleCloseUpdate()
      dispatch(resetInitialStateReview())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateReview, isErrorUpdateReview, messageErrorUpdateReview, typeError])

  useEffect(() => {
    if (isSuccessDeleteReview) {
      toast.success(t('Delete_review_success'))
      fetchGetAllListReview(dataProduct._id)
      dispatch(resetInitialStateReview())
    } else if (isErrorDeleteReview && messageErrorDeleteReview) {
      toast.error(t('Delete_review_error'))
      dispatch(resetInitialStateReview())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteReview, isErrorDeleteReview, messageErrorDeleteReview])

  return (
    <>
      {loading && <Spinner />}

      <Grid container>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4
            // overflow: 'none'
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            <Grid container spacing={8}>
              {/* Image */}
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct.image}
                  alt='image_product'
                  width={0}
                  height={0}
                  style={{
                    height: '100%',
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '15px'
                  }}
                />
              </Grid>
              {/* Infomation product */}
              <Grid item md={7}>
                <Box>
                  {/* Name */}
                  <Typography
                    variant='h5'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      '-webkitLineClamp': '2',
                      '-webkitBoxOrient': 'vertical'
                    }}
                  >
                    {dataProduct.name}
                  </Typography>
                  {/* Rating , ,total review, sold */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2
                    }}
                  >
                    {/* Rating */}
                    {dataProduct?.averageRating > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            '-webkitLineClamp': '2',
                            '-webkitBoxOrient': 'vertical',
                            textDecoration: 'underline',
                            fontSize: '16px'
                          }}
                        >
                          {dataProduct.averageRating}
                        </Typography>
                        <Rating
                          name='read-only'
                          sx={{
                            fontSize: '16px'
                          }}
                          defaultValue={dataProduct.averageRating}
                          precision={0.5}
                          readOnly
                        />
                      </Box>
                    )}
                    {/* Total review */}
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {!!dataProduct.totalReviews ? (
                        <span>
                          <b>{dataProduct.totalReviews}</b> {t('Review')}
                        </span>
                      ) : (
                        <span>{t('Not_review')}</span>
                      )}
                    </Typography>
                    {' | '}
                    {/* Sold */}
                    {dataProduct.sold && (
                      <Typography variant='body2' color='text.secondary'>
                        <>{t('Sold')}</> <b>{dataProduct.sold}</b> <>{t('Product')}</>
                      </Typography>
                    )}
                  </Box>
                  {/* Vị trí của sản phẩm */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      mt: 2
                    }}
                  >
                    <CustomIcon icon='carbon:location' />
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      {dataProduct?.location?.name}
                    </Typography>
                  </Box>
                </Box>
                {/* Price, discount Price, discount percent */}
                <Box
                  sx={{
                    display: 'flex',
                    alingItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  {dataProduct.discount > 0 && memoDiscountDate && (
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 'bold',
                        textDecoration: 'line-through',
                        fontSize: '18px'
                      }}
                    >
                      {`${formatNumberToLocale(dataProduct.price)} VND`}
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '24px'
                    }}
                  >
                    {dataProduct.discount > 0 && memoDiscountDate ? (
                      <>{`${formatNumberToLocale((dataProduct.price * (100 - dataProduct.discount)) / 100)} VND`}</>
                    ) : (
                      <> {`${formatNumberToLocale(dataProduct.price)} VND`}</>
                    )}
                  </Typography>
                  {dataProduct.discount > 0 && memoDiscountDate && (
                    <Box
                      sx={{
                        backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                        width: '25px',
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
                          fontSize: '10px'
                        }}
                      >
                        -{dataProduct.discount}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/* Button Increase Decrease and CountInStock */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <Box
                    sx={{
                      mt: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        if (amountProduct > 1) {
                          setAmountProduct((prev) => prev - 1)
                        }
                      }}
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
                      value={amountProduct}
                      onChange={(e) => {
                        if (+e.target.value >= 1) {
                          setAmountProduct(+e.target.value) //Thêm dấu cộng vào thì nó sẽ tự động format sang số cho chúng ta
                        }
                      }}
                      inputProps={{
                        inputMode: 'numeric',
                        min: 1,
                        max: dataProduct.countInStock
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
                        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0
                        },
                        'input[type=number]': {
                          MozAppearance: 'textfield'
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        if (amountProduct < dataProduct.countInStock) {
                          setAmountProduct((prev) => prev + 1)
                        }
                      }}
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white
                      }}
                    >
                      <CustomIcon icon='ic:sharp-plus' />
                    </IconButton>
                  </Box>
                  <Typography
                    sx={{
                      mt: 8
                    }}
                    fontSize={15}
                    variant='body2'
                    color='text.secondary'
                  >
                    {dataProduct.countInStock > 0 ? (
                      <>{t('Count_in_stock_product', { count: dataProduct.countInStock })}</>
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                          width: '60px',
                          height: '20px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '5px',
                          my: 1
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            color: theme.palette.error.main,
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Hết hàng
                        </Typography>
                      </Box>
                    )}
                  </Typography>
                </Box>
                {/*Button add-to-cart and buy-now */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    mt: 4,
                    paddingBottom: '10px'
                  }}
                >
                  {/* Button add to cart */}
                  <Button
                    variant='outlined'
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      fontWeight: 'bold'
                    }}
                    disabled={dataProduct.countInStock < 1}
                    onClick={() => handleUpdateProductToCart(dataProduct)}
                  >
                    <CustomIcon icon='fa6-solid:cart-plus' style={{ position: 'relative', top: '-2px' }} />
                    {t('Add_to_card')}
                  </Button>
                  {/* Buy now button */}
                  <Button
                    variant='contained'
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      fontWeight: 'bold'
                    }}
                    disabled={dataProduct.countInStock < 1}
                    onClick={() => handleBuyNowProduct(dataProduct)}
                  >
                    <CustomIcon
                      icon='icon-park-outline:shopping-bag-one'
                      style={{ position: 'relative', top: '-2px' }}
                    />
                    {t('Buy_now')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* Grid Container description */}
        <Grid container md={12} xs={12} mt={6}>
          {/* Thêm thằng Box vào bên ngoài */}
          <Grid container>
            {/* Grid Left */}
            <Grid container item md={9} xs={12}>
              {/* Fix chiều cao như thế này thì nó sẽ fix được cái chiều cao tối đa vượt quá */}
              <Box
                sx={{
                  width: '100%',
                  heigth: '100%'
                }}
              >
                {/* Box chứa 2 thằng description và title description */}
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: 5,
                    px: 4
                  }}
                >
                  {/* Tiêu đề Description product */}
                  <Box
                    sx={{
                      display: 'flex',
                      alingItems: 'center',
                      gap: 2,
                      mt: 2,
                      backgroundColor: theme.palette.customColors.bodyBg,
                      padding: '8px',
                      borderRadius: '8px'
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}
                    >
                      {t('Description_product')}
                    </Typography>
                  </Box>
                  {/* Nội dung description product */}
                  <Box
                    sx={{
                      mt: 4,
                      color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                      fontSize: '14px',
                      backgroundColor: theme.palette.customColors.bodyBg,
                      padding: 4,
                      borderRadius: '10px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: dataProduct.description
                    }}
                  />
                </Box>
                {/* Review product responsive tablet desktop */}
                <Box
                  display={{ md: 'block', xs: 'none' }}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: 5,
                    px: 4
                  }}
                  marginTop={{ md: 5, xs: 4 }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: `rgba(${theme.palette.customColors.main}, 0.68)`
                    }}
                    mb={2}
                  >
                    {t('Review_product')}{' '}
                    <b
                      style={{
                        color: theme.palette.primary.main
                      }}
                    >
                      {listReview?.length}
                    </b>{' '}
                    {t('Rating_review')}
                  </Typography>
                  <Grid container spacing={4} mt={{ md: 0, xs: 1 }}>
                    {listReview &&
                      listReview.map((review: TReviewItem) => {
                        return (
                          <Grid key={review._id} item md={4} xs={12}>
                            <CardReviewProduct item={review} />
                          </Grid>
                        )
                      })}
                  </Grid>
                </Box>
              </Box>
            </Grid>
            {/* Grid Right */}
            <Grid container item md={3} xs={12} mt={{ md: 0, xs: 5 }}>
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '15px',
                  py: 5,
                  px: 4
                  // overflowY: 'scroll'
                }}
                marginLeft={{ md: 5, xs: 0 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alingItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                  >
                    {t('Product_same')}
                  </Typography>
                </Box>
                {/* Nội dung description product */}
                <Box
                  sx={{
                    mt: 4,
                    borderRadius: '8px',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {/* List sản phẩm tương tự */}
                  {listRelatedProduct.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      {listRelatedProduct.map((item) => {
                        return <CardRelatedProduct key={item._id} item={item} />
                      })}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItem: 'center',
                        justifyContent: 'center',
                        mt: 10
                      }}
                    >
                      <NoData widthImage='100px' heightImage='100px' textNodata={t('No_data_product')} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            {/* Review product responsive mobile */}
            <Box
              display={{ md: 'none', xs: 'block' }}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
              marginTop={{ md: 5, xs: 4 }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: `rgba(${theme.palette.customColors.main}, 0.68)`
                }}
                mb={2}
              >
                {t('Review_product')}{' '}
                <b
                  style={{
                    color: theme.palette.primary.main
                  }}
                >
                  {listReview?.length}
                </b>{' '}
                {t('Rating_review')}
              </Typography>
              <Grid container spacing={4} mt={{ md: 0, xs: 1 }}>
                {listReview &&
                  listReview.map((review: TReviewItem) => {
                    return (
                      <Grid key={review._id} item md={4} xs={12}>
                        <CardReviewProduct item={review} />
                      </Grid>
                    )
                  })}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailsProductPage
