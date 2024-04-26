// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import { Avatar, Box, Button, FormHelperText, Grid, InputLabel, Rating, Typography, useTheme } from '@mui/material'
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
import { getDetailsProductPublic, getDetailsProductPublicBySlug } from 'src/services/product'
import { useRouter } from 'next/router'
import { TProduct } from 'src/types/product'
import Image from 'next/image'
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

const DetailsProductPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct | any>({})
  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()
  const productId = router.query?.productId as string
  console.log('Checkkk productId', { productId })

  // ** theme
  const theme = useTheme()

  // Fetch Get me
  const fetchGetDetailsProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublicBySlug(slug)
      .then(async (response) => {
        setLoading(false)
        const data = response?.data
        console.log('Checkkkk data', { response })
        if (data) {
          setDataProduct(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (productId) {
      fetchGetDetailsProduct(productId)
    }
  }, [productId])

  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            <Grid container spacing={8}>
              {/* Image */}
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct.image}
                  alt='image_product'
                  width={0}
                  height={0}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    borderRadius: '15px'
                  }}
                />
              </Grid>
              {/* Infomation product */}
              <Grid item md={7}>
                <Box>
                  {/* Name */}
                  <Typography
                    variant='h5'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      '-webkitLineClamp': '2',
                      '-webkitBoxOrient': 'vertical'
                    }}
                  >
                    {dataProduct.name}
                  </Typography>
                  {/* Rating , ,total review, sold */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2
                    }}
                  >
                    {/* Rating */}
                    {dataProduct?.averageRating > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            '-webkitLineClamp': '2',
                            '-webkitBoxOrient': 'vertical',
                            textDecoration: 'underline',
                            fontSize: '16px'
                          }}
                        >
                          {dataProduct.averageRating}
                        </Typography>
                        <Rating
                          name='read-only'
                          sx={{
                            fontSize: '16px'
                          }}
                          defaultValue={dataProduct.averageRating}
                          precision={0.5}
                          readOnly
                        />
                      </Box>
                    )}
                    {/* Total review */}
                    <Typography
                      sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {!!dataProduct.totalReviews ? (
                        <span>
                          <b>{dataProduct.totalReviews}</b>
                          {t('Review')}
                        </span>
                      ) : (
                        <span>{t('Not_review')}</span>
                      )}
                    </Typography>
                    {/* Sold */}
                    {dataProduct.sold && (
                      <Typography variant='body2' color='text.secondary'>
                        <>{t('Sold_product', { sold: dataProduct.sold })}</>
                      </Typography>
                    )}
                  </Box>
                </Box>
                {/* Price, discount Price, discount percent */}
                <Box
                  sx={{
                    display: 'flex',
                    alingItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  {dataProduct.discount > 0 && (
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 'bold',
                        textDecoration: 'line-through',
                        fontSize: '18px'
                      }}
                    >
                      {`${formatNumberToLocale(dataProduct.price)} VND`}
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '24px'
                    }}
                  >
                    {dataProduct.discount > 0 ? (
                      <>{`${formatNumberToLocale((dataProduct.price * (100 - dataProduct.discount)) / 100)} VND`}</>
                    ) : (
                      <> {`${formatNumberToLocale(dataProduct.price)} VND`}</>
                    )}
                  </Typography>
                  {dataProduct.discount > 0 && (
                    <Box
                      sx={{
                        backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                        width: '25px',
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
                          fontSize: '10px'
                        }}
                      >
                        {dataProduct.discount}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/*Button add-to-cart and buy-now */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0 12px 10px',
                    mt: 4
                  }}
                >
                  {/* Button add to cart */}
                  <Button
                    variant='outlined'
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    <CustomIcon icon='fa6-solid:cart-plus' style={{ position: 'relative', top: '-2px' }} />
                    {t('Add_to_card')}
                  </Button>
                  {/* Buy now button */}
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
                    <CustomIcon
                      icon='icon-park-outline:shopping-bag-one'
                      style={{ position: 'relative', top: '-2px' }}
                    />
                    {t('Buy_now')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4,
            mt: 6
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            {/* Tiêu đề Description product */}
            <Box
              sx={{
                display: 'flex',
                alingItems: 'center',
                gap: 2,
                mt: 2,
                backgroundColor: theme.palette.customColors.bodyBg,
                padding: '8px',
                borderRadius: '8px'
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                {t('Description_product')}
              </Typography>
            </Box>
            {/* Nội dung description product */}
            <Box
              sx={{
                mt: 4
              }}
              dangerouslySetInnerHTML={{
                __html: dataProduct.description
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailsProductPage
