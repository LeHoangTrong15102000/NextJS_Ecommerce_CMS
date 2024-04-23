// ** MUI
import { Box, MenuItem, Pagination, PaginationProps, Select, styled } from '@mui/material'

// ** React
import { Ref, forwardRef } from 'react'

// ** i18next
import { useTranslation } from 'react-i18next'

type TProps = {
  page: number // current page
  pageSize: number // current page size
  rowLength: number
  pageSizeOptions: number[]
  onChangePagination: (page: number, pageSize: number) => void
  isHideShowed?: boolean
}

const StylePagination = styled(Pagination)<PaginationProps>(({ theme }) => ({
  '& .MuiDataGrid-footerContainer': {
    '.MuiBox-root': {
      flex: 1,
      width: '100% !important'
    }
  }
}))

const CustomPagination = forwardRef((props: TProps, ref: Ref<any>) => {
  const { pageSize, page, rowLength, pageSizeOptions, onChangePagination, isHideShowed, ...rests } = props

  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: '8px'
      }}
    >
      {!isHideShowed ? (
        <>
          {rowLength > 0 ? (
            <Box>
              <span>{t('Đang hiển thị')} </span>
              <span
                style={{
                  fontWeight: 'bold'
                }}
              >
                {page === 1 ? page : pageSize + 1}
                {' - '}
              </span>
              <span style={{ fontWeight: 'bold' }}>{page * pageSize < rowLength ? page * pageSize : rowLength}</span>
              <span> {t('trên')} </span>
              <span style={{ fontWeight: 'bold' }}>{rowLength}</span>
            </Box>
          ) : (
            <Box></Box>
          )}
        </>
      ) : (
        <Box></Box>
      )}
      {/* Số dòng hiển thị */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{t('Số dòng hiển thị')}</span>
          <Select
            size='small'
            sx={{
              width: '80px',
              padding: 0,
              '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
                minWidth: 'unset !important',
                padding: '8.5px 12px 8.5px 24px !important'
              }
            }}
            value={pageSize}
            onChange={(e) => onChangePagination(1, +e.target.value)}
          >
            {pageSizeOptions.map((option) => {
              return (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              )
            })}
          </Select>
        </Box>
        <StylePagination color='primary' {...rests} />
      </Box>
    </Box>
  )
})

export default CustomPagination
