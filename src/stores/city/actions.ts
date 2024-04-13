// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { TParamsCreateCity, TParamsDeleteMultipleCity, TParamsEditCity, TParamsGetCities } from 'src/types/city'
import { createCity, deleteCity, deleteMultipleCity, getAllCities, updateCity } from 'src/services/city'

export const ServiceName = 'city'

// ** Get All Users
export const getAllCitiesAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetCities }) => {
    const response = await getAllCities(data)
    return response
  }
)

// ** Create User
export const createCityAsync = createAsyncThunk(`${ServiceName}/create`, async (data: TParamsCreateCity) => {
  const response = await createCity(data)
  return response
})

// ** Update User
export const updateCityAsync = createAsyncThunk(`${ServiceName}/update`, async (data: TParamsEditCity) => {
  const response = await updateCity(data)
  return response
})

// ** Delete User
export const deleteCityAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deleteCity(id)
  return response
})

// ** Delete many user
export const deleteMultipleCityAsync = createAsyncThunk(
  `${ServiceName}/delete-many`,
  async (data: TParamsDeleteMultipleCity) => {
    const response = await deleteMultipleCity(data)
    return response
  }
)
