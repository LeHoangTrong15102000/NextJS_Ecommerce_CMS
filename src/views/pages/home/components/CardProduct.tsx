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
  boxShadow: theme.shadows[4]
  // border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
}))

const CardProduct = (props: TCardProduct) => {
  const { item } = props

  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <StyleCard sx={{ width: '100%' }}>
      <CardMedia component='img' height='194' image={item.image} alt='image_product' />
      <CardContent
        sx={{
          padding: '8px 12px'
        }}
      >
        <Typography
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold'
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
              {item.price}
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
            {item.discount > 0 ? <>{(item.price * (100 - item.discount)) / 100} VNĐ</> : <> {item.price} VNĐ</>}
          </Typography>
          {item.discount > 0 && (
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
                {item.discount}%
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
