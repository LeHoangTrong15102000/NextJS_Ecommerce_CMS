// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'

// ** MUI
import { Box, Grid, styled, Typography, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Tab from '@mui/material/Tab'
import Tabs, { TabsProps } from '@mui/material/Tabs'

// ** Components
import CardProduct from 'src/views/pages/product/components/CardProduct'
import InputSearch from 'src/components/input-search'
import FilterProduct from 'src/views/pages/product/components/FilterProduct'
import NoData from 'src/components/no-data'

import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'

// ** React-Hook-Form

// ** Types
import { TProduct } from 'src/types/product'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** i18next
import { useTranslation } from 'react-i18next'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Util
import { formatDate, formatFilter, handleToFullName } from 'src/utils'

// ** Service
import { getAllCities } from 'src/services/city'
import { getAllProductsPublic } from 'src/services/product'
import { getAllProductTypes } from 'src/services/product-type'

// ** Custom hooks

// ** Actions

// **

const StyleGridColDef = styled(DataGrid)<GridColDef>(({ theme }) => ({
  '& .MuiDataGrid-columnHeaderTitleContainer': {}
}))

type TProps = {}

type TSelectedRow = {
  id: string
  role: { name: string; permissions: string[] }
}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

const HomePage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')

  const [typeSelected, setTypeSelected] = useState<string[]>([])

  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  // Filter theo roleId status cityId
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [productsPublic, setProductsPublic] = useState({
    data: [],
    total: 0
  })
  // Tablist Catelogies
  const [productTypeSelected, setProductTypeSelected] = useState('')
  const [reviewSelected, setReviewSelected] = useState<string>('')
  const [locationSelected, setLocationSelected] = useState<string>('')

  // useRef
  const firstRender = useRef<boolean>(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setProductTypeSelected(newValue)
  }

  // ** Hooks
  const { t, i18n } = useTranslation()

  // const tableActions = [{ label: t('Xoá'), value: 'delete' }]

  // ** Context
  const { user } = useAuth()

  // ** theme
  const theme = useTheme()

  const handleGetListProducts = async () => {
    setLoading(true)
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    await getAllProductsPublic(query).then((res) => {
      // console.log('checkkk res', { res })
      if (res?.data) {
        setProductsPublic({
          data: res?.data?.products,
          total: res?.data?.totalCount
        })
      }
      setLoading(false)
    })
    // dispatch(getAllProductsAsync(query))
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  // Handle Filter Product - drop component FilterProduct
  const handleFilterProduct = (value: string, type: string) => {
    switch (type) {
      case 'review': {
        setReviewSelected(value)
        break
      }
      case 'location': {
        setLocationSelected(value)
        break
      }
    }
  }

  // Handle reset filter
  const handleResetFilter = () => {
    setLocationSelected('')
    setReviewSelected('')
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
          // Thay vì là mặc định không có gì thì chúng ta sẽ lấy thằng đầu tiên như thế này
          setProductTypeSelected(data[0]?._id)
          firstRender.current = true
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        // console.log('Checkkkk Error', { error })
      })
  }

  // Fetch all Cities
  const fetchAllCities = async () => {
    await getAllCities({
      params: {
        page: -1,
        limit: -1
      }
    })
      .then((res) => {
        setLoading(true)
        const data = res?.data.cities
        if (data) {
          setOptionCities(
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
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      handleGetListProducts()
    }
  }, [sortBy, searchBy, page, pageSize, filterBy])

  useEffect(() => {
    if (firstRender.current) {
      setFilterBy({
        productType: productTypeSelected,
        minStar: reviewSelected,
        productLocation: locationSelected
      })
    }
  }, [productTypeSelected, reviewSelected, locationSelected])

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
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100%'
        }}
      >
        <StyledTabs value={productTypeSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
          {/* Chỉ cần map nó ra như vậy thôi */}
          {optionTypes.map((opt) => {
            return <Tab key={opt.value} value={opt.value} label={opt.label} />
          })}
        </StyledTabs>
        <Box sx={{ width: '100%', mt: 4, display: 'flex', alingItems: 'center', justifyContent: 'flex-end' }}>
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
            <Grid item md={3} display={{ md: 'flex', xs: 'none' }}>
              <Box sx={{ width: '100%', height: 'auto' }}>
                <FilterProduct
                  isShowBtnReset={Boolean(locationSelected || reviewSelected)}
                  handleReset={handleResetFilter}
                  optionCities={optionCities}
                  handleFilterProduct={handleFilterProduct}
                />
              </Box>
            </Grid>
            <Grid item md={9} xs={12}>
              {/* Cấu trúc như thế này thì nó sẽ không bị hiểu lộn nữa */}
              {/* Nếu mà để item và container chung một Grid thì nó sẽ hiểu lầm */}
              <Grid container spacing={{ md: 6, xs: 4 }}>
                {productsPublic?.data?.length > 0 ? (
                  <>
                    {productsPublic?.data?.map((item: TProduct) => {
                      // xs < sm
                      return (
                        <Grid item key={item._id} md={4} sm={6} xs={12}>
                          <CardProduct item={item} />
                        </Grid>
                      )
                    })}
                  </>
                ) : (
                  <>
                    {!productsPublic.data.length && !loading && (
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 10
                        }}
                      >
                        <NoData widthImage='100px' heightImage='100px' textNodata={t('No_data_product')} />
                      </Box>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {productsPublic.data.length && (
          <CustomPagination
            onChangePagination={handleOnChangePagination}
            pageSizeOptions={PAGE_SIZE_OPTION}
            pageSize={pageSize}
            page={page}
            rowLength={10}
            isHideShowed
          />
        )}
      </Box>
    </>
  )
}

export default HomePage
