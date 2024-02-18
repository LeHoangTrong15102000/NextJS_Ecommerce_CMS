// **MUI Imports
import { ThemeContext } from '@emotion/react'
import { TextFieldProps, TextField, styled } from '@mui/material'

const TextFieldStyled = styled(TextField)<TextFieldProps>(({ theme }) => {
  return {
    '& .MuiFormHelperText-root': {
      lineHeight: 1.15,
      margin: theme.spacing(1, 0, 0),
      color: theme.palette.text.secondary,
      fontSize: theme.typography.body1.fontSize,
      '&.Mui-error': {
        color: theme.palette.error.main
      }
    },
    '& .MuiInputLabel-root': {
      transform: 'none',
      lineHeight: 1.2,
      position: 'relative',
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.body2.fontSize
    },

    '& .MuiInputBase-root': {
      borderRadius: 8,
      backgroundColor: 'transparent !important',
      border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
      transition: theme.transitions.create(['border-color', 'box-shadow'], {
        duration: theme.transitions.duration.shorter
      }),
      '&:before, &:after': {
        display: 'none'
      },
      // '&:placeholder': {
      //   color: 'red'
      // },
      // Những  thầng con không cần phải viết & cũng được
      '& .MuiInputBase-input': {
        padding: '8px 10px'
      },
      '&.Mui-error': {
        borderColor: theme.palette.error.main
      },
      '&.Mui-focused': {
        boxShadow: theme.shadows[2],
        '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readOnly])::placeholder': {
          transform: 'translateX(4px'
        },
        '&.MuiInputBase-colorPrimary': {
          borderColor: theme.palette.primary.main
        },
        '&.MuiInputBase-colorSecondary': {
          borderColor: theme.palette.secondary.main
        },
        '&.MuiInputBase-colorInfo': {
          borderColor: theme.palette.info.main
        },
        '&.MuiInputBase-colorSuccess': {
          borderColor: theme.palette.success.main
        },
        '&.MuiInputBase-colorWarning': {
          borderColor: theme.palette.warning.main
        },
        '&.MuiInputBase-colorError': {
          borderColor: theme.palette.error.main
        },
        '&.Mui-error': {
          borderColor: theme.palette.error.main
        }
      },
      '&.Mui-disabled': {
        backgroundColor: `${theme.palette.action.selected} !important`
      },
      '& .MuiInputAdornment-root': {
        marginTop: '0 !important'
      }
    },
    '& .MuiFormControl-root.MuiTextField-root': {
      marginTop: '5px'
    }
  }
})

const CustomTextField = (props: TextFieldProps) => {
  const { InputLabelProps, size = 'medium', variant = 'filled', ...rests } = props
  return (
    <TextFieldStyled size={size} variant={variant} InputLabelProps={{ ...InputLabelProps, shrink: true }} {...rests} />
  )
}

export default CustomTextField
