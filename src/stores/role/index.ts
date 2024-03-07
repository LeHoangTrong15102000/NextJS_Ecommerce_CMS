// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { createRoleAsync, deleteRoleAsync, getAllRolesAsync, updateRoleAsync } from './actions'

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
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  roles: {
    data: [],
    total: 0 // số lượng record có trong role của chúng ta, để chúng ta biết số lượng record để mà còn phân trang ở đây
  }
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
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.messageErrorCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageErrorDelete = ''
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
      state.roles.data = action.payload.data.roles
      state.roles.total = action.payload.data.totalCount
    })
    builder.addCase(getAllRolesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.roles.data = []
      state.roles.total = 0
    })

    // ** Get create Roles
    builder.addCase(createRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createRoleAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // Do thằng typescript nó check type của thằng action này có đúng hay không
    builder.addCase(createRoleAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Get update Roles
    builder.addCase(updateRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateRoleAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data._id
      state.isErrorCreateEdit = !action.payload?.data._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateRoleAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Get delete Roles
    builder.addCase(deleteRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteRoleAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data._id
      state.isErrorCreateEdit = !action.payload?.data._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteRoleAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload.data.message
      state.typeError = action.payload.data.typeError
    })
  }
})

export const { resetInitialState } = roleSlice.actions

export default roleSlice.reducer
