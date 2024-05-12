// **  Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useMemo, useState } from 'react'

// ** MUI
import {
  Avatar,
  AvatarProps,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  ListItem,
  styled,
  Tab,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { IconButton } from '@mui/material'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// ** Toast

import { TCardOrderProductMe } from 'src/types/order-product'
import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { getAllOrderProductsAsync } from 'src/stores/order-product/actions'
import CardOrder from 'src/views/pages/my-order/components/CardOrder'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import InputSearch from 'src/components/input-search'

type TProps = {}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))

const VALUE_OPTION_STATUS = {
  // 0: wait payment, 1: wait delivery, 2: done, 3: cancel
  WAIT_PAYMENT: 0,
  WAIT_DELIVERY: 1,
  DONE: 2,
  CANCEL: 3,
  ALL: 4
}

const MyOrderPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng
  const [searchBy, setSearchBy] = useState('')
  // Mặc định nó sẽ là all
  const [statusSelected, setStatusSelected] = useState(VALUE_OPTION_STATUS.ALL)

  const { t, i18n } = useTranslation()

  const OPTIONS_STATUS = [
    {
      label: t('All_status_order'),
      value: VALUE_OPTION_STATUS.ALL
    },
    {
      label: t('Wait_payment'),
      value: VALUE_OPTION_STATUS.WAIT_PAYMENT
    },
    {
      label: t('Wait_delivery'),
      value: VALUE_OPTION_STATUS.WAIT_DELIVERY
    },
    {
      label: t('Done_order_product'),
      value: VALUE_OPTION_STATUS.DONE
    },
    {
      label: t('Cancel_order_product'),
      value: VALUE_OPTION_STATUS.CANCEL
    }
  ]

  // ** theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { ordersProductOfMe, orderItems, isLoading } = useSelector((state: RootState) => state.orderProduct)

  // Fetch API get order Product of me
  const handleGetListOrderProductsOfMe = () => {
    const query = {
      params: {
        limit: pageSize,
        page: page,
        status: statusSelected === VALUE_OPTION_STATUS.ALL ? '' : statusSelected,
        search: searchBy
      }
    }
    dispatch(getAllOrderProductsAsync(query))
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  const handleChangeStatusTabOrder = (event: React.SyntheticEvent, newValue: string) => {
    setStatusSelected(+newValue)
  }

  useEffect(() => {
    handleGetListOrderProductsOfMe()
  }, [i18n.language, page, pageSize, statusSelected, searchBy])

  return (
    <>
      {(loading || isLoading) && <Spinner />}
      <StyledTabs value={statusSelected} onChange={handleChangeStatusTabOrder} aria-label='wrapped label tabs example'>
        {/* Chỉ cần map nó ra như vậy thôi */}
        {OPTIONS_STATUS.map((opt) => {
          return <Tab key={opt.value} value={opt.value} label={opt.label} />
        })}
      </StyledTabs>
      <Box sx={{ width: '100%', mt: 2, mb: 4, display: 'flex', alingItems: 'center', justifyContent: 'flex-end' }}>
        <Box sx={{ width: '300px' }}>
          <InputSearch
            placeholder={t('Search_name_product')}
            value={searchBy}
            onChange={(value: string) => setSearchBy(value)}
          />
        </Box>
      </Box>
      <Box
        sx={
          {
            // height: '80vh',
            // width: '100%',
            // backgroundColor: theme.palette.background.paper,
            // padding: '40px',
            // width: '100%',
            // borderRadius: '15px'
          }
        }
      >
        {ordersProductOfMe?.data?.length > 0 ? (
          <Fragment>
            {/* Grid Content Order Product */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '20px',
                mt: '10px'
              }}
            >
              {ordersProductOfMe?.data.map((item: TCardOrderProductMe, index: number) => {
                return <CardOrder key={item._id} dataOrder={item} />
              })}
            </Box>
          </Fragment>
        ) : (
          // Width 100% để thằng này nó nằm ở chính giữa luôn
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                padding: '20px',
                width: '100%'
              }}
            >
              <NoData widthImage='60px' heightImage='60px' textNodata={t('No_data_product')} />
            </Box>
          </Box>
        )}
        {/* Sum tổng giá tiền của giỏ hàng  */}
      </Box>
      <Box mt={4}>
        <CustomPagination
          onChangePagination={handleOnChangePagination}
          pageSizeOptions={PAGE_SIZE_OPTION}
          pageSize={pageSize}
          page={page}
          rowLength={ordersProductOfMe.total}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default MyOrderPage
