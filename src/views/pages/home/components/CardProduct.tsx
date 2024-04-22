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

interface TCardProduct {}

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
  position: 'relative'
}))

const CardProduct = (props: TCardProduct) => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <StyleCard sx={{ maxWidth: 345 }}>
      <IconButton
        sx={{
          position: 'absolute',
          top: '6px',
          right: '6px'
        }}
      >
        <CustomIcon icon='clarity:heart-solid' />
      </IconButton>
      <CardMedia component='img' height='194' image='/static/images/cards/paella.jpg' alt='Paella dish' />
      <CardContent
        sx={{
          padding: '8px 24px'
        }}
      >
        <Typography
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold'
          }}
        >
          Shrimp and Chorizo Paella
        </Typography>
        {/* Giá tiền */}
        <Box
          sx={{
            display: 'flex',
            alingItems: 'center',
            gap: 2
          }}
        >
          <Typography
            variant='h6'
            sx={{
              color: theme.palette.error.main,
              fontWeight: 'bold',
              textDecoration: 'line-through',
              fontSize: '14px'
            }}
          >
            500.000 VNĐ
          </Typography>
          <Typography
            variant='h4'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            500.000 VNĐ
          </Typography>
        </Box>
        {/* số sao với số lượng sản phẩm còn trong kho */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            Còn <b>7</b> sản phẩm trong kho
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alingItems: 'center',
              gap: 1
            }}
          >
            <b>5</b>
            <CustomIcon
              icon='emojione:star'
              fontSize={16}
              style={{
                position: 'relative',
                top: '2px'
              }}
            />
          </Typography>
        </Box>
      </CardContent>
      {/* Button add to cart */}
      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
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
    </StyleCard>
  )
}

export default CardProduct
