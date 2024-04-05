// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'

// ** MUI
import { Box, Card, Grid, ListItemButton, styled, useTheme } from '@mui/material'
import CustomDataGrid from 'src/components/custom-data-grid'
import { DataGrid, GridColDef, GridRowClassNameParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'
import { Button } from '@mui/material'

// ** Components
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from 'src/views/pages/system/role/components/CreateEditRole'
import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import CustomIcon from 'src/components/Icon'

// ** React-Hook-Form

// ** Redux
import { deleteRoleAsync, getAllRolesAsync, updateRoleAsync } from 'src/stores/role/actions'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { resetInitialState } from 'src/stores/role'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { PERMISSIONS } from 'src/configs/permission'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'

// ** Services
import { getDetailsRole } from 'src/services/role'

// ** Util
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { getAllValueOfObject } from 'src/utils'

// ** Custom hooks
import { usePermission } from 'src/hooks/usePermission'

// **

const StyleGridColDef = styled(DataGrid)<GridColDef>(({ theme }) => ({
  '& .MuiDataGrid-columnHeaderTitleContainer': {}
}))

type TProps = {}

const UserListPage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: ''
  })

  // ** Permission, key của nó chính là những SYSTEM.ROLE
  const { VIEW, UPDATE, CREATE, DELETE } = usePermission('SYSTEM.ROLE', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // ** I18n
  const { t } = useTranslation()

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  // ** theme
  const theme = useTheme()

  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
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
      renderCell: (params) => {
        const { row } = params
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {!row?.permissions?.some((permission: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC'].includes(permission)) ? (
              <>
                <GridEdit
                  disabled={!UPDATE}
                  onClick={() => {
                    console.log('Checkkk params iid', { id: params.id })
                    if (params.id) {
                      setOpenCreateEdit({
                        open: true,
                        id: String(params.id)
                      })
                    }
                  }}
                />

                <GridDelete
                  disabled={!DELETE}
                  onClick={() =>
                    setOpenDeleteRole({
                      open: true,
                      id: params.id as string
                    })
                  }
                />
              </>
            ) : (
              <CustomIcon icon='tabler:lock-filled' fontSize={30} />
            )}
          </Box>
        )
      }
    }
  ]

  // ** handle pagination
  const handleCloseConfirmDeleteRole = () => {
    setOpenDeleteRole({
      open: false,
      id: ''
    })
  }

  // ** handle Close Create Edit
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  // handle Delete Role
  const handleDeleteRole = () => {
    dispatch(deleteRoleAsync(openDeleteRole.id))
    handleCloseConfirmDeleteRole()
  }

  // ** Handle Sort All Role
  const handleSort = (sort: GridSortModel) => {
    console.log('Checkkk sort', { sort })
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  // Handle update role permission
  const handleUpdateRolePermission = () => {
    dispatch(updateRoleAsync({ id: selectedRow.id, name: selectedRow.name, permissions: permissionSelected }))
  }

  // Handle Pagination
  const handleOnChangePagination = () => {}

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

  // handle get detail permission role
  const handleGetDetailPermissionRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then((res) => {
        if (res?.data) {
          // const isDefaultPermission = [PERMISSIONS.ADMIN, PERMISSIONS.BASIC].some((item) =>
          //   res?.data.permissions.includes(item)
          // )
          // if (res?.data.permissions.includes(PERMISSIONS.ADMIN)) {
          //   setIsDisablePermission(true)
          //   setPermissionSelected(getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
          // } else if (res?.data.permissions.includes(PERMISSIONS.BASIC)) {
          //   setIsDisablePermission(true)
          //   setPermissionSelected(PERMISSIONS.DASHBOARD)
          // } else {
          //   setIsDisablePermission(false)
          //   setPermissionSelected(res?.data?.permissions || [])
          // }
        }
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleGetListRoles()
  }, [sortBy, searchBy])

  // Lấy ra Role id trong danh sách Role List trong CMS -> `RoleId` thì mới callApi
  useEffect(() => {
    if (selectedRow.id) {
      handleGetDetailPermissionRole(selectedRow.id)
    }
  }, [selectedRow])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit?.id) {
        toast.success(t('Create_role_success'))
      } else {
        toast.success(t('Update_role_success'))
      }
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit?.id) {
          toast.error(t('Update_role_error'))
        } else {
          toast.error(t('Create_role_error'))
        }
      }
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_role_success'))
      handleGetListRoles()
      dispatch(resetInitialState())
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_role_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
        title={t('Title_delete_role')}
        description={t('Confirm_delete_role')}
      />
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          height: '100%',
          maxHeight: '100%'
          // overflow: 'auto'
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Box sx={{ width: '200px' }}>
              <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
            </Box>
            <GridCreate
              disabled={!CREATE}
              onClick={() => {
                setOpenCreateEdit({
                  open: true,
                  id: ''
                })
              }}
            />
          </Box>

          {/* Table custom grid */}
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
            hideFooter
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.2)} !important`,
                color: `${theme.palette.primary.main} !important`,
                fontWeight: 'bold'
              }
            }}
            sortingMode='server'
            sortingOrder={['desc', 'asc']}
            onSortModelChange={handleSort}
            getRowId={(row) => row._id}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            getRowClassName={(row: GridRowClassNameParams) => {
              return row.id === selectedRow.id ? 'row-selected' : ''
            }}
            slots={{
              // Sẽ nhận vào component của chúng ta
              pagination: PaginationComponent
            }}
            onRowClick={(row) => {
              setSelectedRow({ id: String(row?.id), name: row?.row?.name })
              // set lại giá trị để nó phân biệt
              // setOpenCreateEdit({
              //   open: false,
              //   id: String(row?.id)
              // })
            }}
            disableColumnFilter
            disableColumnMenu
          />
          {/* Grid right - List Permission */}
        </Grid>
      </Box>
    </>
  )
}

export default UserListPage
