// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  styled,
  Tab,
  Tabs,
  TabsProps,
  useTheme
} from '@mui/material'
import { IconButton } from '@mui/material'

// ** Components

// ** React-Hook-Form

// ** Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Types

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Service

// ** Utils

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateMeAuthAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// ** Toast
import toast from 'react-hot-toast'
import { getAllProductsLikedAsync, getAllProductsViewedAsync } from 'src/stores/product/actions'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import NoData from 'src/components/no-data'
import { TProduct } from 'src/types/product'
import CustomPagination from 'src/components/custom-pagination'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import InputSearch from 'src/components/input-search'
import { useRouter } from 'next/router'
import path from 'src/configs/path'

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

type TProps = {}

const TYPE_VALUE = {
  liked: '1',
  viewed: '2'
}

const MyProductPage: NextPage<TProps> = () => {
  // ** Hook
  const { t, i18n } = useTranslation()
  // ** State
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [searchBy, setSearchBy] = useState('')
  const [productTypeSelected, setProductTypeSelected] = useState('')
  const [tabActive, setTabActive] = useState(TYPE_VALUE.viewed)
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([
    {
      label: t('Product_viewed'),
      value: TYPE_VALUE.viewed
    },
    {
      label: t('Product_liked'),
      value: TYPE_VALUE.liked
    }
  ])

  // ** ContextApi
  const { setUser } = useAuth()

  // ** Router
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { messageUpdateMe, isSuccessUpdateMe, isErrorUpdateMe } = useSelector((state: RootState) => state.auth)
  const {
    isLoading,
    isSuccessLike,
    isSuccessUnLike,
    isErrorLike,
    isErrorUnLike,
    messageErrorLike,
    messageErrorUnLike,
    viewedProducts,
    likedProducts,
    typeError
  } = useSelector((state: RootState) => state.product)

  // ** theme
  const theme = useTheme()

  // Handle getListData
  const handleGetListData = () => {
    if (tabActive === TYPE_VALUE.liked) {
      handleGetListProductLiked()
    } else {
      handleGetListProductViewed()
    }
  }

  // handle Change
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabActive(newValue)
    // Khi mà chuyển tab thì cũng reset lại page và pageSize nữa
    setPage(1)
    setPageSize(PAGE_SIZE_OPTION[0])
    setSearchBy('')
  }

  // Get product viewed
  const handleGetListProductViewed = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy }
    }
    dispatch(getAllProductsViewedAsync(query))
  }

  // Get product liked
  const handleGetListProductLiked = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy }
    }
    dispatch(getAllProductsLikedAsync(query))
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  useEffect(() => {
    handleGetListData()
  }, [searchBy, tabActive])

  // useEffect cập nhật lại trạng thái  của like product
  useEffect(() => {
    if (isSuccessLike) {
      toast.success(t('Like_product_success'))
      dispatch(resetInitialState())
      handleGetListData()
    } else if (isErrorLike && messageErrorLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Like_product_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessLike, isErrorLike, messageErrorLike, typeError])

  useEffect(() => {
    if (isSuccessUnLike) {
      toast.success(t('Unlike_product_success'))
      dispatch(resetInitialState())
      handleGetListData()
    } else if (isErrorUnLike && messageErrorUnLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Unlike_product_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUnLike, isErrorUnLike, messageErrorUnLike, typeError])

  // useEffect(() => {
  //   fetchAllProductTypes()
  // }, [])

  // useEffect(() => {
  //   if (messageUpdateMe) {
  //     if (isErrorUpdateMe) {
  //       toast.error(messageUpdateMe)
  //     } else if (isSuccessUpdateMe) {
  //       toast.success(messageUpdateMe)
  //       // Thì khi mà update thành công thì tại fetchGetAuthMe
  //       // fetchGetMeAuth()
  //     }
  //     dispatch(resetInitialState())
  //   }
  // }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe, dispatch])

  return (
    <>
      {/* {(loading || isLoading) && <Spinner />} */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          py: 5,
          px: 4
        }}
      >
        {/* Grid Left */}
        <Grid container item md={12} xs={12}>
          <StyledTabs value={tabActive} onChange={handleChange} aria-label='wrapper'>
            {/* Chỉ cần map nó ra như vậy thôi */}
            {optionTypes.map((opt) => {
              return <Tab key={opt.value} value={opt.value} label={opt.label} />
            })}
          </StyledTabs>
          {/* Cho cái thz width 100% để cái input search nó nằm riêng ra */}
          <Box sx={{ width: '100%', mt: 2, display: 'flex', alingItems: 'center', justifyContent: 'flex-end' }}>
            <Box sx={{ width: '300px' }}>
              <InputSearch
                placeholder={t('Search_name_product')}
                value={searchBy}
                onChange={(value: string) => setSearchBy(value)}
              />
            </Box>
          </Box>
          {/* Danh sách sản phẩm đã like và đã xem */}
          {tabActive === TYPE_VALUE.liked && (
            <Box
              sx={{
                height: '100%',
                width: '100%',
                mt: 6
              }}
            >
              <Grid container md={12} xs={12} spacing={4}>
                {likedProducts?.data?.length > 0 ? (
                  <>
                    {likedProducts?.data?.map((item: TProduct) => {
                      // xs < sm
                      return (
                        <Grid item key={item._id} md={3} sm={6} xs={12}>
                          <CardProduct item={item} />
                        </Grid>
                      )
                    })}
                  </>
                ) : (
                  <>
                    {!likedProducts.data.length && !loading && (
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
            </Box>
          )}
          {tabActive === TYPE_VALUE.viewed && (
            <Box
              sx={{
                height: '100%',
                width: '100%',
                mt: 6
              }}
            >
              <Grid container md={12} xs={12} spacing={4}>
                {viewedProducts?.data?.length > 0 ? (
                  <>
                    {viewedProducts?.data?.map((item: TProduct) => {
                      // xs < sm
                      return (
                        <Grid item key={item._id} md={3} sm={6} xs={12}>
                          <CardProduct item={item} />
                        </Grid>
                      )
                    })}
                  </>
                ) : (
                  <>
                    {!viewedProducts.data.length && !loading && (
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
            </Box>
          )}
        </Grid>
        {(viewedProducts.data.length > 0 || likedProducts.data.length > 0) && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <CustomPagination
              onChangePagination={handleOnChangePagination}
              pageSizeOptions={PAGE_SIZE_OPTION}
              pageSize={pageSize}
              page={page}
              rowLength={tabActive === TYPE_VALUE.liked ? likedProducts.total : viewedProducts.total}
              isHideShowed
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default MyProductPage
