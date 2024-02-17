'use client'
import { Box, Typography } from '@mui/material'
import Head from 'next/head'
import CustomTextField from 'src/components/text-field'

export default function Home() {
  return (
    <>
      <Head>
        <title>Lập trình thật dễ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Typography>Hello world!</Typography>
      <Box sx={{ margin: 6, width: '200px' }}>
        <CustomTextField id='outlined-multiline-flexible' label='Muitiline' />
      </Box>
    </>
  )
}
