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
import CustomTextField from 'src/components/text-field'
import CustomIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import FallbackSpinner from 'src/components/fall-back'

// ** React-Hook-Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Types
import { TLoginAuth } from 'src/types/auth'
import { UserDataType } from 'src/contexts/types'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Service
import { getMeAuth } from 'src/services/auth'

// ** Utils
import { convertFileToBase64, handleToFullName, seperationFullName } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateMeAuthAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// ** Toast
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'
import CustomModal from 'src/components/custom-modal'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'
import InputSearch from 'src/components/input-search'
import { getAllProductTypes } from 'src/services/product-type'
import { getAllProductsLikedAsync, getAllProductsViewedAsync } from 'src/stores/product/actions'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import NoData from 'src/components/no-data'
import { TProduct } from 'src/types/product'

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

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { messageUpdateMe, isSuccessUpdateMe, isErrorUpdateMe } = useSelector((state: RootState) => state.auth)
  const { isLoading, viewedProducts, likedProducts } = useSelector((state: RootState) => state.product)

  // ** theme
  const theme = useTheme()

  // handle Change
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabActive(newValue)
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

  // const fetchAllProductTypes = async () => {
  //   await getAllProductTypes({
  //     params: {
  //       page: -1,
  //       limit: -1
  //     }
  //   })
  //     .then((res) => {
  //       setLoading(true)
  //       const data = res?.data.productTypes
  //       if (data) {
  //         setOptionTypes(
  //           data?.map((item: { name: string; _id: string }) => {
  //             return {
  //               label: item.name,
  //               value: item._id
  //             }
  //           })
  //         )
  //         // Thay vì là mặc định không có gì thì chúng ta sẽ lấy thằng đầu tiên như thế này
  //         setProductTypeSelected(data[0]?._id)
  //       }
  //       setLoading(false)
  //     })
  //     .catch((error) => {
  //       setLoading(false)
  //       // console.log('Checkkkk Error', { error })
  //     })
  // }

  useEffect(() => {
    if (tabActive === TYPE_VALUE.liked) {
      handleGetListProductLiked()
    } else {
      handleGetListProductViewed()
    }
  }, [searchBy, tabActive])

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
      <Grid container>
        {/* Grid Left */}
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4
          }}
        >
          <StyledTabs value={tabActive} onChange={handleChange} aria-label='wrapper'>
            {/* Chỉ cần map nó ra như vậy thôi */}
            {optionTypes.map((opt) => {
              return <Tab key={opt.value} value={opt.value} label={opt.label} />
            })}
          </StyledTabs>
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
      </Grid>
    </>
  )
}

export default MyProductPage
