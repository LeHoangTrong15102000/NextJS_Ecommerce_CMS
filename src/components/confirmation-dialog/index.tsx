// ** React

// ** mui
import { Box, DialogContentTextProps, useTheme } from '@mui/material'
import {} from '@mui/material'
import { styled, DialogActions, DialogContent, DialogContentText, DialogTitle, Dialog, Button } from '@mui/material'

// ** i18next
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import CustomIcon from 'src/components/Icon'

// ** Component

interface TInputSearch {
  open: boolean
  handleClose: () => void
}

const CustomStyleContent = styled(DialogContentText)<DialogContentTextProps>(({ theme }) => ({
  padding: '10px 20px'
}))

const ConfirmationDialog = (props: TInputSearch) => {
  // ** Props
  const { open, handleClose } = props

  // ** State

  // I18next
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle
        sx={{
          textAlign: 'center'
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600
          }}
        >
          Chỉnh sửa nhóm vai trò
        </Typography>
      </DialogTitle>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <CustomIcon icon='ep:warning-filled' fontSize={80} color={theme.palette.warning.main} />
      </Box>
      <CustomStyleContent sx={{}}>
        <DialogContentText
          sx={{
            textAlign: 'center'
          }}
        >
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no
          apps are running.
        </DialogContentText>
      </CustomStyleContent>
      <DialogActions>
        <Button variant='contained' onClick={handleClose}>
          {t('Confirm')}
        </Button>
        <Button color='error' onClick={handleClose} autoFocus>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
