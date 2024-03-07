import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomIcon from 'src/components/Icon'

interface TGridEdit {}

const GridEdit = (props: TGridEdit) => {
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Edit')}>
      <IconButton>
        <CustomIcon icon='ic:sharp-edit' />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
