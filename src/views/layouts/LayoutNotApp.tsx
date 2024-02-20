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
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default LayoutNotApp
