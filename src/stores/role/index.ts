// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { getAllRolesAsync } from './actions'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  roles: []
}

export const roleSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetInitialState: (state) => {
      state.isLoading = false
      state.isSuccess = true
      state.isError = false
      state.message = ''
      state.typeError = ''
    }
  },
  extraReducers: (builder) => {
    // ** Get All Roles
    builder.addCase(getAllRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      console.log('Check action all roles', { action })
      state.isLoading = false
      state.roles = []
    })
    builder.addCase(getAllRolesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.roles = []
    })
  }
})

export const { resetInitialState } = roleSlice.actions

export default roleSlice.reducer
