import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Checkbox, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { changeLanguage } from 'i18next'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomDataGrid from 'src/components/custom-data-grid'

import Spinner from 'src/components/spinner'
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from 'src/configs/permission'
import { getDetailsRole } from 'src/services/role'
import { AppDispatch } from 'src/stores'
import * as yup from 'yup'

interface TTablePermission {
  setPermissionSelected: Dispatch<SetStateAction<string[]>>
  permissionSelected: string[]
}

type TDefaultValue = {
  name: string
}

const TablePermission = (props: TTablePermission) => {
  // ** Props
  const { setPermissionSelected, permissionSelected } = props

  // ** State
  const [loading, setLoading] = useState(false)

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // handle get value permission
  const getValuePermission = (parentValue: string, value: string, mode: string) => {
    // bọc vào try catch để mà khi bị lỗi thì return về ''
    try {
      return PERMISSIONS[parentValue][value][mode]
      //
    } catch (error) {
      return ''
    }
  }

  // handle checkbox children
  const handleOnChangeCheckBox = (value: string) => {
    console.log('Checkkkk value onchange checkbox', { value })
  }

  // ** React hook form
  const roleSchema = yup.object().shape({
    name: yup.string().required(t('required_field'))
  })

  const columns: GridColDef[] = [
    {
      field: 'all',
      headerName: t('All'),
      minWidth: 190,
      maxWidth: 190,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        console.log('Checkk rowParent and permissions', {
          row,
          PERMISSIONS
        })
        return (
          <>
            <Checkbox value={row?.all} />
          </>
        )
      }
    },
    {
      field: 'name', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Name'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        return (
          <Typography
            sx={{
              color: row?.isParent ? theme.palette.primary.main : `rgba(${theme.palette.customColors.main}, 0.78)`,
              paddingLeft: row?.isParent ? '0px' : '25px',
              textTransform: row?.isParent ? 'uppercase' : 'normal'
            }}
          >
            {t(row?.name)}
          </Typography>
        )
      }
    },
    {
      field: 'view',
      headerName: t('View'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // console.log('Checkkkk params', { params })
        const { row } = params
        console.log('Checkk row and permissions', {
          row,
          PERMISSIONS,
          value: PERMISSIONS[row.parentValue]?.[row.value]['VIEW']
        })
        return (
          <>
            {!row?.isHideView && !row.isParent && (
              <Checkbox
                value={getValuePermission(row.parentValue, row.value, 'VIEW')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckBox(e.target.value)
                }}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'create',
      headerName: t('Create'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // console.log('Checkkkk params', { params })
        const { row } = params
        return (
          <>
            {!row?.isHideCreate && !row.isParent && (
              <Checkbox
                value={getValuePermission(row.parentValue, row.value, 'CREATE')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckBox(e.target.value)
                }}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'update',
      headerName: t('Edit'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // console.log('Checkkkk params', { params })
        const { row } = params
        return (
          <>
            {!row?.isHideUpdate && !row.isParent && (
              <Checkbox
                value={getValuePermission(row.parentValue, row.value, 'UPDATE')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckBox(e.target.value)
                }}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: t('Delete'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // console.log('Checkkkk params', { params })
        const { row } = params
        return (
          <>
            {!row?.isHideDelete && !row.isParent && (
              <Checkbox
                value={getValuePermission(row.parentValue, row.value, 'DELETE')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckBox(e.target.value)
                }}
              />
            )}
          </>
        )
      }
    }
  ]

  return (
    <Box
      sx={{
        overflow: 'auto',
        height: '100%',
        maxHeight: '100%'
        // paddingTop: '-2.5rem !important'
      }}
    >
      {loading && <Spinner />}
      <CustomDataGrid
        rows={LIST_DATA_PERMISSIONS}
        columns={columns}
        autoHeight
        hideFooter
        // onSortModelChange={handleSort}
        // getRowId={(row) => row._id}
        // checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
      />
    </Box>
  )
}

export default TablePermission
