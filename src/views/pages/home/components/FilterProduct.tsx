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
import { Box, BoxProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'

interface TFilterProduct {}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const StyleFilterProduct = styled(Box)<BoxProps>(({ theme }) => ({
  boxShadow: theme.shadows[4]
}))

const FilterProduct = (props: TFilterProduct) => {
  // const { item } = props

  const { t } = useTranslation()
  const theme = useTheme()
  const listReviewProducts = FILTER_REVIEW_PRODUCT()

  return <StyleFilterProduct sx={{ width: '100%' }}>Filter Product</StyleFilterProduct>
}

export default FilterProduct
