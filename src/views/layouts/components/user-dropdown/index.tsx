// ** MUI
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Badge, Typography, styled } from '@mui/material'

// ** React
import { Fragment, useState } from 'react'

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
import { handleToFullName } from 'src/utils'

type TProps = {}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const StyledMenu = styled(Menu)(({ theme }) => ({
  '.MuiList-root.MuiMenu-list': {
    minWidth: '200px'
  }
}))

const UserDropdown = (props: TProps) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { t, i18n } = useTranslation()

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Khi nhấn vào thì đóng cái menu đồng thời chuyển sang trang my profile
  const handleRedirectMyProfile = () => {
    router.push(path.PROFILE)
    handleClose()
  }

  const handleRedirectChangePassword = () => {
    router.push(path.CHANGE_PASSWORD)
    handleClose()
  }

  const handleRedirectManageSystem = () => {
    router.push(path.DASHBOARD)
    handleClose()
  }

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    alt='avatar-user'
                    width={0}
                    height={0}
                    style={{
                      height: '32px',
                      width: '32px'
                    }}
                  />
                ) : (
                  <CustomIcon icon='ph:user-thin' />
                )}
              </Avatar>
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </Box>
      <StyledMenu
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
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2, pb: 2, px: 2 }}>
          <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt='avatar-user'
                  width={0}
                  height={0}
                  style={{
                    height: '32px',
                    width: '32px'
                  }}
                />
              ) : (
                <CustomIcon icon='ph:user-thin' />
              )}
            </Avatar>
          </StyledBadge>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component='span'>
              {handleToFullName(
                user?.lastName as string,
                user?.middleName as string,
                user?.firstName as string,
                i18n.language
              )}
            </Typography>
            <Typography component='span'>{user?.role?.name}</Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleRedirectManageSystem}>
          <Avatar>
            <CustomIcon icon='material-symbols:vpn-lock-sharp ' />
          </Avatar>
          {t('manage_system')}
        </MenuItem>

        <MenuItem onClick={handleRedirectMyProfile}>
          <Avatar>
            <CustomIcon icon='ph:user-thin' />
          </Avatar>
          {t('my_profile')}
        </MenuItem>
        <MenuItem onClick={handleRedirectChangePassword}>
          <Avatar>
            <CustomIcon icon='material-symbols:lock-outline' />
          </Avatar>
          {t('Change_password')}
        </MenuItem>
        <MenuItem onClick={logout}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <CustomIcon icon='material-symbols:logout-sharp' />
          </Avatar>
          {t('Logout')}
        </MenuItem>
      </StyledMenu>
    </Fragment>
  )
}

export default UserDropdown
