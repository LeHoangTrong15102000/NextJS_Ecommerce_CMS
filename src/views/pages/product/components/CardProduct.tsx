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
import { red } from '@mui/material/colors'

// import FavoriteIcon from '@mui/icons-material/Favorite'
// import ShareIcon from '@mui/icons-material/Share'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import MoreVertIcon from '@mui/icons-material/MoreVert'

// ** React
import { useState } from 'react'
import CustomIcon from 'src/components/Icon'
import { Box, Button, Palette } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { Rating } from '@mui/material'
import { convertAddProductToCart, formatNumberToLocale } from 'src/utils'
import { TItemOrderProduct } from 'src/types/order-product'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { addProductToCart } from 'src/stores/order-product'

// Local storage
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

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
}))

const CardProduct = (props: TCardProduct) => {
  const { item } = props

  const { t } = useTranslation()
  const theme = useTheme()

  const router = useRouter()
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.cartProduct)

  // handle Navigate details
  const handleNavigateDetails = (slug: string) => {
    router.push(`${path.PRODUCT}/${slug}`)
  }

  // handle add product to cart
  const handleAddProductToCart = (item: TProduct) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {} //  mặc định thằng parseData sẽ là một cái object
    const listOrderItems = convertAddProductToCart(orderItems, {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item._id
    })
    dispatch(
      addProductToCart({
        orderItems: listOrderItems
      })
    )

    if (user?._id) {
      setProductCartToLocal({ ...parseData, [user._id]: listOrderItems })
    }
  }

  return (
    <StyleCard sx={{ width: '100%' }}>
      <CardMedia component='img' height='194' image={item.image} alt='image_product' />
      <CardContent
        sx={{
          padding: '8px 12px'
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
            minHeight: '48px'
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
          {item.discount > 0 && (
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
            {item.discount > 0 ? (
              <>{`${formatNumberToLocale((item.price * (100 - item.discount)) / 100)} VND`}</>
            ) : (
              <> {`${formatNumberToLocale(item.price)} VND`}</>
            )}
          </Typography>
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
        {/* số sao với số lượng sản phẩm còn trong kho */}
        <Typography variant='body2' color='text.secondary'>
          {item.countInStock > 0 ? (
            <>{t('Count_in_stock_product', { count: item.countInStock })}</>
          ) : (
            <span>Hết hàng</span>
          )}
        </Typography>
        {/* Sản phẩm đã bán */}

        {item.sold && (
          <Typography variant='body2' color='text.secondary'>
            <>{t('Sold_product', { sold: item.sold })}</>
          </Typography>
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
                    fontSize: '16px'
                  }}
                  defaultValue={item?.averageRating}
                  precision={0.5}
                  readOnly
                />
                <CustomIcon
                  icon='emojione:star'
                  fontSize={16}
                  style={{
                    position: 'relative',
                    top: '2px'
                  }}
                />
              </Typography>
            )}
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {!!item.totalReviews ? <b>{item.totalReviews}</b> : <span>{t('Not_review')}</span>}
            </Typography>
          </Box>
          <IconButton>
            <CustomIcon icon='clarity:heart-solid' />
          </IconButton>
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
          onClick={() => handleAddProductToCart(item)}
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
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </StyleCard>
  )
}

export default CardProduct
