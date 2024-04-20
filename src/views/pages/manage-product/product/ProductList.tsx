// **  Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** MUI
import { Box, Chip, ChipProps, Grid, styled, Typography, useTheme } from '@mui/material'
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
import TableHeader from 'src/components/table-header'

import CreateEditDeliveryType from 'src/views/pages/settings/delivery-method/components/CreateEditDeliveryType'

// ** React-Hook-Form

// ** Redux
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { resetInitialState } from 'src/stores/delivery-type'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'

// ** Util
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { formatDate, handleToFullName } from 'src/utils'

// ** Custom hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Actions
import {
  deleteDeliveryTypeAsync,
  deleteMultipleDeliveryTypeAsync,
  getAllDeliveryTypesAsync
} from 'src/stores/delivery-type/actions'

import { getDetailsUser } from 'src/services/user'
import { deleteMultipleProductTypeAsync, getAllProductTypesAsync } from 'src/stores/product-type/actions'
import CreateEditProductType from 'src/views/pages/manage-product/product-type/components/CreateEditProductType'
import { deleteMultipleProductAsync, deleteProductAsync, getAllProductsAsync } from 'src/stores/product/actions'
import CreateEditProduct from 'src/views/pages/manage-product/product/components/CreateEditProduct'

// **

const StyleGridColDef = styled(DataGrid)<GridColDef>(({ theme }) => ({
  '& .MuiDataGrid-columnHeaderTitleContainer': {}
}))

type TProps = {}

type TSelectedRow = {
  id: string
  role: { name: string; permissions: string[] }
}

const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const TempLockedUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const ProductListPage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteProduct, setOpenDeleteProduct] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleProduct, setOpenDeleteMultipleProduct] = useState(false)
  // const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  // const [roleSelected, setRoleSelected] = useState('')
  // const [statusSelected, setStatusSelected] = useState('')

  // Filter theo roleId status cityId
  // const [filterBy, setFilterBy] = useState<Record<string, string>>({})

  // const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()
  // ** Hooks
  const { t, i18n } = useTranslation()

  // const tableActions = [{ label: t('Xoá'), value: 'delete' }]

  // ** Context
  const { user } = useAuth()

  // ** Permission, key của nó chính là những SYSTEM.ROLE
  const { VIEW, UPDATE, CREATE, DELETE } = usePermission('MANAGE_PRODUCT.PRODUCT_TYPE', [
    'VIEW',
    'CREATE',
    'UPDATE',
    'DELETE'
  ])

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()
  const {
    products,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.product)

  // console.log('Chekckkkkkk console')
  // console.log('Checkkk users return data', { data: users.data })

  // ** theme
  const theme = useTheme()

  const handleGetListProducts = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }
    dispatch(getAllProductsAsync(query))
  }

  const columns: GridColDef[] = [
    {
      field: 'name', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Name'),
      // flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'type', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Type'),
      // flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row?.type.name}</Typography>
      }
    },
    {
      field: 'price', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Price'),
      // flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row?.price}</Typography>
      }
    },
    {
      field: 'countInStock', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Count_in_stock'),
      // flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{row?.countInStock}</Typography>
      }
    },
    {
      field: 'status', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Status'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return (
          <>{row?.status ? <ActiveUserStyled label={t('Public')} /> : <TempLockedUserStyled label={t('Private')} />}</>
        )
      }
    },
    {
      field: 'createAt',
      headerName: t('Created_date'),
      // flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: (params) => {
        const { row } = params

        return <Typography>{formatDate(row?.createdAt, { dateStyle: 'short' })}</Typography>
      }
    },

    {
      field: 'action',
      headerName: t('Actions'),
      // flex: 1,
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
                  setOpenDeleteProduct({
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
  const handleCloseConfirmDeleteProduct = () => {
    setOpenDeleteProduct({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleProduct = () => {
    setOpenDeleteMultipleProduct(false)
  }

  // ** handle Close Create Edit
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  // handle Delete Role
  const handleDeleteProduct = () => {
    dispatch(deleteProductAsync(openDeleteProduct.id))
  }

  const handleDeleteMultipleProduct = () => {
    // lấy ra mảng các id cần phải xoá
    dispatch(
      deleteMultipleProductAsync({
        productIds: selectedRow
      })
    )
    // handleCloseConfirmDeleteMultipleUser()
  }

  // ** Handle Sort All Role
  const handleSort = (sort: GridSortModel) => {
    // console.log('Checkkk sort', { sort })
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  // ** Handle action delete multiple users
  const handleActionDelete = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleProduct(true)
        // console.log('Checkkk Delete', { selectedRow })
        break
      }
    }
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  // ** Create Pagination Component
  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        pageSize={pageSize}
        page={page}
        rowLength={products.total}
      />
    )
  }

  // handle get detail permission role
  // const handleGetDetailUser = async (id: string) => {
  //   setLoading(true)
  //   await getDetailsUser(id)
  //     .then((res) => {
  //       if (res?.data) {
  //         // const isDefaultPermission = [PERMISSIONS.ADMIN, PERMISSIONS.BASIC].some((item) =>
  //         //   res?.data.permissions.includes(item)
  //         // )
  //         // if (res?.data.permissions.includes(PERMISSIONS.ADMIN)) {
  //         //   setIsDisablePermission(true)
  //         //   setPermissionSelected(getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
  //         // } else if (res?.data.permissions.includes(PERMISSIONS.BASIC)) {
  //         //   setIsDisablePermission(true)
  //         //   setPermissionSelected(PERMISSIONS.DASHBOARD)
  //         // } else {
  //         //   setIsDisablePermission(false)
  //         //   setPermissionSelected(res?.data?.permissions || [])
  //         // }
  //       }
  //       setLoading(false)
  //     })
  //     .catch((e) => {
  //       setLoading(false)
  //     })
  // }

  useEffect(() => {
    handleGetListProducts()
  }, [sortBy, searchBy, page, pageSize])

  // Lấy ra Role id trong danh sách Role List trong CMS -> `RoleId` thì mới callApi
  // useEffect(() => {
  //   if (selectedRow.id) {
  //     handleGetDetailUser(selectedRow.id)
  //   }
  // }, [selectedRow])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit?.id) {
        toast.success(t('Create_product_success'))
      } else {
        toast.success(t('Update_product_success'))
      }
      handleGetListProducts()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit?.id) {
          toast.error(t('Update_product_error'))
        } else {
          toast.error(t('Create_product_error'))
        }
      }
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  // ** Delete User
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteProduct()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_product_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  // ** Delete Multiple User
  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleProduct()
      // Set  selectedRow lại thành một cái array rỗng
      setSelectedRow([])
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_product_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {/* {loading && <Spinner />} */}
      <ConfirmationDialog
        open={openDeleteProduct.open}
        handleClose={handleCloseConfirmDeleteProduct}
        handleCancel={handleCloseConfirmDeleteProduct}
        handleConfirm={handleDeleteProduct}
        title={t('Title_delete_product')}
        description={t('Confirm_delete_product')}
      />
      <ConfirmationDialog
        open={openDeleteMultipleProduct}
        handleClose={handleCloseConfirmDeleteMultipleProduct}
        handleCancel={handleCloseConfirmDeleteMultipleProduct}
        handleConfirm={handleDeleteMultipleProduct}
        title={t('Title_delete_multiple_product')}
        description={t('Confirm_delete_multiple_product')}
      />
      <CreateEditProduct open={openCreateEdit.open} onClose={handleCloseCreateEdit} idProduct={openCreateEdit.id} />
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
              actions={[{ label: t('Xoá'), value: 'delete', disabled: !DELETE }]}
              handleActionDelete={handleActionDelete}
            />
          )}
          {/* Table custom grid */}
          <CustomDataGrid
            rows={products?.data}
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
            // pageSizeOptions={[5]}
            disableRowSelectionOnClick
            checkboxSelection
            // getRowClassName={(row: GridRowClassNameParams) => {
            //   return row.id === selectedRow.id ? 'row-selected' : ''
            // }}
            slots={{
              // Sẽ nhận vào component pagination
              pagination: PaginationComponent
            }}
            // Thì thằng ở đây nó cần có cái id của nó, chúng ta không thể nào truyền array như formatData được
            rowSelectionModel={selectedRow}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
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

export default ProductListPage
