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

const StyledItemLanguage = styled(Box)<TStyledItem>(({ theme, selected }) => {
  return {
    cursor: 'pointer',
    borderRadius: '10px',
    '.MuiTypography-root': {
      padding: '8px 20px',
      '&:hover': {
        color: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.common.white
      }
    }
    // '&:hover': {
    //   color: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.secondary.light
    //   // color: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.common.black
    // }
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
      <Popper
        id={'language-dropdown'}
        open={open}
        onClick={handleClose}
        anchorEl={anchorEl}
        sx={{
          borderRadius: '8px',
          zIndex: 9999,
          boxShadow: '1px 1px 9px 0px rgba(47, 43, 61, 0.15)'
        }}
      >
        <Box sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
          {LANGUAGE_OPTIONS.map((lang) => (
            <StyledItemLanguage
              selected={lang.value === i18n.language}
              key={lang.value}
              onClick={() => handleOnChangeLang(lang.value)}
            >
              <Typography>{lang.language}</Typography>
            </StyledItemLanguage>
          ))}

          {/* <StyledItemLanguage>
            <Typography>English</Typography>
          </StyledItemLanguage> */}
        </Box>
      </Popper>
    </>
  )
}

export default LanguageDropdown
