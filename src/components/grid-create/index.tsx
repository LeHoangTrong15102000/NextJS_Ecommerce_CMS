// ** MUI
import { Box, useTheme } from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'

// ** I18next
import { useTranslation } from 'react-i18next'

// ** Component
import CustomIcon from 'src/components/Icon'

type TGridCreate = {
  onClick: () => void
  disabled?: boolean
}

const GridCreate = (props: TGridCreate) => {
  const { onClick, disabled } = props
  // ** i18next
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  return (
    <Tooltip title={t('Create')}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.common.white}`
        }}
      >
        <CustomIcon icon='ic:sharp-plus' />
      </IconButton>
    </Tooltip>
  )
}

export default GridCreate
