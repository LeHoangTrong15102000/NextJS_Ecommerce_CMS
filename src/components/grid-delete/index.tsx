import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomIcon from 'src/components/Icon'

interface TGridDelete {}

const GridDelete = (props: TGridDelete) => {
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Delete')}>
      <IconButton>
        <CustomIcon icon='ic:baseline-delete' />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
