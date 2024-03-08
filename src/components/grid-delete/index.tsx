// ** MUI
import { Box, IconButton, Tooltip } from '@mui/material'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Component
import CustomIcon from 'src/components/Icon'

interface TGridDelete {
  onClick: () => void
  disabled?: boolean
}

const GridDelete = (props: TGridDelete) => {
  const { onClick, disabled } = props
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Delete')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <CustomIcon icon='ic:baseline-delete' />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
