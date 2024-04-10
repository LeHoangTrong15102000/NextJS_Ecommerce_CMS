import { Button, IconButton } from '@mui/material'
import { Box, styled, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomIcon from 'src/components/Icon'

type TProps = {
  numRow: number
  onClear: () => void
  actions: { label: string; value: string; disabled?: boolean }[]
  handleActionDelete: (type: string) => void
}

const StyledTableHeader = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  border: `2px solid ${theme.palette.primary.main}`,
  padding: '4px 10px',
  width: '100%',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const TableHeader = (props: TProps) => {
  const { numRow, onClear, actions, handleActionDelete } = props

  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <StyledTableHeader>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Typography>{t('Rows_selected')}</Typography>
        <Typography
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '20px',
            width: '20px',
            borderRadius: '50%',
            color: theme.palette.customColors.lightPaperBg,
            fontWeight: 600
          }}
        >
          <span>{numRow}</span>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {actions.map((action) => {
          return (
            <Button
              disabled={action?.disabled}
              key={action.value}
              variant='contained'
              onClick={() => handleActionDelete(action.value)}
            >
              {action.label}
            </Button>
          )
        })}
        <IconButton onClick={onClear}>
          <CustomIcon icon='clarity:close-line' fontSize={'20px'} />
        </IconButton>
      </Box>
    </StyledTableHeader>
  )
}

export default TableHeader
