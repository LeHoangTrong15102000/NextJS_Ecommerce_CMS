// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  createCityAsync,
  deleteMultipleCityAsync,
  deleteCityAsync,
  getAllCitiesAsync,
  ServiceName,
  updateCityAsync
} from './actions'

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
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  cities: {
    data: [],
    total: 0 // số lượng record có trong role của chúng ta, để chúng ta biết số lượng record để mà còn phân trang ở đây
  }
}

export const citySlice = createSlice({
  name: ServiceName,
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
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.messageErrorMultipleDelete = ''
    }
  },
  extraReducers: (builder) => {
    // ** Get All Roles
    builder.addCase(getAllCitiesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllCitiesAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.cities.data = action.payload?.data?.cities || []
      state.cities.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllCitiesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.cities.data = []
      state.cities.total = 0
    })

    // ** Get create users
    builder.addCase(createCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createCityAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // Do thằng typescript nó check type của thằng action này có đúng hay không
    builder.addCase(createCityAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** Get update users
    builder.addCase(updateCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateCityAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateCityAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete User
    builder.addCase(deleteCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteCityAsync.fulfilled, (state, action) => {
      // console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteCityAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete multiple users
    builder.addCase(deleteMultipleCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleCityAsync.fulfilled, (state, action) => {
      console.log('Check action all roles', { action })
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action.payload?.status
      state.isErrorMultipleDelete = !action.payload?.status
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteMultipleCityAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = true
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = citySlice.actions

export default citySlice.reducer
