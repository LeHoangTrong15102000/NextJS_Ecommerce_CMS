import { MenuItem, MenuItemProps, Select, SelectProps, styled } from '@mui/material'

interface TCustomSelect extends SelectProps {}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({}))

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({}))

const CustomSelect = (props: TCustomSelect) => {
  const { value, label, onChange } = props
  return (
    <StyledSelect
      labelId='demo-select-small-label'
      id='demo-select-small'
      value={value}
      label={label}
      onChange={onChange}
    >
      <MenuItem value=''>
        <em>None</em>
      </MenuItem>
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </StyledSelect>
  )
}

export default CustomSelect
