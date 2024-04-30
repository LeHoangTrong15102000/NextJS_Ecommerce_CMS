// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Modal, ModalProps, Typography } from '@mui/material'

// ** Component
import CircularWithValueLabel from '../custom-circular-progress'

// ** Image
import Nodata from '/public/svgs/no-data.svg'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

type TProps = {
  widthImage?: string
  heightImage?: string
  textNodata?: string
}

const NoData = (props: TProps) => {
  // ** Hook
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()
  const { widthImage = '100px', heightImage = '100px', textNodata = t('No_data_product') } = props

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Image
        src={Nodata}
        alt='Nodata_image'
        width={0}
        height={0}
        style={{
          height: heightImage,
          width: widthImage,
          objectFit: 'cover'
        }}
      />
      <Typography
        sx={{
          whiteSpace: 'nowrap',
          mt: 2
        }}
      >
        {textNodata}
      </Typography>
    </Box>
  )
}

export default NoData
