// ** MUI
import { useTheme } from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Component
import CustomIcon from 'src/components/Icon'

interface TGridEdit {
  onClick: () => void
  disabled?: boolean
}

const GridEdit = (props: TGridEdit) => {
  const { onClick, disabled } = props
  const { t } = useTranslation()

  // ** Theme
  const theme = useTheme()

  return (
    <>
      <Tooltip title={t('Edit')}>
        <IconButton
          sx={{
            // backgroundColor: `${theme.palette.primary.main} !important`,
            // color: `${theme.palette.common.white}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => {
            onClick()
          }}
          disabled={disabled}
        >
          <CustomIcon icon='fa-regular:edit' />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default GridEdit
