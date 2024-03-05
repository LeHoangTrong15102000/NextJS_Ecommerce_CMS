// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { changePasswordMe, registerAuth, updateMeAuth } from 'src/services/auth'
import { TChangePassword } from 'src/types/auth'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Regisater User
// Khỏi bọc try catch ở đây cũng được
export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)
  console.log('Checkk Response >>>', response)
  if (response?.data) {
    return response
  }
  return {
    data: null,
    message: response?.response.data?.message,
    typeError: response?.response.data?.typeError
  }
})

export const updateMeAuthAsync = createAsyncThunk('auth/update-me', async (data: any) => {
  const response = await updateMeAuth(data)
  console.log('Checkk Response >>>', response)
  if (response?.data) {
    return response
  }
  return {
    data: null,
    message: response?.response.data?.message,
    typeError: response?.response.data?.typeError
  }
})

export const changePasswordMeAsync = createAsyncThunk('auth/change-password', async (data: TChangePassword) => {
  const response = await changePasswordMe(data)

  if (response?.status === 'Success') {
    return { ...response, data: 1 }
  }
  return {
    data: null,
    message: response?.response.data?.message,
    typeError: response?.response.data?.typeError
  }
})
