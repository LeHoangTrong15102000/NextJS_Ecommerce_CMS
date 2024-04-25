// **  Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import { Avatar, Box, Button, FormHelperText, Grid, InputLabel, useTheme } from '@mui/material'
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
import { convertFileToBase64, handleToFullName, seperationFullName } from 'src/utils'

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
            <Grid container>
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct.image}
                  alt='image_product'
                  width={0}
                  height={0}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
              <Grid item md={7}></Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailsProductPage
