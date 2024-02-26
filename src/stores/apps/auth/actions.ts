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

// ** Add User
export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  try {
    const response = await registerAuth(data)
    return response
  } catch (error: any) {
    console.log('Check Error', error)
    return {
      data: null,
      message: error?.response.data?.message,
      typeError: error?.response.data?.typeError
    }
  }
})
