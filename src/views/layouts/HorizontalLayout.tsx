import * as React from 'react'

// ** MUI
import { styled, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { Box, Button } from '@mui/material'

// ** Next
import { NextPage } from 'next'

// ** Component
import CustomIcon from 'src/components/Icon'
import UserDropdown from 'src/views/layouts/components/user-dropdown'
import ModeToggle from './components/mode-toggle'
import LanguageDropdown from './components/language'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { useTranslation } from 'react-i18next'
// import Link from 'src/theme/overrides/link'
import Link from 'next/link'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import CartProduct from 'src/views/layouts/components/cart-product'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

// ReactNode thường là một cái component(page) hoặc là những thằng con bên trong
type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHideMenu?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  // color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

// TODO remove, this demo shouldn't need to reset the theme.
const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
  // ** Hooks
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  const theme = useTheme()

  // handle Navigate
  const handleNavigateLogin = () => {
    if (router.asPath !== path.HOME && router.asPath !== path.LOGIN) {
      router.replace({
        pathname: path.LOGIN,
        query: { returnUrl: router.asPath }
      })
    } else {
      router.replace(path.LOGIN)
    }
  }

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '30px', // keep right padding when drawer closed
          margin: '0 20px'
        }}
      >
        {!isHideMenu && (
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            {/* <MenuIcon /> */}
            <CustomIcon icon='material-symbols:menu' />
          </IconButton>
        )}

        <Typography
          component='h1'
          variant='h6'
          color={theme.palette.primary.main}
          noWrap
          sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
        >
          <Link
            style={{
              color: 'inherit'
            }}
            href={path.HOME}
          >
            E-Commerce CMS
          </Link>
        </Typography>
        {/* Language */}
        <Box sx={{ marginRight: '20px' }}>
          <LanguageDropdown />
        </Box>
        {/* Dark mode */}
        <ModeToggle />
        {/* Cart Product */}
        <CartProduct />
        {user ? (
          <UserDropdown />
        ) : (
          <Button variant='contained' sx={{ ml: 2, width: 'auto' }} onClick={handleNavigateLogin}>
            {t('SignIn')}
          </Button>
        )}
        {/* Notification */}
        {/* <IconButton color='inherit'>
          <Badge badgeContent={4} color='primary'>
            <CustomIcon icon='mingcute:notification-line' />
          </Badge>
        </IconButton> */}
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalLayout
