import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, Checkbox, Typography, useTheme } from '@mui/material'
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
import { getAllValueOfObject } from 'src/utils'
import * as yup from 'yup'

interface TTablePermission {
  setPermissionSelected: Dispatch<SetStateAction<string[]>>
  permissionSelected: string[]
  disabled: boolean
}

type TDefaultValue = {
  name: string
}

const TablePermission = (props: TTablePermission) => {
  // ** Props
  const { setPermissionSelected, permissionSelected, disabled } = props

  // ** State
  const [loading, setLoading] = useState(false)

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // handle get value permission
  const getValuePermission = (value: string, mode: string, parentValue?: string) => {
    // bọc vào try catch để mà khi bị lỗi thì return về ''
    try {
      return parentValue ? PERMISSIONS[parentValue][value][mode] : PERMISSIONS[value]
      //
    } catch (error) {
      return ''
    }
  }

  // handle checkbox children
  const handleOnChangeCheckbox = (value: string) => {
    const isChecked = permissionSelected.includes(value)
    // Bỏ check ra khỏi permissionsSelected khi mà nhấn click bỏ checkbox
    if (isChecked) {
      const filtered = permissionSelected.filter((item) => item !== value)
      setPermissionSelected(filtered)
    } else {
      setPermissionSelected([...permissionSelected, value])
    }
  }

  // handle is checked
  // Check theo kiểu parent - child
  const handleIsChecked = (value: string, parentValue?: string) => {
    // Trả về các giá trị trong cùng một row dưới dạng một cái mảng
    const allValue = parentValue
      ? getAllValueOfObject(PERMISSIONS[parentValue][value])
      : getAllValueOfObject(PERMISSIONS[value])
    // isCheckAll để kiểm tra xem tất cả đã được checked hết chưa, nếu tất cả các quyền đã nằm trong permissionSelected rồi thì chúng ta sẽ return về true
    const isCheckedAll = allValue.every((item) => permissionSelected.includes(item))
    return {
      isCheckedAll,
      allValue
    }
  }

  // handle Check All checkbox
  const handleCheckAllCheckbox = (value: string, parentValue?: string) => {
    // Lấy tất cả value khi mà chúng ta checkAll cái group
    // Nếu có parentValue thì sẽ lấy parentValue
    const { isCheckedAll, allValue } = handleIsChecked(value, parentValue)
    // console.log('Checkkk handle checkk All checkbox Children', { allValue })
    if (isCheckedAll) {
      // Return về mảng giá trị không nằm trong biến `allValue`
      const filtered = permissionSelected.filter((item) => !allValue.includes(item))
      setPermissionSelected(filtered)
    } else {
      // Khhi mà chưa check thì sẽ lấy tất cả giá trị của một row, và thêm vào phía sau trong mảng permissionSelected
      const filtered = permissionSelected.filter((item) => !allValue.includes(item))
      setPermissionSelected([...filtered, ...allValue])
    }
  }

  // handle Check All Group Checkbox
  const handleCheckAllGroupCheckbox = (value: string) => {
    const { isCheckedAll, allValue } = handleIsChecked(value)
    // console.log('Checkk All Value Group', { allValue })
    if (isCheckedAll) {
      const filtered = permissionSelected.filter((item) => !allValue.includes(item))
      setPermissionSelected(filtered)
    } else {
      setPermissionSelected([...new Set([...permissionSelected, ...allValue])])
    }
  }

  // Truyền đạt ý nghĩa ở những nơi quan trọng như thế này rồi thì cần phải thực hiện thêm những lợi ích khác

  // console.log('Checkk Alll Value', { permissionSelected })

  // ** React hook form
  const roleSchema = yup.object().shape({
    name: yup.string().required(t('required_field'))
  })

  const columns: GridColDef[] = [
    {
      field: 'all',
      headerName: '',
      minWidth: 190,
      maxWidth: 190,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // row nó sẽ lấy theo giá trị của LIST_DATA_PERMISSIONS truyền vào thuộc tính rows
        // Có bao nhiêu row trong LIST_DATA thì nó sẽ lấy ra bấy nhiêu giá trị tương ứng
        const { row } = params
        // Khi mà chúng ta thao tác trên row nào thì sẽ lấy value và parentValue trên row đó (nó sẽ kiểm tra hết value và parentValue của tất cả các row sau rồi mới kiểm tra trạng thái isCheckedAll)
        const { isCheckedAll, allValue } = handleIsChecked(row.value, row.parentValue)

        return (
          <>
            {!row?.isHideAll && (
              <Checkbox
                disabled={disabled}
                checked={isCheckedAll}
                value={row?.value}
                onChange={(e) => {
                  if (row.isParent) {
                    // Chưa xử lý isParent là true
                    handleCheckAllGroupCheckbox(e.target.value)
                  } else {
                    // Xử lý isParent la false
                    if (row.isNoChild) {
                    } else {
                      handleCheckAllCheckbox(e.target.value, row.parentValue)
                    }
                  }
                }}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'name', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
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
        // console.log('Checkk row and permissions', {
        //   row,
        //   PERMISSIONS,
        //   value: PERMISSIONS[row.parentValue]?.[row.value]['VIEW']
        // })
        const value = getValuePermission(row.value, 'VIEW', row.parentValue)
        return (
          <>
            {!row?.isHideView && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckbox(e.target.value)
                }}
                // Nếu như mà value có nằm bên trong thằng permissionSelected thì nó sẽ checked
                checked={permissionSelected.includes(value)}
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

        const value = getValuePermission(row.value, 'CREATE', row.parentValue)
        return (
          <>
            {!row?.isHideCreate && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckbox(e.target.value)
                }}
                checked={permissionSelected.includes(value)}
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
        const value = getValuePermission(row.value, 'UPDATE', row.parentValue)
        return (
          <>
            {!row?.isHideUpdate && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckbox(e.target.value)
                }}
                checked={permissionSelected.includes(value)}
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

        const value = getValuePermission(row.value, 'DELETE', row.parentValue)
        return (
          <>
            {!row?.isHideDelete && !row.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnChangeCheckbox(e.target.value)
                }}
                checked={permissionSelected.includes(value)}
              />
            )}
          </>
        )
      }
    }
  ]

  return (
    <>
      {loading && <Spinner />}

      {/* LIST DATA_PERMISSIONS để mà show ra checkbox theo kiểu cha con */}
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
    </>
  )
}

export default TablePermission
