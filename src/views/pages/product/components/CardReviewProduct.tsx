// ** MUI
import { styled, useTheme } from '@mui/material/styles'
import Card, { CardProps } from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'

// import FavoriteIcon from '@mui/icons-material/Favorite'
// import ShareIcon from '@mui/icons-material/Share'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import MoreVertIcon from '@mui/icons-material/MoreVert'

// ** React
import { useEffect, useMemo, useState } from 'react'
import CustomIcon from 'src/components/Icon'
import { Box, Button, Palette, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useRouter } from 'next/router'
import path from 'src/configs/path'
import { Rating } from '@mui/material'
import { convertUpdateProductToCart, formatNumberToLocale, handleToFullName, isExpireDiscountDate } from 'src/utils'
import { TItemOrderProduct } from 'src/types/order-product'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// Local storage
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { TReviewItem } from 'src/types/review-product'
import { getTimePast } from 'src/utils/date'
import { deleteReviewProductAsync } from 'src/stores/review-product/actions'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import UpdateReviewProduct from 'src/views/pages/product/components/UpdateReviewProduct'
import toast from 'react-hot-toast'
import { resetInitialStateReview } from 'src/stores/review-product'
import { OBJECT_TYPE_ERROR_REVIEW } from 'src/configs/error'
import Spinner from 'src/components/spinner'

interface TCardReviewProduct {
  item: TReviewItem
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const StyleCard = styled(Card)<CardProps>(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.shadows[5],
  padding: '10px',
  // width: '190px !important',
  // border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain'
  },
  '& .MuiPaper-root.MuiCard-root': {
    minWidth: '200px'
  },
  minHeight: '200px',
  backgroundColor: theme.palette.background.default
}))

const CardReviewProduct = (props: TCardReviewProduct) => {
  const { item } = props

  // ** State
  const [openEdit, setOpenEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteReview, setOpenDeleteReview] = useState({
    open: false,
    id: ''
  })

  const { t, i18n } = useTranslation()
  const theme = useTheme()

  const router = useRouter()

  // ** useAuth
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const {
    isSuccessUpdateReview,
    isErrorUpdateReview,
    isLoading,
    messageErrorUpdateReview,
    isSuccessDeleteReview,
    isErrorDeleteReview,
    messageErrorDeleteReview,
    typeError
  } = useSelector((state: RootState) => state.reviewProduct)

  // handle Navigate details
  const handleNavigateDetails = (slug: string) => {
    router.push(`${path.PRODUCT}/${slug}`)
  }

  // Handle close update
  const handleCloseUpdate = () => {
    setOpenEdit({
      open: false,
      id: ''
    })
  }

  // handle close delete review
  const handleCloseConfirmDeleteReview = () => {
    setOpenDeleteReview({
      open: false,
      id: ''
    })
  }

  // Call API handle delete review
  const handleDeleteReviewProduct = () => {
    dispatch(deleteReviewProductAsync(openDeleteReview.id))
  }

  useEffect(() => {
    if (isSuccessUpdateReview) {
      handleCloseUpdate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateReview, isErrorUpdateReview, messageErrorUpdateReview, typeError])

  // ** Delete User
  useEffect(() => {
    if (isSuccessDeleteReview) {
      handleCloseConfirmDeleteReview()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteReview, isErrorDeleteReview, messageErrorDeleteReview])

  return (
    <>
      {isLoading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteReview.open}
        handleClose={handleCloseConfirmDeleteReview}
        handleCancel={handleCloseConfirmDeleteReview}
        handleConfirm={handleDeleteReviewProduct}
        title={t('Title_delete_review')}
        description={t('Confirm_delete_review')}
      />
      <UpdateReviewProduct open={openEdit.open} onClose={handleCloseUpdate} idReview={openEdit.id} />
      <StyleCard>
        <Box
          sx={{
            display: 'flex',
            alignItem: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItem: 'center',
              gap: 2
            }}
          >
            <Avatar src={item?.user?.avatar} />
            <Box
              sx={{
                flexDirection: 'column'
              }}
            >
              <Typography>
                {handleToFullName(
                  item.user.lastName || '',
                  item?.user?.middleName || '',
                  item?.user?.firstName || '',
                  i18n.language
                )}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignContent: 'center',
                  gap: 1
                }}
              >
                <Rating
                  name='read-only'
                  sx={{ fontSize: '16px', mt: 1 }}
                  // ban đầu khi mà mount thì nó sẽ lấy giá trị defaultValue này
                  defaultValue={item?.star}
                  // Khi về sau thay đổi thì nó lấyy cái value
                  value={item?.star}
                  precision={0.5}
                  readOnly
                />
                <Typography>
                  <b>{getTimePast(new Date(item.updatedAt), t)}</b>
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            {user?._id === item?.user?._id && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                mt={1}
              >
                <Tooltip title={t('Edit')}>
                  <IconButton
                    sx={{
                      color: theme.palette.primary.main
                    }}
                    onClick={() => {
                      setOpenEdit({
                        open: true,
                        id: item._id
                      })
                    }}
                  >
                    <CustomIcon icon='mingcute:pencil-line' />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('Delete')}>
                  <IconButton
                    sx={{
                      color: theme.palette.primary.main
                    }}
                    onClick={() => {
                      setOpenDeleteReview({
                        open: true,
                        id: item._id
                      })
                    }}
                  >
                    <CustomIcon icon='material-symbols-light:delete-rounded' />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
        {/* Nội dung review */}
        <Box mt={1}>
          <Typography>{item?.content}</Typography>
        </Box>
      </StyleCard>
    </>
  )
}

export default CardReviewProduct
