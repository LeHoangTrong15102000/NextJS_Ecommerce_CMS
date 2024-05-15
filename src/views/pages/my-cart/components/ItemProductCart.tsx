import { Avatar, AvatarProps, Box, Checkbox, Divider, IconButton, styled, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Component
import CustomIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'
import { getProductCartFromLocal, setProductCartToLocal } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { getDetailsProduct } from 'src/services/product'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

import { TItemOrderProduct } from 'src/types/order-product'
import { cloneDeep, convertUpdateProductToCart, formatNumberToLocale, isExpireDiscountDate } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

interface TProps {
  item: TItemOrderProduct
  index: number
  selectedRows: string[]
  handleChangeCheckbox: (value: string) => void
}

interface TItemOrderProductState extends TItemOrderProduct {
  countInStock?: number
}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const ItemProductCart = ({ item, index, selectedRows, handleChangeCheckbox }: TProps) => {
  // ** State
  const [itemState, setItemState] = useState<TItemOrderProductState>(item)

  // ** Theme
  const theme = useTheme()

  // ** useAuth
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // Fetch detail product from item.product
  const fetchDetailsProduct = async (idProduct: string) => {
    const res = await getDetailsProduct(idProduct)
    const data = res?.data

    const discountItem = isExpireDiscountDate(data.discountStartDate, data.discountEndDate) ? item.discount : 0

    // Sẽ đưa thêm thằng countInStock vào để số lượng trong kho là mới nhất khi mà callApi getDetailsProduct
    if (data) {
      // cập nhật lại thông tin lại vào item
      setItemState({
        name: data.name,
        amount: item.amount,
        image: data.image,
        price: data.price,
        discount: discountItem,
        product: idProduct,
        slug: data.slug,
        countInStock: data.countInStock
      })
    }
    console.log('Check res >>>', { res })
  }

  // Handle  change amount cart
  const handleChangeAmountCart = (item: TItemOrderProduct, amount: number) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: amount,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug
    })
    // Tại vì chúng ta biết rằng cái trang này của chúng ta cũng đã đăng nhập rồi nhưng mà chúng ta vẫn check cho chắc
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      // giữ lại giá trị của các tài khoản khác, thay đổi listOrderItems của thằng user đang thưc hiện
      setProductCartToLocal({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  // Handle Delete Product Cart
  const handleDeleteProductCart = (productId: string) => {
    const productCart = getProductCartFromLocal()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItems = cloneDeep(orderItems) // Tạo ra một cloneOrderItems
    // Filter cái orderItems (Cái nào xoá thì bỏ đi)
    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => item.product !== productId)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setProductCartToLocal({ ...parseData, [user?._id]: filteredItems })
    }
  }

  useEffect(() => {
    if (item.product) {
      fetchDetailsProduct(item.product)
    }
  }, [item.product])

  useEffect(() => {
    setItemState((prev) => ({ ...prev, amount: item.amount }))
  }, [item.amount])

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Box
          sx={{
            width: 'calc(15% - 120px)'
          }}
        >
          <Checkbox
            // lúc này nếu mà những productId của những sản phẩm đều nằm trong selectedRows khi mà người dùng nhấn vào button checkAll
            disabled={!itemState.countInStock}
            checked={selectedRows.includes(itemState.product)}
            value={itemState.product}
            onChange={(e) => {
              // Lúc này value sẽ là idProduct của sản phẩm
              handleChangeCheckbox(e.target.value)
            }}
          />
        </Box>
        {/* Image Product */}
        <StyleAvatar
          sx={{
            width: '120px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          src={itemState.image}
        />

        {/* Name product */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexBasis: '30%',
            maxWidth: '100%'
          }}
        >
          <Typography
            sx={{
              fontSize: '20px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              display: 'block',
              mt: 2
            }}
          >
            <Link href={`/product/${itemState.slug}`}>{itemState.name}</Link>
          </Typography>
        </Box>
        {/* Price Original */}

        <Box
          sx={{
            flexBasis: '20%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant='h6'
            mt={2}
            sx={{
              color: itemState.discount > 0 ? theme.palette.error.main : theme.palette.primary.main,
              fontWeight: 'bold',
              textDecoration: itemState.discount ? 'line-through' : 'normal',
              fontSize: '16px'
            }}
          >
            {`${formatNumberToLocale(itemState.price)} VND`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexBasis: '20%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          {itemState.discount > 0 && (
            <Typography
              variant='h4'
              mt={2}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                fontSize: '17px'
              }}
            >
              {`${formatNumberToLocale((itemState.price * (100 - itemState.discount)) / 100)} VND`}
            </Typography>
          )}
          {/* Discount percent */}
          {itemState.discount > 0 && (
            <Box
              sx={{
                backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                width: '32px',
                height: '14px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '2px'
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontSize: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                -{itemState.discount}%
              </Typography>
            </Box>
          )}
        </Box>
        {/* Button Increase Decrease */}
        <Box
          sx={{
            flexBasis: '12%',
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <IconButton
            disabled={!itemState?.countInStock}
            onClick={() => handleChangeAmountCart(itemState, -1)}
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white
            }}
          >
            <CustomIcon icon='ic:sharp-minus' />
          </IconButton>
          <CustomTextField
            type='number'
            size='small'
            value={itemState.amount}
            disabled={!itemState?.countInStock}
            // onChange={(e) => {
            //   handleChangeAmountCart(item, +e.target.value)
            // }}
            inputProps={{
              inputMode: 'numeric',
              min: 1
              // max: item.countInStock
            }}
            // style={{
            //   WebkitAppearance: 'none',
            //   appearance: 'none',
            //   MozAppearance: 'none'
            // }}
            sx={{
              // '.MuiInputBase-root.MuiFilledInput-root': {
              //   borderRadius: '0px',
              //   borderTop: 'none',
              //   borderRight: 'none'
              // },
              '.MuiInputBase-input.MuiFilledInput-input': {
                width: '30px'
              },
              '& .MuiInputBase-root.MuiInputBase-input': {
                width: '20px !important',
                color: 'blue'
              }
            }}
          />
          <IconButton
            disabled={!itemState?.countInStock}
            onClick={() => handleChangeAmountCart(itemState, 1)}
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white
            }}
          >
            <CustomIcon icon='ic:sharp-plus' />
          </IconButton>
        </Box>
        {/* Xoá */}
        <Box
          sx={{
            flexBasis: '5%',
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <IconButton
            sx={{
              color: theme.palette.primary.main
            }}
            onClick={() => handleDeleteProductCart(itemState.product)}
          >
            <CustomIcon fontSize={35} icon='material-symbols-light:delete-outline-sharp' />
          </IconButton>
        </Box>
      </Box>
      {/* Khi mà index > 0 và thằng cuối cùng sẽ không hiển thị */}
      {index !== orderItems.length - 1 && <Divider />}
    </Box>
  )
}

export default ItemProductCart
