import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, Switch } from '@mui/material'
import { Avatar, Button, FormHelperText, Grid, IconButton, InputLabel, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { useRouter } from 'next/router'

import { useTranslation } from 'react-i18next'

import CustomModal from 'src/components/custom-modal'
import CustomIcon from 'src/components/Icon'

// ** COnfig
import path from 'src/configs/path'

// ** Service

// ** Redux

interface TModalWarning {
  open: boolean
  onClose: () => void
}

type TDefaultValue = {
  fullName: string
  address: string
  city: string
  phoneNumber: string
}

const ModalWarning = (props: TModalWarning) => {
  // ** Props
  const { open, onClose } = props

  const { t } = useTranslation()

  // ** Theme
  const theme = useTheme()

  // ** Router
  const router = useRouter()

  return (
    <>
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: theme.palette.customColors.bodyBg,
            padding: '30px 20px',
            borderRadius: '15px'
          }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '60vw', xs: '80vw' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              paddingBottom: '20px'
            }}
          >
            <Typography
              variant='h4'
              sx={{
                fontWeight: 600
              }}
            >
              {t('Warning')}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CustomIcon icon='ep:warning-filled' fontSize={80} color={theme.palette.warning.main} />
            </Box>
            <Typography
              sx={{
                textAlign: 'center',
                mt: 4
              }}
            >
              {t('Warning_order_product')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mt: 4
              }}
            >
              <Button
                variant='contained'
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`
                }}
                onClick={() => router.push(path.HOME)}
              >
                {t('Return_home')}
              </Button>
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </>
  )
}

export default ModalWarning
