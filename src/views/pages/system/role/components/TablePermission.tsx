import { yupResolver } from '@hookform/resolvers/yup'
import { Box, useTheme } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomDataGrid from 'src/components/custom-data-grid'

import Spinner from 'src/components/spinner'
import { getDetailsRole } from 'src/services/role'
import { AppDispatch } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'
import * as yup from 'yup'

interface TTablePermission {}

type TDefaultValue = {
  name: string
}

const TablePermission = (props: TTablePermission) => {
  // ** Props

  // ** State
  const [loading, setLoading] = useState(false)

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const roleSchema = yup.object().shape({
    name: yup.string().required(t('required_field'))
  })

  const columns: GridColDef[] = [
    {
      field: 'permission', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Permission'),
      width: 150,
      flex: 1,
      align: 'center'
    }
  ]

  return (
    <>
      {loading && <Spinner />}
      <CustomDataGrid
        rows={[]}
        columns={columns}
        autoHeight
        hideFooter
        // onSortModelChange={handleSort}
        // getRowId={(row) => row._id}
        pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
      />
    </>
  )
}

export default TablePermission
