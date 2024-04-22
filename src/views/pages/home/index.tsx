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

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Util
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { formatDate, formatFilter, handleToFullName } from 'src/utils'

// ** Custom hooks

// ** Actions

import { OBJECT_STATUS_PRODUCT } from 'src/configs/product'
import { getAllProductTypes } from 'src/services/product-type'
import CardProduct from 'src/views/pages/home/components/CardProduct'
import { getAllProductsPublic } from 'src/services/product'

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

const HomePage: NextPage<TProps> = () => {
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
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')

  // const [citySelected, setCitySelected] = useState<string[]>([])
  const [typeSelected, setTypeSelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])
  // const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])

  // Filter theo roleId status cityId
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})

  // ** Object product
  const CONSTANT_STATUS_PRODUCT = OBJECT_STATUS_PRODUCT()

  // ** Hooks
  const { t, i18n } = useTranslation()

  // const tableActions = [{ label: t('Xoá'), value: 'delete' }]

  // ** Context
  const { user } = useAuth()

  // ** theme
  const theme = useTheme()

  const handleGetListProducts = async () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    await getAllProductsPublic(query).then((res) => {
      console.log('checkkk res', { res })
    })
    // dispatch(getAllProductsAsync(query))
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
        rowLength={10}
      />
    )
  }

  const fetchAllProductTypes = async () => {
    await getAllProductTypes({
      params: {
        page: -1,
        limit: -1
      }
    })
      .then((res) => {
        setLoading(true)
        console.log('Checkkk Res City', { res })
        const data = res?.data.productTypes
        if (data) {
          setOptionTypes(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item.name,
                value: item._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('Checkkkk Error', { error })
      })
  }

  useEffect(() => {
    fetchAllProductTypes()
  }, [])

  useEffect(() => {
    setFilterBy({
      status: statusSelected,
      productType: typeSelected
    })
  }, [statusSelected, typeSelected])

  useEffect(() => {
    handleGetListProducts()
  }, [sortBy, searchBy, page, pageSize, filterBy])

  // Lấy ra Role id trong danh sách Role List trong CMS -> `RoleId` thì mới callApi
  // useEffect(() => {
  //   if (selectedRow.id) {
  //     handleGetDetailUser(selectedRow.id)
  //   }
  // }, [selectedRow])

  return (
    <>
      {loading && <Spinner />}

      {/* {isLoading && <Spinner />} */}
      <Box
        sx={{
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'center',
          padding: '20px',
          height: '100%',
          maxHeight: '100%'
          // overflow: 'auto'
        }}
      >
        <CardProduct />
      </Box>
    </>
  )
}

export default HomePage
