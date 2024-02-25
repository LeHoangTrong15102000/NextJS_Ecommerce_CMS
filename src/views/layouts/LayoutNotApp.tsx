import * as React from 'react'

// ** MUI
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

import Container from '@mui/material/Container'

// ** Component Layout

// ** Next
import { NextPage } from 'next'
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import { useTheme } from '@mui/material'

// ReactNode thường là một cái component(page) hoặc là những thằng con bên trong
type TProps = {
  children: React.ReactNode
}

// TODO remove, this demo shouldn't need to reset the theme.
const LayoutNotApp: NextPage<TProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  // const toggleDrawer = () => {
  //   setOpen(!open)
  // }

  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* HorizontalLayout */}
      <HorizontalLayout open={open} toggleDrawer={() => {}} isHideMenu />

      {/* Vertical layout */}
      {/* <VerticalLayout open={open} toggleDrawer={() => {}} /> */}
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            // backgroundColor: theme.palette.background.paper,
            width: 'calc(100vw - 32px)',
            maxWidth: 'unset !important',
            overflow: 'auto',
            maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight} - 32px)`,
            padding: '0 !important', // Do nó dinh cái layout mặc định của thằng thư viện nên nó có padding thì chúng ta cần phải set nó trở về lại là 0
            borderRadius: '15px'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default LayoutNotApp
