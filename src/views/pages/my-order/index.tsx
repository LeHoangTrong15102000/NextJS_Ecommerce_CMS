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

type TProps = {}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const MyOrderPage: NextPage<TProps> = () => {
  // ** State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0]) // Có thằng select để cho hiển thị bao nhiêu dòng

  const { t, i18n } = useTranslation()

  // ** theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { ordersProductOfMe, orderItems } = useSelector((state: RootState) => state.orderProduct)

  // Fetch API get order Product of me
  const handleGetListOrderProductsOfMe = () => {
    const query = {
      params: { limit: pageSize, page: page }
    }
    dispatch(getAllOrderProductsAsync(query))
  }

  // Handle Pagination
  const handleOnChangePagination = (page: number, pageSize: number) => {
    // console.log('Checkk page và pageSize', { page, pageSize })
    setPage(page)
    setPageSize(pageSize)
  }

  useEffect(() => {
    handleGetListOrderProductsOfMe()
  }, [i18n.language, page, pageSize])

  return (
    <>
      {/* {loading && <Spinner />} */}
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
              padding: '20px',
              width: '100%'
            }}
          >
            <NoData widthImage='60px' heightImage='60px' textNodata={t('No_data_product')} />
          </Box>
        )}
        {/* Sum tổng giá tiền của giỏ hàng  */}
      </Box>
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        pageSize={pageSize}
        page={page}
        rowLength={ordersProductOfMe.total}
        isHideShowed
      />
    </>
  )
}

export default MyOrderPage
