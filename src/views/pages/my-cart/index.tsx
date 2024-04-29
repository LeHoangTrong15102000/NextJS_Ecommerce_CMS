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
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  styled,
  Tooltip,
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
          padding: '40px',
          width: '100%',

          borderRadius: '15px'
        }}
      >
        {/* Name field order product table */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '8px',
            mb: '10px'
          }}
        >
          <Box
            sx={{
              width: 'calc(10% -220px)'
            }}
          >
            <Tooltip title={t('Select_all')}>
              <Checkbox />
            </Tooltip>
          </Box>
          <Typography
            sx={{
              width: '200px',
              marginLeft: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              fontWeight: 600
            }}
          >
            {t('Image_product')}
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexBasis: '30%',
              fontWeight: 600
            }}
          >
            {t('Name_product')}
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexBasis: '20%',
              fontWeight: 600
            }}
          >
            {t('Price_original')}
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexBasis: '20%',
              fontWeight: 600
            }}
          >
            {t('Price_discount')}
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexBasis: '10%',
              fontWeight: 600
            }}
          >
            {t('Amount_product')}
          </Typography>
          <Box
            sx={{
              flexBasis: '5%',
              display: 'flex'
            }}
          >
            <Tooltip title={t('Delete_all')}>
              <IconButton
                sx={{
                  color: theme.palette.primary.main
                }}
              >
                <CustomIcon fontSize={35} icon='material-symbols-light:delete-forever-sharp' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
        {/* Grid Content Order Product */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '10px',
            mt: '10px'
          }}
        >
          {orderItems.map((item: TItemOrderProduct, index: number) => {
            return (
              <Fragment key={item.product}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Box
                    sx={{
                      width: 'calc(15% - 150px)'
                    }}
                  >
                    <Checkbox />
                  </Box>
                  {/* Image Product */}
                  <StyleAvatar
                    sx={{
                      width: '150px',
                      height: '150px'
                    }}
                    src={item.image}
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
                        fontSize: '24px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        display: 'block',
                        mt: 2
                      }}
                    >
                      {item.name}
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
                    {item.discount > 0 && (
                      <Typography
                        variant='h6'
                        mt={2}
                        sx={{
                          color: theme.palette.error.main,
                          fontWeight: 'bold',
                          textDecoration: 'line-through',
                          fontSize: '20px'
                        }}
                      >
                        {`${formatNumberToLocale(item.price)} VND`}
                      </Typography>
                    )}
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
                    <Typography
                      variant='h4'
                      mt={2}
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
                  <Box
                    sx={{
                      flexBasis: '10%',
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <IconButton
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white
                      }}
                      onClick={() => {}}
                    >
                      <CustomIcon icon='ic:sharp-minus' />
                    </IconButton>
                    <CustomTextField
                      size='small'
                      value={item.amount}
                      sx={{
                        // '.MuiInputBase-root.MuiFilledInput-root': {
                        //   borderRadius: '0px',
                        //   borderTop: 'none',
                        //   borderRight: 'none'
                        // },
                        '& .MuiInputBase-input.MuiFilledInput-input': {
                          width: '20px'
                        },
                        '& .MuiInputBase-root.MuiInputBase-input': {
                          width: '20px !important',
                          color: 'blue'
                        }
                      }}
                    />
                    <IconButton
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white
                      }}
                      onClick={() => {}}
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
                    >
                      <CustomIcon fontSize={35} icon='material-symbols-light:delete-forever-sharp' />
                    </IconButton>
                  </Box>
                </Box>
                {/* Khi mà index > 0 và thằng cuối cùng sẽ không hiển thị */}
                {index !== orderItems.length - 1 && <Divider />}
              </Fragment>
            )
          })}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          mt: 4
        }}
      >
        <Button
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontWeight: 'bold'
          }}
        >
          <CustomIcon icon='icon-park-outline:shopping-bag-one' style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </>
  )
}

export default MyCartPage
