// ** React

// ** mui
import { Box, DialogContentTextProps, DialogProps, useTheme } from '@mui/material'
import {} from '@mui/material'
import { styled, DialogActions, DialogContent, DialogContentText, DialogTitle, Dialog, Button } from '@mui/material'

// ** i18next
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import CustomIcon from 'src/components/Icon'

// ** Component

interface TConfirmationDialog {
  open: boolean
  handleClose: () => void
  title: string
  description: string
  handleConfirm: () => void
  handleCancel: () => void
}

const CustomStyleContent = styled(DialogContentText)<DialogContentTextProps>(({ theme }) => ({
  width: '400px'
}))

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
  // '.MuiPaper-root.MuiPaper-elevation': {
  //   padding: '30px'
  // }
}))

const ConfirmationDialog = (props: TConfirmationDialog) => {
  // ** Props
  const { open, handleClose, title, description, handleConfirm, handleCancel } = props

  // ** State

  // I18next
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        <CustomIcon icon='ep:warning-filled' fontSize={80} color={theme.palette.warning.main} />
      </Box>
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
          {title}
        </Typography>
      </DialogTitle>

      <CustomStyleContent sx={{}}>
        <DialogContentText
          sx={{
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          {description}
        </DialogContentText>
      </CustomStyleContent>
      <DialogActions>
        <Button variant='contained' onClick={handleConfirm}>
          {t('Confirm')}
        </Button>
        <Button color='error' variant='outlined' onClick={handleCancel} autoFocus>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default ConfirmationDialog
