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
import { Box, BoxProps, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'

interface TFilterProduct {}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const StyleFilterProduct = styled(Box)<BoxProps>(({ theme }) => ({
  // boxShadow: theme.shadows[4],
  padding: '10px',
  border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
  borderRadius: '15px'
}))

const FilterProduct = (props: TFilterProduct) => {
  // const { item } = props

  const { t } = useTranslation()
  const theme = useTheme()
  const listReviewProducts = FILTER_REVIEW_PRODUCT()

  return (
    <StyleFilterProduct sx={{ width: '100%' }}>
      <FormControl>
        <FormLabel
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600
          }}
          id='radio-group-review'
        >
          {t('Review')}
        </FormLabel>
        <RadioGroup aria-labelledby='radio-group-review' name='radio-reviews-group'>
          {listReviewProducts.map((review) => {
            return <FormControlLabel key={review.value} value={review.value} control={<Radio />} label={review.label} />
          })}
        </RadioGroup>
      </FormControl>
    </StyleFilterProduct>
  )
}

export default FilterProduct
