// **  Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** MUI
import { Box, Chip, ChipProps, Grid, styled, Tooltip, Typography, useTheme } from '@mui/material'
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
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/error'

// ** Util
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { formatFilter, handleToFullName } from 'src/utils'

// ** Custom hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Actions
import { deleteMultipleUserAsync, deleteUserAsync, getAllUsersAsync } from 'src/stores/user/actions'
import { getDetailsUser } from 'src/services/user'
import TableHeader from 'src/components/table-header'
import { PERMISSIONS } from 'src/configs/permission'
import CustomSelect from 'src/components/custom-select'
import { getAllRoles } from 'src/services/role'
import { OBJECT_STATUS_USER } from 'src/configs/user'
import { getAllCities } from 'src/services/city'
import { deleteOrderProductAsync, getAllOrderProductsAsync } from 'src/stores/order-product/actions'
import { STATUS_ORDER_PRODUCT, STATUS_ORDER_PRODUCT_OBJECT } from 'src/configs/statusOrder'
import { AvatarGroup } from '@mui/material'
import { Avatar } from '@mui/material'
import { TItemOrderProducts } from 'src/types/order-product'
import UpdateOrderProduct from 'src/views/pages/manage-order/order-product/components/UpdateOrderProduct'
import UpdateReviewProduct from 'src/views/pages/manage-order/reviews/components/UpdateReviewProduct'
import { deleteReviewProductAsync, getAllReviewProductsAsync } from 'src/stores/review-product/actions'
import { FILTER_REVIEW_CMS } from 'src/configs/reviews'

// **

const StyleGridColDef = styled(DataGrid)<GridColDef>(({ theme }) => ({
  '& .MuiDataGrid-columnHeaderTitleContainer': {}
}))

type TProps = {}

type TSelectedRow = {
  id: string
  role: { name: string; permissions: string[] }
}

interface StatusOrderChipT extends ChipProps {
  background: string
}

const OrderStatusStyled = styled(Chip)<StatusOrderChipT>(({ theme, background }) => ({
  backgroundColor: background,
  color: theme.palette.common.white,
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

// const TempLockedUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
//   backgroundColor: '#da251d29',
//   color: '#da251d',
//   fontSize: '14px',
//   padding: '8px 4px',
//   fontWeight: 400
// }))

const ReviewProductListPage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng
  const [openEdit, setOpenEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteReview, setOpenDeleteReview] = useState({
    open: false,
    id: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])

  const [statusSelected, setStatusSelected] = useState<string[]>([])
  const [starSelected, setStarSelected] = useState<string[]>([])

  // Filter theo roleId status cityId
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [openDeleteMultipleProduct, setOpenDeleteMultipleProduct] = useState(false)

  const CONSTANT_STATUS_ORDER_PRODUCT = STATUS_ORDER_PRODUCT()
  // ** Hooks
  const { t, i18n } = useTranslation()

  // const tableActions = [{ label: t('Xoá'), value: 'delete' }]

  // ** Context
  const { user } = useAuth()

  // ** Permission, key của nó chính là những SYSTEM.ROLE
  const { VIEW, UPDATE, DELETE } = usePermission('MANAGE_ORDER.ORDER', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // ** Redux - Phải thêm AppDispatch vào không là nó sẽ bị lỗi UnknowAction
  const dispatch: AppDispatch = useDispatch()
  const {
    reviewsProduct,
    isSuccessUpdateReview,
    isErrorUpdateReview,
    isLoading,
    messageErrorUpdateReview,
    isSuccessDeleteReview,
    isErrorDeleteReview,
    messageErrorDeleteReview,
    typeError
  } = useSelector((state: RootState) => state.reviewProduct)

  // ** theme
  const theme = useTheme()

  const STATUS_REVIEW_PRODUCT = FILTER_REVIEW_CMS()

  const handleGetListReviewsProduct = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    dispatch(getAllReviewProductsAsync(query))
  }

  const columns: GridColDef[] = [
    {
      field: 'firstName', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('User'),
      hideSortIcons: true,
      minWidth: 200,
      maxWidth: 300,
      flex: 1,
      renderCell: (params) => {
        const { row } = params
        // console.log('Chekc params', { params })
        const fullName = handleToFullName(
          row?.user?.lastName || '',
          row?.user?.middleName || '',
          row?.user?.firstName || '',
          i18n.language
        )
        return (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {fullName}
          </Typography>
        )
      }
    },
    {
      field: 'name', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Product_name'),
      minWidth: 200,
      maxWidth: 300,
      flex: 1,
      renderCell: (params) => {
        const { row } = params
        // console.log('Checkkkk row params', { row })

        return (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            <Tooltip title={row.product.name}>
              <span>{row?.product?.name}</span>
            </Tooltip>
          </Typography>
        )
      }
    },

    {
      field: 'content', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Content_review'),
      hideSortIcons: true,
      minWidth: 200,
      maxWidth: 300,
      flex: 1,
      renderCell: (params) => {
        const { row } = params
        // console.log('Checkkk city user', { row })

        return (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            <Tooltip title={row?.content}>
              <span>{row?.content}</span>
            </Tooltip>
          </Typography>
        )
      }
    },
    {
      field: 'star', // dựa vào cái field này để lấy cái key trong data chúng ta truyền vào
      headerName: t('Star_review'),
      minWidth: 200,
      maxWidth: 300,
      flex: 1,
      renderCell: (params) => {
        const { row } = params

        return <>{row?.star}</>
      }
    },
    {
      field: 'action',
      headerName: t('Actions'),
      minWidth: 200,
      maxWidth: 200,
      flex: 1,
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
                    setOpenEdit({
                      open: true,
                      id: String(params.id)
                    })
                  }
                }}
              />

              <GridDelete
                disabled={!DELETE}
                onClick={() =>
                  setOpenDeleteReview({
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
  const handleCloseConfirmDeleteReview = () => {
    setOpenDeleteReview({
      open: false,
      id: ''
    })
  }

  // ** handle Close Create Edit
  const handleCloseUpdate = () => {
    setOpenEdit({
      open: false,
      id: ''
    })
  }

  // handle Delete Role
  const handleDeleteReviewProduct = () => {
    dispatch(deleteReviewProductAsync(openDeleteReview.id))
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
        rowLength={reviewsProduct.total}
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

  // useEffect fetch roles

  // useEffect(() => {
  //   fetchAllCities()
  // }, [])

  // Khi mà onChange thằng star thì nó sẽ chạy cái useEffect này
  // Sort with FilterBy roleId status cityId
  useEffect(() => {
    setFilterBy({
      minStar: starSelected
    })
  }, [starSelected])

  useEffect(() => {
    handleGetListReviewsProduct()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  // Lấy ra Role id trong danh sách Role List trong CMS -> `RoleId` thì mới callApi
  // useEffect(() => {
  //   if (selectedRow.id) {
  //     handleGetDetailUser(selectedRow.id)
  //   }
  // }, [selectedRow])

  useEffect(() => {
    if (isSuccessUpdateReview) {
      toast.success(t('Update_review_success'))
      handleGetListReviewsProduct()
      handleCloseUpdate()
      dispatch(resetInitialState())
    } else if (isErrorUpdateReview && messageErrorUpdateReview && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Update_review_error'))
      }
      handleCloseUpdate()
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateReview, isErrorUpdateReview, messageErrorUpdateReview, typeError])

  // ** Delete User
  useEffect(() => {
    if (isSuccessDeleteReview) {
      toast.success(t('Delete_review_success'))
      handleGetListReviewsProduct()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteReview()
    } else if (isErrorDeleteReview && messageErrorDeleteReview) {
      toast.error(t('Delete_review_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteReview, isErrorDeleteReview, messageErrorDeleteReview])

  const memoOptionReview = useMemo(() => {
    return STATUS_REVIEW_PRODUCT.map((item) => ({
      label: t(item.label),
      value: item.value
    }))
  }, [])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteReview.open}
        handleClose={handleCloseConfirmDeleteReview}
        handleCancel={handleCloseConfirmDeleteReview}
        handleConfirm={handleDeleteReviewProduct}
        title={t('Title_delete_review')}
        description={t('Confirm_delete_review')}
      />
      {/* <ConfirmationDialog
        open={openDeleteMultipleUser}
        handleClose={handleCloseConfirmDeleteMultipleUser}
        handleCancel={handleCloseConfirmDeleteMultipleUser}
        handleConfirm={handleDeleteMultipleUser}
        title={t('Title_delete_multiple_order_product')}
        description={t('Confirm_delete_multiple_order_product')}
      /> */}
      <UpdateReviewProduct open={openEdit.open} onClose={handleCloseUpdate} idReview={openEdit.id} />
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
              justifyContent: 'flex-end',
              gap: 4,
              mb: 4,
              width: '100%'
            }}
          >
            {/* <Box
                sx={{
                  width: '200px'
                }}
              >
                <CustomSelect
                  onChange={(e) => setRoleSelected(e.target.value as string[])}
                  fullWidth
                  multiple
                  value={roleSelected}
                  options={optionRoles}
                  placeholder={t('Role')}
                />
              </Box> */}

            <Box
              sx={{
                width: '200px'
              }}
            >
              <CustomSelect
                onChange={(e) => setStarSelected(e.target.value as string[])}
                fullWidth
                multiple
                value={starSelected}
                options={memoOptionReview}
                placeholder={t('Star')}
              />
            </Box>

            <Box sx={{ width: '200px' }}>
              <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
            </Box>
          </Box>
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
            rows={reviewsProduct?.data}
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
            // checkboxSelection
            // getRowClassName={(row: GridRowClassNameParams) => {
            //   return row.id === selectedRow.id ? 'row-selected' : ''
            // }}
            slots={{
              // Sẽ nhận vào component pagination
              pagination: PaginationComponent
            }}
            // Thì thằng ở đây nó cần có cái id của nó, chúng ta không thể nào truyền array như formatData được
            // rowSelectionModel={selectedRow?.map((item) => item.id)}
            // Lấy ra thằng row để chọn checkbox được từng thằng và có thể xóa multiple được
            //  Thực hiện onChange cho thằng checkbox của table MUI
            // onRowSelectionModelChange={(row: GridRowSelectionModel) => {
            //   const formatData: any = row.map((id) => {
            //     const findRow: any = ordersProduct?.data?.find((item: any) => item._id === id)
            //     if (findRow) {
            //       return {
            //         id: findRow?._id,
            //         role: findRow?.role
            //       }
            //     }
            //   })
            //   // console.log('Checkkkk row selecction', { row })
            //   // set cái array các row được chọn vào trong selectedRow
            //   setSelectedRow(formatData)
            // }}
            disableColumnFilter
            disableColumnMenu
          />
          {/* Grid right - List Permission */}
        </Grid>
      </Box>
    </>
  )
}

export default ReviewProductListPage
