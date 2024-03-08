// ** MUI
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

  return (
    <Tooltip title={t('Edit')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <CustomIcon icon='fa-regular:edit' />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
