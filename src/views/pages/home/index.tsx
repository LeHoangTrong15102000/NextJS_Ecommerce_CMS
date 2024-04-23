// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import { Box, Grid, styled, Typography, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// ** Components

import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'

// ** React-Hook-Form

// ** Redux

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Util
import { formatDate, formatFilter, handleToFullName } from 'src/utils'

// ** Custom hooks

// ** Actions

import { getAllProductTypes } from 'src/services/product-type'
import CardProduct from 'src/views/pages/home/components/CardProduct'
import { getAllProductsPublic } from 'src/services/product'
import { TProduct } from 'src/types/product'
import InputSearch from 'src/components/input-search'

// **

const StyleGridColDef = styled(DataGrid)<GridColDef>(({ theme }) => ({
  '& .MuiDataGrid-columnHeaderTitleContainer': {}
}))

type TProps = {}

type TSelectedRow = {
  id: string
  role: { name: string; permissions: string[] }
}

const HomePage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

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
  const [productsPublic, setProductsPublic] = useState({
    data: [],
    total: 0
  })
  // Tablist Catelogies
  const [value, setValue] = useState('one')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

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
      if (res?.data) {
        setProductsPublic({
          data: res?.data?.products,
          total: res?.data?.totalCount
        })
      }
    })
    // dispatch(getAllProductsAsync(query))
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
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
          // overflow: 'hidden',
          // backgroundColor: theme.palette.background.paper,
          // display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          // padding: '20px',
          height: '100%',
          maxHeight: '100%'
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label='wrapped label tabs example'>
          {/* Chỉ cần map nó ra như vậy thôi */}
          {optionTypes.map((opt) => {
            return <Tab key={opt.value} value={opt.value} label={opt.label} />
          })}
        </Tabs>
        <Box sx={{ mt: 4, display: 'flex', alingItems: 'center', justifyContent: 'flex-end' }}>
          <Box sx={{ width: '300px' }}>
            <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
          </Box>
        </Box>
        {/* Gắn vào thẻ Box để mà nó không bị padding đẩy lên */}
        <Box
          sx={{
            height: '100%',
            maxHeight: '100%',
            mt: 4,
            mb: 8
          }}
        >
          <Grid
            container
            spacing={{
              md: 6,
              xs: 4
            }}
          >
            {productsPublic?.data?.length > 0 ? (
              <>
                {productsPublic?.data?.map((item: TProduct) => {
                  // xs < sm
                  return (
                    <Grid item key={item._id} md={3} sm={6} xs={12}>
                      <CardProduct item={item} />
                    </Grid>
                  )
                })}
                {productsPublic?.data?.map((item: TProduct) => {
                  // xs < sm
                  return (
                    <Grid item key={item._id} md={3} sm={6} xs={12}>
                      <CardProduct item={item} />
                    </Grid>
                  )
                })}
              </>
            ) : (
              <Typography>Không có dữ liệu</Typography>
            )}
          </Grid>
        </Box>

        <CustomPagination
          onChangePagination={handleOnChangePagination}
          pageSizeOptions={PAGE_SIZE_OPTION}
          pageSize={pageSize}
          page={page}
          rowLength={10}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default HomePage
