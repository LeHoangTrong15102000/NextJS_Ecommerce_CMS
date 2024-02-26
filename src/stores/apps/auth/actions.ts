// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'

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
