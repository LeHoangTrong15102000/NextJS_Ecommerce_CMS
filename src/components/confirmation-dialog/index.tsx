// ** React

// ** mui
import InputBase, { InputBaseProps } from '@mui/material/InputBase'
import {} from '@mui/material'
import {} from '@mui/material'
import { styled, DialogActions, DialogContent, DialogContentText, DialogTitle, Dialog, Button } from '@mui/material'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Component

interface TInputSearch {
  open: boolean
  handleClose: () => void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: 0,
  width: '100%',
  height: '38px',
  border: `1px solid ${theme.palette.customColors.borderColor}`
  // [theme.breakpoints.up('sm')]: {
  //   marginLeft: theme.spacing(1),
  //   width: 'auto'
  // }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)<InputBaseProps>(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`
    // transition: theme.transitions.create('width')
    // [theme.breakpoints.up('sm')]: {
    //   width: '12ch',
    //   '&:focus': {
    //     width: '20ch'
    //   }
    // }
  }
}))

const ConfirmationDialog = (props: TInputSearch) => {
  // ** Props
  const { open, handleClose } = props

  // ** State

  // I18next
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{"Use Google's location service?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no
          apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
