// ** React
import React, { useEffect, useState } from 'react'

import { IconButton, Tooltip, alpha } from '@mui/material'

// ** mui
import InputBase, { InputBaseProps } from '@mui/material/InputBase'
import { styled } from '@mui/material'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Component
import CustomIcon from 'src/components/Icon'
import useDebounce from 'src/hooks/useDebounce'

interface TInputSearch {
  value: string
  onChange: (value: string) => void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: 0,
  width: '100%',
  height: '38px',
  border: `1px solid ${theme.palette.customColors.borderColor}`
  // [theme.breakpoints.up('sm')]: {
  //   marginLeft: theme.spacing(1),
  //   width: 'auto'
  // }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)<InputBaseProps>(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`
    // transition: theme.transitions.create('width')
    // [theme.breakpoints.up('sm')]: {
    //   width: '12ch',
    //   '&:focus': {
    //     width: '20ch'
    //   }
    // }
  }
}))

const InputSearch = (props: TInputSearch) => {
  // ** Props
  const { value, onChange } = props

  // ** State
  const [search, setSearch] = useState(value)
  const debouncedSearch = useDebounce(search, 500)

  // I18next
  const { t } = useTranslation()

  useEffect(() => {
    onChange(debouncedSearch)
  }, [debouncedSearch])

  return (
    <Search>
      <SearchIconWrapper>
        {/* <SearchIcon /> */}
        <CustomIcon icon='ic:sharp-search' />
      </SearchIconWrapper>
      <StyledInputBase
        value={search}
        placeholder='Search…'
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Search>
  )
}

export default InputSearch
