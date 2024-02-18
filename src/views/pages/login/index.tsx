// **  Next
import { NextPage } from 'next'

// ** React
import { useState } from 'react'

// ** MUI
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  InputAdornment,
  Link,
  Typography
} from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import CustomIcon from 'src/components/Icon'

// ** React-Hook-Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { IconButton } from '@mui/material'

type TProps = {}

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().required('The field required!').matches(EMAIL_REG, 'The field is must email type'),
    password: yup
      .string()
      .required('The field required!')
      .matches(PASSWORD_REG, 'The password is contain character, special, number')
  })
  .required()

const LoginPage: NextPage<TProps> = () => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(loginSchema)
  })

  const handleOnSubmit = (data: { email: string; password: string }) => {
    console.log('checkk data form', { data })
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          {/* Email */}
          <Box sx={{ mt: 2 }}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  required
                  fullWidth
                  label='Email'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={Boolean(errors?.email)}
                  placeholder='Email'
                  helperText={errors?.email?.message}
                />
              )}
              // Khi đã khai báo name ở đây rồi không cần khai báo ở CustomTextField nữa
              name='email'
            />
            {/* {errors.email && <Typography sx={{ color: 'red' }}>{errors?.email?.message}</Typography>} */}
          </Box>
          {/* Password */}
          <Box sx={{ mt: 2 }}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  margin='normal'
                  required
                  fullWidth
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={Boolean(errors?.password)}
                  placeholder='Password'
                  helperText={errors?.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <CustomIcon icon='material-symbols:visibility-outline' />
                          ) : (
                            <CustomIcon icon='material-symbols:visibility-off-outline' />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
              name='password'
            />
            {/* {errors.password && <Typography sx={{ color: 'red' }}>{errors?.password.message}</Typography>} */}
          </Box>

          <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default LoginPage
