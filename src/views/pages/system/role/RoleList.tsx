// **  Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import { Box, Card, Grid, IconButton, Tooltip, styled, useTheme } from '@mui/material'
import CustomDataGrid from 'src/components/custom-data-grid'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

// ** Components

// ** React-Hook-Form

// ** Image
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'

// ** Redux
import { getAllRolesAsync } from 'src/stores/role/actions'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

// ** i18next
import { useTranslation } from 'react-i18next'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import CustomIcon from 'src/components/Icon'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from 'src/views/pages/system/role/components/CreateEditRole'
import { resetInitialState } from 'src/stores/role'
import Spinner from 'src/components/spinner'

// **

const StyleGridColDef = styled(DataGrid)<GridColDef>(({ theme }) => ({
  '& .MuiDataGrid-columnHeaderTitleContainer': {}
}))

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })

  // ** I18n
  const { t } = useTranslation()

  // ** context
  const { login, user } = useAuth()

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()
  const { roles, isSuccessCreateEdit, isErrorCreateEdit, isLoading, messageErrorCreateEdit } = useSelector(
    (state: RootState) => state.role
  )

  // console.log('Checkkkk roles', { roles })

  // ** theme
  const theme = useTheme()

  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1 } }))
  }

  const columns: GridColDef[] = [
    {
      field: 'name', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Name'),
      width: 150,
      flex: 1,
      align: 'center'
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 150,
      sortable: false,
      renderCell: (row) => {
        return (
          <Box>
            <GridEdit
              onClick={() =>
                setOpenCreateEdit({
                  open: true,
                  id: String(row.id)
                })
              }
            />
            <GridDelete onClick={() => {}} />
          </Box>
        )
      }
    }
  ]

  // ** handle pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // Todo
  }

  // ** handle Close Create Edit
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  // ** Create Pagination Component
  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        pageSize={pageSize}
        page={page}
        rowLength={roles.total}
      />
    )
  }

  useEffect(() => {
    handleGetListRoles()
  }, [])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_role_success'))
      } else {
        toast.success(t('create_role_success'))
      }
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
      toast.error(t(messageErrorCreateEdit))
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit])

  return (
    <>
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          // overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          height: '100%'
        }}
      >
        <Grid
          container
          sx={{
            height: '100%',
            width: '100%'
          }}
        >
          {/* Grid left - List Role */}
          <Grid item md={5} xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
              }}
            >
              <Box sx={{ width: '200px' }}>
                <InputSearch />
              </Box>
              <GridCreate
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
            </Box>

            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              // initialState={{
              //   pagination: {
              //     paginationModel: {
              //       pageSize: 5
              //     }
              //   }
              // }}
              autoHeight
              getRowId={(row) => row._id}
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
              slots={{
                // Sẽ nhận vào component của chúng ta
                pagination: PaginationComponent
              }}
              disableColumnFilter
              disableColumnMenu
            />
          </Grid>
          {/* Grid right - List Permission */}
          <Grid item md={7} xs={12}>
            List Permission
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
