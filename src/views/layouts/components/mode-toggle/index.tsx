// ** MUI
import IconButton from '@mui/material/IconButton'

// ** React
import { Fragment, useState } from 'react'

// ** Component
import CustomIcon from '../../../../components/Icon'

// ** Next
import Image from 'next/image'

// ** Hooks
import { useSettings } from 'src/hooks/useSettings'

// ** Types layout
import { Mode } from 'src/types/layouts'

type TProps = {}

const ModeToggle = (props: TProps) => {
  // Sử dụng useSettings để lấy ra chế độ dark mode của dự án
  // saveSettings là biến lưu chế độ dark light settings của chúng ta vào trong context
  const { settings, saveSettings } = useSettings()

  const handleChangeMode = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }

  const handleToggleMode = () => {
    if (settings.mode === 'dark') {
      handleChangeMode('light')
    } else {
      handleChangeMode('dark')
    }
  }

  return (
    <IconButton color='inherit' onClick={handleToggleMode}>
      <CustomIcon icon={settings.mode === 'light' ? 'ic:baseline-dark-mode' : 'iconamoon:mode-light'} />
    </IconButton>
  )
}

export default ModeToggle
