// ** MUI
import Box, { BoxProps } from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// ** React
import { Fragment, useState } from 'react'

// ** Component
import CustomIcon from '../../../../components/Icon'

// ** Next
import Image from 'next/image'

// ** hooks
import { useAuth } from 'src/hooks/useAuth'

// ** I18next
import { useTranslation } from 'react-i18next'
import { Typography, styled } from '@mui/material'

// ** Config
import { LANGUAGE_OPTIONS } from 'src/configs/i18n'

type TProps = {}

type TLanguage = {
  lang: string
  value: string
}

interface TStyledItem extends BoxProps {
  selected: boolean
}

const StyledMenuItemLanguage = styled(MenuItem)<TStyledItem>(({ theme, selected }) => {
  return {
    '.MuiTypography-root': {
      color: selected && '#FFF',
      '&:hover': {
        color: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.common.white
      }
    }
  }
})

const LanguageDropdown = (props: TProps) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Hooks
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()

  const open = Boolean(anchorEl)
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOnChangeLang = (lang: string) => {
    //  Thì để mà change ngôn ngữ dùng như sau
    i18n.changeLanguage(lang)
  }

  return (
    <>
      <IconButton color='inherit' id='language-dropdown' onClick={handleOpen}>
        <CustomIcon icon='ic:sharp-translate' />
      </IconButton>
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
        {LANGUAGE_OPTIONS.map((lang) => (
          <StyledMenuItemLanguage
            selected={lang.value === i18n.language}
            key={lang.value}
            onClick={() => handleOnChangeLang(lang.value)}
          >
            <Typography>{lang.language}</Typography>
          </StyledMenuItemLanguage>
        ))}
      </Menu>
    </>
  )
}

export default LanguageDropdown
