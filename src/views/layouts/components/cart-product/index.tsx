// ** MUI
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { Badge, Typography, styled, useTheme } from '@mui/material'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** Component
import CustomIcon from '../../../../components/Icon'

// ** Next
import Image from 'next/image'
import { Router, useRouter } from 'next/router'

// ** hooks
import { useAuth } from 'src/hooks/useAuth'

// ** I18next
import { useTranslation } from 'react-i18next'

// ** Config
import path from 'src/configs/path'

// ** Utils
import { formatNumberToLocale, handleToFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'
import { getProductCartFromLocal } from 'src/helpers/storage'
import { updateProductToCart } from 'src/stores/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import NoData from 'src/components/no-data'

type TProps = {}

const StyleMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  minWidth: '400px'
}))

const CartProduct = (props: TProps) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  // ** Theme
  const theme = useTheme()

  // ** I18n
  const { t, i18n } = useTranslation()

  // ** Redux
  const { userData } = useSelector((state: RootState) => state.auth)
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const dispatch: AppDispatch = useDispatch()

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const productCart = getProductCartFromLocal()
    const parseProduct = productCart ? JSON.parse(productCart) : {}
    console.log('parseDataa', { parseProduct })
    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: parseProduct[user?._id] || [] // Để tránh bị undefined thì nếu mà nó không có thì sẽ là array rỗng
        })
      )
    }
  }, [user])

  // Total length cart, Tính toán lại số lượng
  // useMemo để hạn chế ảnh hưởng tới cái peformance của chúng ta mà thôi
  const totalItemsCart = useMemo(() => {
    const total = orderItems?.reduce((result, currentValue: TItemOrderProduct) => {
      return result + currentValue.amount
    }, 0)

    return total
  }, [orderItems])

  // Handle navigate detail product
  const handleNavigateDetailProduct = (slug: string) => {
    router.push(`${path.PRODUCT}/${slug}`)
  }

  // Handle navigate my cart
  const handleNavigateMyCart = () => {
    router.push(`${path.MY_CART}`)
  }

  // console.log('Checkkk orderItems', { orderItems })

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Cart')}>
          <IconButton onClick={handleClick} color='inherit'>
            {!!orderItems?.length ? (
              <Badge color='primary' badgeContent={totalItemsCart}>
                <CustomIcon icon='fa6-solid:cart-plus' />
              </Badge>
            ) : (
              <CustomIcon icon='fa6-solid:cart-plus' />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 60,
              height: 60,
              ml: -0.5,
              mr: 1,
              objectFit: 'contain'
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {orderItems.length > 0 ? (
          <>
            <Box
              sx={{
                maxHeight: '300px',
                minWidth: '400px',
                overflow: 'auto'
              }}
            >
              {orderItems?.map((item: TItemOrderProduct) => (
                <StyleMenuItem key={item.product} onClick={() => handleNavigateDetailProduct(item.slug)}>
                  <Avatar
                    sx={{
                      // width: '100%',
                      // heigth: '100%',
                      '.MuiAvatar-img': {
                        objectFit: 'contain',
                        width: 80,
                        height: 80
                      }
                    }}
                    src={item.image}
                  />

                  <Box>
                    <Typography
                      sx={{
                        width: '300px',
                        fontSize: '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.name}
                    </Typography>
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
                          fontSize: '14px'
                        }}
                      >
                        {item.discount > 0 ? (
                          <>{`${formatNumberToLocale((item.price * (100 - item.discount)) / 100)} VND`}</>
                        ) : (
                          <> {`${formatNumberToLocale(item.price)} VND`}</>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </StyleMenuItem>
              ))}
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type='submit'
                variant='contained'
                sx={{
                  mt: 3,
                  mb: 2,
                  mr: 2,
                  borderRadius: '4px'
                }}
                onClick={handleNavigateMyCart}
              >
                {t('View_cart')}
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              padding: '20px',
              width: '100%',
              minWidth: '400px'
            }}
          >
            <NoData widthImage='60px' heightImage='60px' textNodata={t('No_data_product')} />
          </Box>
        )}
      </Menu>
    </Fragment>
  )
}

export default CartProduct
