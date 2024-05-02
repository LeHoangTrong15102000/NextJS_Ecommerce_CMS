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
import React, { useState } from 'react'
import { Box, BoxProps, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'
import CustomIcon from 'src/components/Icon'

type TFilterProduct = {
  handleFilterProduct: (value: string, type: string) => void
  optionCities: {
    label: string
    value: string
  }[]
  // isShowBtnReset: boolean
  // Bấm vào để reset đi cái state ở trang HOME ở trên
  handleReset: () => void
  locationSelected: string
  reviewSelected: string
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const StyleFilterProduct = styled(Box)<BoxProps>(({ theme }) => ({
  // boxShadow: theme.shadows[4],
  padding: '10px',
  border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
  borderRadius: '15px',
  backgroundColor: theme.palette.background.paper
}))

const FilterProduct = (props: TFilterProduct) => {
  const { handleFilterProduct, optionCities, locationSelected, reviewSelected, handleReset } = props

  const { t } = useTranslation()
  const theme = useTheme()
  const listReviewProducts = FILTER_REVIEW_PRODUCT()

  const handleChangeFilter = (value: string, type: string) => {
    handleFilterProduct(value, type)
  }

  const handleResetFilter = () => {
    // Khi mà chạy thì nó sẽ gọi hàm handleResetFilter
    handleReset()
  }

  return (
    <StyleFilterProduct sx={{ width: '100%', padding: 4 }}>
      {Boolean(locationSelected || reviewSelected) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          <Tooltip title={t('Delete_filter')}>
            <IconButton
              sx={{
                color: theme.palette.primary.main
              }}
              onClick={handleResetFilter}
            >
              <CustomIcon icon='material-symbols-light:delete-outline-sharp' />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Box>
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
          <RadioGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeFilter(e.target.value, 'review')}
            aria-labelledby='radio-group-review'
            name='radio-reviews-group'
          >
            {listReviewProducts.map((review) => {
              return (
                <FormControlLabel
                  key={review.value}
                  value={review.value}
                  control={<Radio checked={reviewSelected === review.value} />}
                  label={review.label}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box
        sx={{
          mt: 2
        }}
      >
        <FormControl>
          <FormLabel
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600
            }}
            id='radio-group-location'
          >
            {t('Location')}
          </FormLabel>
          <RadioGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeFilter(e.target.value, 'location')}
            aria-labelledby='radio-group-location'
            name='radio-locations-group'
          >
            {optionCities.map((city) => {
              return (
                <FormControlLabel
                  key={city.value}
                  value={city.value}
                  control={<Radio checked={locationSelected === city.value} />}
                  label={city.label}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>
    </StyleFilterProduct>
  )
}

export default FilterProduct
