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
        <CustomIcon
          icon='ic:baseline-delete'
          // style={{
          //   height: '100%',
          //   width: '100%'
          // }}
        />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
