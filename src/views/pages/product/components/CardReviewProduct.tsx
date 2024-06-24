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
import { TReviewItem } from 'src/types/review-product'

interface TCardReviewProduct {
  item: TReviewItem
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

const CardReviewProduct = (props: TCardReviewProduct) => {
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

  // console.log('Checkk valid discount', { value: isExpireDiscountDate(item.discountStartDate, item.discountEndDate) })

  return <StyleCard sx={{ width: '100%' }}></StyleCard>
}

export default CardReviewProduct
