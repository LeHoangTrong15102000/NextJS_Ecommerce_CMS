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
import { useMemo, useState } from 'react'
import CustomIcon from 'src/components/Icon'
import { Box, Button, Palette } from '@mui/material'
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

interface TCardRelatedProduct {
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
  boxShadow: theme.shadows[5],
  // border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain'
  }
}))

const CardRelatedProduct = (props: TCardRelatedProduct) => {
  const { item } = props

  const { t } = useTranslation()
  const theme = useTheme()

  const router = useRouter()
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // handle Navigate details
  const handleNavigateDetails = (slug: string) => {
    router.push(`${path.PRODUCT}/${slug}`)
  }

  const memoDiscountDate = useMemo(() => {
    return isExpireDiscountDate(item.discountStartDate, item.discountEndDate)
  }, [item])

  // console.log('Checkk valid discount', { value: isExpireDiscountDate(item.discountStartDate, item.discountEndDate) })

  return (
    <StyleCard sx={{ width: '100%' }}>
      <CardMedia component='img' height='160' image={item.image} alt='image_product' />
      <CardContent
        sx={{
          padding: '8px 12px 12px !important'
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
            // minHeight: '48px',
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
                fontSize: '12px'
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
              fontSize: '15px'
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
            <>
              <b>{item?.sold}</b> {t('Sold_product')}
            </>
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
                  alingItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <b>{Math.round(item.averageRating)}</b>
                <Rating
                  name='read-only'
                  sx={{
                    fontSize: '16px'
                  }}
                  defaultValue={item?.averageRating}
                  precision={0.5}
                  readOnly
                  size='medium'
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
          {/* <IconButton>
            <CustomIcon icon='clarity:heart-solid' />
          </IconButton> */}
        </Box>
      </CardContent>
    </StyleCard>
  )
}

export default CardRelatedProduct
