import { MenuItem, MenuItemProps, Select, SelectProps, styled } from '@mui/material'

interface TCustomSelect extends SelectProps {
  options: { label: string; value: string }[]
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  height: '40px',
  '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
    padding: '8px 8px 8px 10px !important',
    boxSizing: 'border-box'
  }
}))

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({}))

const CustomSelect = (props: TCustomSelect) => {
  const { value, label, onChange, options, fullWidth, ...rest } = props
  return (
    <StyledSelect fullWidth={fullWidth} value={value} label={label} onChange={onChange} {...rest}>
      {options?.map((option) => {
        return (
          <StyledMenuItem key={option.value} value={option.value}>
            {option.label}
          </StyledMenuItem>
        )
      })}

      {/* <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem> */}
    </StyledSelect>
  )
}

export default CustomSelect
