import { yupResolver } from '@hookform/resolvers/yup'
import { Button, IconButton, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import { getDetailsRole } from 'src/services/role'
import { AppDispatch } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'
import * as yup from 'yup'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
}

type TDefaultValue = {
  name: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  // ** Props
  const { open, onClose, idRole } = props

  // ** State
  const [loading, setLoading] = useState(false)

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Theme
  const theme = useTheme()

  // ** React hook form
  const roleSchema = yup.object().shape({
    name: yup.string().required(t('required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(roleSchema)
  })

  const handleOnSubmit = (data: { name: string }) => {
    console.log('checkk data form', { data })
    if (!Object.keys(errors).length) {
      if (idRole) {
        // update
        dispatch(updateRoleAsync({ name: data?.name, id: idRole }))
      } else {
        // create
        dispatch(createRoleAsync({ name: data?.name }))
      }
    }
  }

  // Fetch
  const fetchDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then((res) => {
        setLoading(false)
        console.log('Checkk res details role', { res })
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
        name: ''
      })
    } else if (idRole) {
      fetchDetailsRole(idRole)
    }
  }, [open, idRole])

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
          minWidth={{ md: '400px', xs: '80vw' }}
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
              {idRole ? t('Edit_role') : t('Create_role')}
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
            {/* Email */}
            <Box
              sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                padding: '20px',
                borderRadius: '15px'
              }}
            >
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    focused={open ? true : false}
                    label={t('Name')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.name)}
                    placeholder={t('Enter_name')}
                    helperText={errors?.name?.message}
                  />
                )}
                // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
                name='name'
              />
              {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 6, mb: 2 }}>
                {!idRole ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
