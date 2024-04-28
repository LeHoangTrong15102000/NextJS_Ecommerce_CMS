// **  Next
import { NextPage } from 'next'

// ** React
import { Fragment, useEffect, useState } from 'react'

// ** MUI
import {
  Avatar,
  AvatarProps,
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  styled,
  Typography,
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
import { convertFileToBase64, formatNumberToLocale, handleToFullName, seperationFullName } from 'src/utils'

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
import { TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  role: string
  phoneNumber: string
  fullName: string
}

const StyleAvatar = styled(Avatar)<AvatarProps>(({}) => ({
  '.MuiAvatar-img': {
    objectFit: 'contain'
  }
}))

const MyCartPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  // const [user, setUser] = useState<UserDataType | null>(null)
  const [avatar, setAvatar] = useState('')
  // const [roleId, setRoleId] = useState('')
  const [optionCties, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)

  const { t, i18n } = useTranslation()

  // ** ContextApi
  const { setUser } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** theme
  const theme = useTheme()

  // Handle submit
  const handleSubmit = () => {
    return false
  }

  return (
    <>
      {loading && <Spinner />}
      <Box
        sx={{
          // height: '80vh',
          // width: '100%',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        {/* Grid tổng */}
        <Grid container>
          {/* Grid Table header as name , price , discount , count , ... */}
          <Grid container>
            <Grid item md={1}>
              Checkbox
            </Grid>
            <Grid item md={2}>
              {t('Image_product')}
            </Grid>
            <Grid item md={4}>
              <Typography>{t('Name_product')}</Typography>
            </Grid>
            <Grid item md={2}>
              {t('Price_original')}
            </Grid>
            <Grid item md={2}>
              {t('Price_discount')}
            </Grid>
            <Grid item md={1}>
              {t('Count')}
            </Grid>
          </Grid>

          {/* Grid Content Order Product */}
          <Grid
            container
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {orderItems.map((item: TItemOrderProduct) => {
              return (
                <Fragment key={item.product}>
                  <Grid item md={2}>
                    <StyleAvatar
                      sx={{
                        width: '150px',
                        height: '150px'
                      }}
                      src={item.image}
                    />
                  </Grid>

                  {/* Content Product as : name, price, price discount , ... */}
                  <Box>
                    <Typography sx={{ fontSize: '24px' }}>{item.name}</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      {item.discount > 0 && (
                        <Typography
                          variant='h6'
                          sx={{
                            color: theme.palette.error.main,
                            fontWeight: 'bold',
                            textDecoration: 'line-through',
                            fontSize: '16px'
                          }}
                        >
                          {`${formatNumberToLocale(item.price)} VND`}
                        </Typography>
                      )}
                      <Typography
                        variant='h4'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          fontSize: '20px'
                        }}
                      >
                        {item.discount > 0 ? (
                          <>{`${formatNumberToLocale((item.price * (100 - item.discount)) / 100)} VND`}</>
                        ) : (
                          <> {`${formatNumberToLocale(item.price)} VND`}</>
                        )}
                      </Typography>
                      {/* Discount percent */}
                      {item.discount > 0 && (
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
                            -{item.discount}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Fragment>
              )
            })}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default MyCartPage
