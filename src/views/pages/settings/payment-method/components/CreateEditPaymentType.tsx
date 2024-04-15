import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, IconButton, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import { getDetailsCity } from 'src/services/city'
import { getDetailsDeliveryType } from 'src/services/delivery-type'
import { getDetailsPaymentType } from 'src/services/payment-type'

// ** Redux
import { AppDispatch } from 'src/stores'
import { createCityAsync, updateCityAsync } from 'src/stores/city/actions'
import { createDeliveryTypeAsync, updateDeliveryTypeAsync } from 'src/stores/delivery-type/actions'
import { createPaymentTypeAsync, updatePaymentTypeAsync } from 'src/stores/payment-type/actions'

import * as yup from 'yup'

interface TCreateEditPaymentType {
  open: boolean
  onClose: () => void
  idPaymentType?: string
}

type TDefaultValue = {
  name: string
  // price: number
}

const CreateEditPaymentType = (props: TCreateEditPaymentType) => {
  // ** Props
  const { open, onClose, idPaymentType } = props

  // ** State
  const [loading, setLoading] = useState(false)
  // const [avatar, setAvatar] = useState('')
  // const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  // const [isDisabledRole, setIsDisabledRole] = useState(false)
  // const [showPassword, setShowPassword] = useState(false)

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const userSchema = yup.object().shape({
    name: yup.string().required(t('Required_field'))
    // price: yup.number().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: ''
    // price: 0
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(userSchema)
  })

  const handleOnSubmit = (data: TDefaultValue) => {
    if (!Object.keys(errors).length) {
      if (idPaymentType) {
        // update
        dispatch(
          updatePaymentTypeAsync({
            id: idPaymentType,
            name: data.name
            // price: data.price
          })
        )
      } else {
        // create
        dispatch(
          createPaymentTypeAsync({
            name: data.name
            // price: data.price
          })
        )
      }
    }
  }

  // handleToFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
  // Fetch
  const fetchDetailsPaymentType = async (id: string) => {
    setLoading(true)
    await getDetailsPaymentType(id)
      .then((res) => {
        setLoading(false)
        const data = res.data
        if (data) {
          reset({
            name: data?.name
          })
        }
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
    } else if (idPaymentType && open) {
      fetchDetailsPaymentType(idPaymentType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idPaymentType])

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
              {idPaymentType ? t('Edit_delivery_type') : t('Create_delivery_type')}
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
              {/* Grid Right */}
              <Grid container item md={12} xs={12} spacing={4}>
                {/* Name */}
                <Grid item md={12} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        required
                        fullWidth
                        label={t('Name_delivery_type')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={Boolean(errors?.name)}
                        placeholder={t('Enter_name_delivery_type')}
                        helperText={errors?.name?.message}
                      />
                    )}
                    // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                    name='name'
                  />
                  {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                </Grid>
                {/* Price field */}
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 6, mb: 2 }}>
                {!idPaymentType ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditPaymentType
