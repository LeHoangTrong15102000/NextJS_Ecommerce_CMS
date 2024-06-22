// ** MUI
import { styled, useTheme } from '@mui/material/styles'
import Card, { CardProps } from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// import FavoriteIcon from '@mui/icons-material/Favorite'
// import ShareIcon from '@mui/icons-material/Share'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import MoreVertIcon from '@mui/icons-material/MoreVert'

// ** React
import { useEffect, useMemo, useState } from 'react'
import CustomIcon from 'src/components/Icon'
import { Box, Button, Palette, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { Rating } from '@mui/material'
import { convertUpdateProductToCart, formatNumberToLocale, isExpireDiscountDate } from 'src/utils'
import { TItemOrderProduct } from 'src/types/order-product'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// Local storage
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { likeProductAsync, unlikeProductAsync } from 'src/stores/product/actions'

interface TCardProduct {
  item: TProduct
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const StyleCard = styled(Card)<CardProps>(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.shadows[4],
  // border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain'
  }
  // minHeight: '525px'
}))

const CardProduct = (props: TCardProduct) => {
  const { item } = props

  const { t } = useTranslation()
  const theme = useTheme()

  const router = useRouter()
  const { user } = useAuth()

  // ** Redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()
  const {
    isLoading,
    isSuccessLike,
    isErrorLike,
    messageErrorLike,
    isSuccessUnLike,
    isErrorUnLike,
    messageErrorUnLike,
    typeError
  } = useSelector((state: RootState) => state.product)

  // handle Navigate details
  const handleNavigateDetails = (slug: string) => {
    router.push(`${path.PRODUCT}/${slug}`)
  }

  // handle add product to cart
  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {} //  mặc định thằng parseData sẽ là một cái object
    const discountItem = isExpireDiscountDate(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: 1,
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

  // Handle like product
  const handleToggleLikeProduct = (productId: string, isLiked: boolean) => {
    if (user?._id) {
      // user?.likedProducts.includes(productId) -> có thể kiểm tra theo 2 hướng như vậy
      if (isLiked) {
        dispatch(unlikeProductAsync({ productId: productId }))
      } else {
        dispatch(likeProductAsync({ productId: productId }))
      }
    } else {
      //  Giữ lại cái url để quay lại sau khi đã đăng nhập
      router.replace({
        pathname: path.LOGIN,
        query: { returnUrl: router.asPath }
      })
    }
  }

  const memoDiscountDate = useMemo(() => {
    return isExpireDiscountDate(item.discountStartDate, item.discountEndDate)
  }, [item])

  // console.log('Checkk valid discount', { value: isExpireDiscountDate(item.discountStartDate, item.discountEndDate) })

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

  return (
    <StyleCard sx={{ width: '100%' }}>
      <CardMedia component='img' height='194' image={item.image} alt='image_product' />
      <CardContent
        sx={{
          padding: '8px 12px',
          minHeight: '205px'
        }}
      >
        <Typography
          onClick={() => handleNavigateDetails(item.slug)}
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkitLineClamp': '2',
            '-webkitBoxOrient': 'vertical',
            minHeight: '48px',
            mb: 2
          }}
        >
          {item.name}
        </Typography>
        {/* Giá tiền */}
        <Box
          sx={{
            display: 'flex',
            alingItems: 'center',
            gap: 2
          }}
        >
          {item.discount > 0 && memoDiscountDate && (
            <Typography
              variant='h6'
              sx={{
                color: theme.palette.error.main,
                fontWeight: 'bold',
                textDecoration: 'line-through',
                fontSize: '14px'
              }}
            >
              {`${formatNumberToLocale(item.price)} VND`}
            </Typography>
          )}
          <Typography
            variant='h4'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            {item.discount > 0 && memoDiscountDate ? (
              <>{`${formatNumberToLocale((item.price * (100 - item.discount)) / 100)} VND`}</>
            ) : (
              <> {`${formatNumberToLocale(item.price)} VND`}</>
            )}
          </Typography>
          {item.discount > 0 && memoDiscountDate && (
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
        {/* số sao với số lượng sản phẩm còn trong kho */}
        <Typography variant='body2' color='text.secondary'>
          {item.countInStock > 0 ? (
            <>{t('Count_in_stock_product', { count: item.countInStock })}</>
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

        {/* Sản phẩm đã bán */}

        {item.sold && (
          <Typography variant='body2' color='text.secondary'>
            <>{t('Sold')}</> <b>{item.sold}</b> <>{t('Product')}</>
          </Typography>
        )}
        {/* Vị trí của sản phẩm */}
        {item?.location?.name && (
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
              {item?.location?.name}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {!!item.averageRating && (
              <Typography
                sx={{
                  display: 'flex',
                  alingItems: 'center'
                  // gap: 1
                }}
              >
                <b>{item.averageRating}</b>
                <Rating
                  name='read-only'
                  sx={{
                    fontSize: '16px',
                    ml: 2
                  }}
                  defaultValue={item?.averageRating}
                  precision={0.5}
                  readOnly
                />
                {/* <CustomIcon
                  icon='emojione:star'
                  fontSize={16}
                  style={{
                    position: 'relative',
                    top: '2px'
                  }}
                /> */}
              </Typography>
            )}
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {!!item.totalReviews ? <b>{item.totalReviews} đánh giá</b> : <span>{t('Not_review')}</span>}
            </Typography>
          </Box>
          <Tooltip title={t('Product_can_like')}>
            <IconButton
              onClick={() => handleToggleLikeProduct(item._id, Boolean(item?.likedBy.includes(user?._id as string)))}
            >
              {user && item?.likedBy.includes(user._id) ? (
                <CustomIcon
                  icon='tabler:heart-filled'
                  style={{
                    color: theme.palette.primary.main
                  }}
                />
              ) : (
                <CustomIcon
                  icon='tabler:heart'
                  style={{
                    color: theme.palette.primary.main
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
      {/*Button add-to-cart and buy-now */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
          padding: '0 12px 10px'
        }}
      >
        {/* Button add to cart */}
        <Button
          variant='outlined'
          fullWidth
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 'bold'
          }}
          disabled={item.countInStock < 1}
          onClick={() => handleUpdateProductToCart(item)}
        >
          <CustomIcon icon='fa6-solid:cart-plus' style={{ position: 'relative', top: '-2px' }} />
          {t('Add_to_card')}
        </Button>
        {/* Buy now button */}
        <Button
          variant='contained'
          fullWidth
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 'bold'
          }}
          disabled={item.countInStock < 1}
          onClick={() => handleBuyNowProduct(item)}
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </StyleCard>
  )
}

export default CardProduct
