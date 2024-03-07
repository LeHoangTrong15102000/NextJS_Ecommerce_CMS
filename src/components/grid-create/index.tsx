// ** MUI
import { useTheme } from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'

// ** I18next
import { useTranslation } from 'react-i18next'

// ** Component
import CustomIcon from 'src/components/Icon'

type TGridCreate = {}

const GridCreate = (props: TGridCreate) => {
  // ** i18next
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  return (
    <Tooltip title={t('Create')}>
      <IconButton
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
