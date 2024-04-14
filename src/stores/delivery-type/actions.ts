// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'
import { createUser, deleteMultipleUser, deleteUser, getAllUsers, updateUser } from 'src/services/user'
import {
  TParamsCreateDeliveryType,
  TParamsDeleteMultipleDeliveryType,
  TParamsEditDeliveryType,
  TParamsGetDeliveryTypes
} from 'src/types/delivery-type'
import {
  createDeliveryType,
  deleteDeliveryType,
  deleteMultipleDeliveryType,
  getAllDeliveryTypes,
  updateDeliveryType
} from 'src/services/delivery-type'

export const ServiceName = 'delivery-type'

// ** Get All Users
export const getAllDeliveryTypesAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetDeliveryTypes }) => {
    const response = await getAllDeliveryTypes(data)
    return response
  }
)

// ** Create User
export const createDeliveryTypeAsync = createAsyncThunk(
  `${ServiceName}/create`,
  async (data: TParamsCreateDeliveryType) => {
    const response = await createDeliveryType(data)
    return response
  }
)

// ** Update User
export const updateDeliveryTypeAsync = createAsyncThunk(
  `${ServiceName}/update`,
  async (data: TParamsEditDeliveryType) => {
    const response = await updateDeliveryType(data)
    return response
  }
)

// ** Delete User
export const deleteDeliveryTypeAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deleteDeliveryType(id)
  return response
})

// ** Delete many user
export const deleteMultipleDeliveryTypeAsync = createAsyncThunk(
  `${ServiceName}/delete-many`,
  async (data: TParamsDeleteMultipleDeliveryType) => {
    const response = await deleteMultipleDeliveryType(data)
    return response
  }
)
