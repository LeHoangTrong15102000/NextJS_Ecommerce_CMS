import { Box, BoxProps, Modal, ModalProps, styled } from '@mui/material'
import React, { useState } from 'react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import CustomIcon from 'src/components/Icon'

interface TCustomDatePicker extends ReactDatePickerProps {
  selectedDate?: Date | null
}

const StyleDatePicker = styled(Box)<BoxProps>(({ theme, children }) => ({
  borderRadius: 8,
  backgroundColor: 'transparent !important',
  border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
  padding: '8x 10px',
  height: '38px',
  position: 'relative',
  '.react-datepicker-wrapper': {
    input: {
      border: 'none',
      outline: 'none'
    }
  },
  ".date-picker-icon": {
    position: 'absolute'
  }
}))

const CustomDatePicker = (props: TCustomDatePicker) => {
  const { selectedDate, onChange, ...rests } = props
  return (
    <StyleDatePicker>
      <DatePicker selected={selectedDate} onChange={onChange} {...rests} />
      <CustomIcon icon='uiw:date' className='date-picker-icon' />
    </StyleDatePicker>
  )
}

export default CustomDatePicker
