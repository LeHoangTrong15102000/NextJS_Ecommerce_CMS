import * as React from 'react'

// ** Component Layout

// ** Next
import { NextPage } from 'next'
import { Box, BoxProps, styled } from '@mui/material'

// ReactNode thường là một cái component(page) hoặc là những thằng con bên trong
type TProps = {
  children: React.ReactNode
}

const BlankLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => {
  return {
    height: '100vh'
  }
})

// TODO remove, this demo shouldn't need to reset the theme.
const BlankLayout: NextPage<TProps> = ({ children }) => {
  return (
    <BlankLayoutWrapper>
      <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>{children}</Box>
    </BlankLayoutWrapper>
  )
}

export default BlankLayout
