import { yupResolver } from '@hookform/resolvers/yup'
import { Button, IconButton, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'
import { AppDispatch } from 'src/stores'
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
  const { open, onClose, idRole } = props

  // ** i18next
  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const theme = useTheme()

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
      //
    }
  }

  return (
    <CustomModal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '20px',
          borderRadius: '15px'
        }}
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
            {idRole ? t('Chỉnh sửa nhóm vai trò') : t('Tạo nhóm vai trò')}
          </Typography>
          <IconButton
            sx={{
              position: 'absolute',
              top: '-6px',
              right: '-10px'
            }}
            onClick={() => {}}
          >
            <CustomIcon icon='clarity:close-line' fontSize={'30px'} />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          {/* Email */}
          <Box sx={{ mt: 1, width: '300px', marginBottom: '-11px' }} width={{ md: '300px', xs: '200px' }}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  required
                  fullWidth
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
  )
}

export default CreateEditRole
