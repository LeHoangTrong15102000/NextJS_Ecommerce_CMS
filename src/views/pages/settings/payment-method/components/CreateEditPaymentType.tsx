import { yupResolver } from '@hookform/resolvers/yup'
import { Button, FormHelperText, Grid, IconButton, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import { PAYMENT_TYPES } from 'src/configs/payment'
import { getDetailsPaymentType } from 'src/services/payment-type'

// ** Redux
import { AppDispatch } from 'src/stores'
import { createPaymentTypeAsync, updatePaymentTypeAsync } from 'src/stores/payment-type/actions'

import * as yup from 'yup'

interface TCreateEditPaymentType {
  open: boolean
  onClose: () => void
  idPaymentType?: string
}

type TDefaultValue = {
  name: string
  type: string
}

const CreateEditPaymentType = (props: TCreateEditPaymentType) => {
  // ** Props
  const { open, onClose, idPaymentType } = props

  // ** Payment Type
  const ObjectPaymentTypes = PAYMENT_TYPES()

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
    name: yup.string().required(t('Required_field')),
    type: yup.string().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: '',
    type: ''
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
            name: data.name,
            type: data.type
          })
        )
      } else {
        // create
        dispatch(
          createPaymentTypeAsync({
            name: data.name,
            type: data.type
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
            name: data?.name,
            type: data?.type
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

  // Chỉ chạy lại một lần khi mà render mà thôi
  // const memoOptionsPaymentType = useMemo(() => {
  //   // Lúc này chúng ta muốn convert nó sang dạng label và valuee
  //   return Object.values(PAYMENT_TYPES).map((item) => )
  // }, [])

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
              {idPaymentType ? t('Edit_payment_type') : t('Create_payment_type')}
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
              <Grid container item md={12} xs={12}>
                {/* Name */}
                <Grid item md={12} xs={12} mb={2}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        required
                        fullWidth
                        label={t('Name_payment_type')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={Boolean(errors?.name)}
                        placeholder={t('Enter_name_payment_type')}
                        helperText={errors?.name?.message}
                      />
                    )}
                    // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                    name='name'
                  />
                  {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
                </Grid>
                {/* Type field */}
                <Grid item md={12} xs={12}>
                  <Controller
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <div style={{ width: '100%' }}>
                          <label
                            style={{
                              fontSize: '13px',
                              marginBottom: '5px',
                              display: 'block',
                              color: errors?.type
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {t('Type_payment')}{' '}
                            <span
                              style={{
                                color: errors?.type
                                  ? theme.palette.error.main
                                  : `rgba(${theme.palette.customColors.main}, 0.42)`
                              }}
                            >
                              *
                            </span>
                          </label>
                          <CustomSelect
                            required
                            onChange={onChange}
                            fullWidth
                            value={value}
                            options={Object.values(ObjectPaymentTypes)}
                            error={Boolean(errors?.type)}
                            onBlur={onBlur}
                            placeholder={t('Select')}
                          />
                          {/* Dùng FormHelperText để hiển thị lỗi ra bên ngoài */}
                          {errors?.type?.message && (
                            <FormHelperText
                              sx={{
                                color: errors?.type ? theme.palette.error.main : theme.palette.customColors.main,
                                fontSize: '0.9375rem'
                              }}
                            >
                              {errors?.type?.message}
                            </FormHelperText>
                          )}
                        </div>
                      )
                    }}
                    // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                    name='type'
                  />
                  {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
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
