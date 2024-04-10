// **  Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useState } from 'react'

// ** MUI
import { Box, Grid, styled, Typography, useTheme } from '@mui/material'
import CustomDataGrid from 'src/components/custom-data-grid'
import { DataGrid, GridColDef, GridRowClassNameParams, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** Components
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import CreateEditUser from 'src/views/pages/system/user/components/CreateEditUser'

// ** React-Hook-Form

// ** Redux
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { resetInitialState } from 'src/stores/user'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/role'

// ** Util
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { handleToFullName } from 'src/utils'

// ** Custom hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Actions
import { deleteUserAsync, getAllUsersAsync } from 'src/stores/user/actions'
import { getDetailsUser } from 'src/services/user'
import TableHeader from 'src/components/table-header'

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
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt asc')
  const [searchBy, setSearchBy] = useState('')
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // ** Hooks
  const { t, i18n } = useTranslation()

  // const tableActions = [{ label: t('Xoá'), value: 'delete' }]

  // ** Context
  const { user } = useAuth()

  // ** Permission, key của nó chính là những SYSTEM.ROLE
  const { VIEW, UPDATE, CREATE, DELETE } = usePermission('SYSTEM.USER', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.user)

  // console.log('Chekckkkkkk console')
  // console.log('Checkkk users return data', { data: users.data })

  // ** theme
  const theme = useTheme()

  const handleGetListUsers = () => {
    dispatch(getAllUsersAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const columns: GridColDef[] = [
    {
      field: 'fullName', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Full_name'),
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      renderCell: (params) => {
        const { row } = params
        // console.log('Chekc params', { params })
        const fullName = handleToFullName(
          row?.lastName || '',
          row?.middleName || '',
          row?.firstName || '',
          i18n.language
        )
        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Email'),
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      renderCell: (params) => {
        const { row } = params
        console.log('Checkkkk row params', { row })

        return <Typography>{row.email}</Typography>
      }
    },
    {
      field: 'role', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Role'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row?.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Phone_number'),
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row.phoneNumber}</Typography>
      }
    },
    {
      field: 'city', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('City'),
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row?.city}</Typography>
      }
    },
    {
      field: 'action',
      headerName: t('Actions'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      sortable: false,
      renderCell: (params) => {
        const { row } = params
        return (
          <Fragment>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <GridEdit
                disabled={!UPDATE}
                onClick={() => {
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
                  setOpenDeleteUser({
                    open: true,
                    id: params.id as string
                  })
                }
              />
            </Box>
          </Fragment>
        )
      }
    }
  ]

  // ** handle pagination
  const handleCloseConfirmDeleteUser = () => {
    setOpenDeleteUser({
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
  const handleDeleteUser = () => {
    dispatch(deleteUserAsync(openDeleteUser.id))
    handleCloseConfirmDeleteUser()
  }

  // ** Handle Sort All Role
  const handleSort = (sort: GridSortModel) => {
    // console.log('Checkkk sort', { sort })
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  // ** Handle action delete multiple users
  const handleActionDelete = (action: string) => {
    switch (action) {
      case 'delete': {
        console.log('Checkkk Delete', { selectedRow })
        break
      }
    }
  }

  //  ** Memo Disabled delete user
  const memoDisabledDeleteUser = () => {}

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
        rowLength={users.total}
      />
    )
  }

  // handle get detail permission role
  const handleGetDetailUser = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
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
    handleGetListUsers()
  }, [sortBy, searchBy])

  // Lấy ra Role id trong danh sách Role List trong CMS -> `RoleId` thì mới callApi
  // useEffect(() => {
  //   if (selectedRow.id) {
  //     handleGetDetailUser(selectedRow.id)
  //   }
  // }, [selectedRow])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit?.id) {
        toast.success(t('Create_user_success'))
      } else {
        toast.success(t('Update_user_success'))
      }
      handleGetListUsers()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit?.id) {
          toast.error(t('Update_user_error'))
        } else {
          toast.error(t('Create_user_error'))
        }
      }
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_user_success'))
      handleGetListUsers()
      dispatch(resetInitialState())
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteUser.open}
        handleClose={handleCloseConfirmDeleteUser}
        handleCancel={handleCloseConfirmDeleteUser}
        handleConfirm={handleDeleteUser}
        title={t('Title_delete_user')}
        description={t('Confirm_delete_user')}
      />
      <CreateEditUser open={openCreateEdit.open} onClose={handleCloseCreateEdit} idUser={openCreateEdit.id} />
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
          {!selectedRow?.length && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
                mb: 4,
                width: '100%'
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
          )}
          {selectedRow?.length > 0 && (
            <TableHeader
              numRow={selectedRow?.length}
              onClear={() => setSelectedRow([])}
              actions={[{ label: t('Xoá'), value: 'delete', disabled: false }]}
              handleActionDelete={handleActionDelete}
            />
          )}
          {/* Table custom grid */}
          <CustomDataGrid
            rows={users?.data}
            columns={columns}
            autoHeight
            // hideFooter
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
            checkboxSelection
            // getRowClassName={(row: GridRowClassNameParams) => {
            //   return row.id === selectedRow.id ? 'row-selected' : ''
            // }}
            slots={{
              // Sẽ nhận vào component pagination
              pagination: PaginationComponent
            }}
            rowSelectionModel={selectedRow}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              console.log('Checkkkk row selecction', { row })
              setSelectedRow(row as string[])
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
