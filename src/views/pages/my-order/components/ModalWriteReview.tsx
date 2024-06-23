import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, InputAdornment, Rating, Switch } from '@mui/material'
import { Avatar, Button, FormHelperText, Grid, IconButton, InputLabel, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { convertToRaw, EditorState } from 'draft-js'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'

// ** Service

// ** Redux
import { AppDispatch } from 'src/stores'

import * as yup from 'yup'

import { addReviewProductAsync } from 'src/stores/review-product/actions'
import CustomTextArea from 'src/components/text-area'

interface TModalWriteReview {
  open: boolean
  onClose: () => void
  productId?: string
  userId?: string
}

type TDefaultValue = {
  content: string
  star: number
}

const ModalWriteReview = (props: TModalWriteReview) => {
  // ** Props
  const { open, onClose, productId, userId } = props

  // ** State
  const [loading, setLoading] = useState(false)

  // ** i18next
  const { t, i18n } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const orderProductSchema = yup.object().shape({
    star: yup.number().required(t('Required_field')),
    content: yup.string().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    content: '',
    star: 0
  }

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(orderProductSchema)
  })

  const handleOnSubmit = (data: any) => {
    // console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      if (productId && userId) {
        dispatch(
          addReviewProductAsync({
            content: data?.content,
            star: 3.5,
            product: productId,
            user: userId
          })
        )
      }
    }
  }

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: theme.palette.customColors.bodyBg,
            padding: '30px 20px',
            borderRadius: '15px'
          }}
          minWidth={{ md: '500px', xs: '80vw' }}
          maxWidth={{ md: '50vw', xs: '80vw' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              paddingBottom: '20px'
            }}
          >
            <Typography
              variant='h4'
              sx={{
                fontWeight: 600
              }}
            >
              {t('Edit_order_product')}
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                top: '-6px',
                right: '-10px'
              }}
              onClick={onClose}
            >
              <CustomIcon icon='clarity:close-line' fontSize={'30px'} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
            >
              {/* Grid tổng chung của 2 thằng right và left */}
              <Grid container spacing={5}>
                {/* Grid Left */}
                <Grid container item md={12} xs={12}>
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    {/* Grid Container */}
                    <Grid container spacing={4}>
                      {/* star field */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Rating
                                name='half-rating'
                                onChange={(e: any) => {
                                  onChange(+e.target.value)
                                }}
                                // defaultValue={2.5}
                                value={value ? +value : 0}
                                precision={0.5}
                                size='large'
                              />
                            </Box>
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='star'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                      {/* review field */}
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextArea
                              required
                              label={t('Content_review')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.content)}
                              placeholder={t('Enter_content_review')}
                              helperText={errors?.content?.message}
                              minRows={3}
                              maxRows={3}
                            />
                          )}
                          // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                          name='content'
                        />
                        {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 6, mb: 2 }}>
                {t('Confirm_review')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default ModalWriteReview
