// ** MUI
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
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
import { Button } from '@mui/material'
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

const CardProduct = (props: TCardProduct) => {
  const { t } = useTranslation()
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader title='Shrimp and Chorizo Paella' subheader='September 14, 2016' />
      <CardMedia component='img' height='194' image='/static/images/cards/paella.jpg' alt='Paella dish' />
      <CardContent
        sx={{
          padding: '8px 24px'
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of
          frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          padding: '8px 24px'
        }}
      >
        <IconButton aria-label='add to favorites'>
          <CustomIcon icon='clarity:heart-solid' />
        </IconButton>
        {/* <IconButton aria-label='share'>
          <ShareIcon />
        </IconButton> */}
      </CardActions>
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
    </Card>
  )
}

export default CardProduct
