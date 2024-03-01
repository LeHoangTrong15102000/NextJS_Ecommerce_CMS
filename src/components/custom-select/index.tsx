import { Box, InputLabel, InputLabelProps, MenuItem, MenuItemProps, Select, SelectProps, styled } from '@mui/material'
import { getDisplayName } from 'next/dist/shared/lib/utils'
import { useTranslation } from 'react-i18next'

interface TCustomSelect extends SelectProps {
  options: { label: string; value: string }[]
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  height: '35px',
  '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
    padding: '8px 8px 8px 10px !important',
    boxSizing: 'border-box'
  },
  // Cho ẩn đi cái label mặc định của thẻ Select
  legend: {
    display: 'none'
  }
}))

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({ theme }) => ({
  position: 'absolute',
  top: '5px',
  left: '12px',
  zIndex: 2,
  color: '#ccc'
}))

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({}))

const CustomSelect = (props: TCustomSelect) => {
  const { t } = useTranslation()
  const { value, label, onChange, options, placeholder, fullWidth, ...rest } = props
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {((Array.isArray(value) && !value?.length) || !value) && <CustomPlaceholder>{placeholder}</CustomPlaceholder>}
      <StyledSelect fullWidth={fullWidth} value={value} label={label} onChange={onChange} {...rest}>
        {options?.length > 0 ? (
          options?.map((option) => {
            return (
              <StyledMenuItem key={option.value} value={option.value}>
                {option.label}
              </StyledMenuItem>
            )
          })
        ) : (
          <StyledMenuItem>{t('No_data')}</StyledMenuItem>
        )}

        {/* <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem> */}
      </StyledSelect>
    </Box>
  )
}

export default CustomSelect
