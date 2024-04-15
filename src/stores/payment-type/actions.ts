// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'
import { createUser, deleteMultipleUser, deleteUser, getAllUsers, updateUser } from 'src/services/user'
import {
  TParamsCreatePaymentType,
  TParamsDeleteMultiplePaymentType,
  TParamsEditPaymentType,
  TParamsGetPaymentTypes
} from 'src/types/payment-type'
import {
  createPaymentType,
  deleteMultiplePaymentType,
  deletePaymentType,
  getAllPaymentTypes,
  updatePaymentType
} from 'src/services/payment-type'

export const ServiceName = 'payment-type'

// ** Get All Users
export const getAllPaymentTypesAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetPaymentTypes }) => {
    const response = await getAllPaymentTypes(data)
    return response
  }
)

// ** Create User
export const createPaymentTypeAsync = createAsyncThunk(
  `${ServiceName}/create`,
  async (data: TParamsCreatePaymentType) => {
    const response = await createPaymentType(data)
    return response
  }
)

// ** Update User
export const updatePaymentTypeAsync = createAsyncThunk(
  `${ServiceName}/update`,
  async (data: TParamsEditPaymentType) => {
    const response = await updatePaymentType(data)
    return response
  }
)

// ** Delete User
export const deletePaymentTypeAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deletePaymentType(id)
  return response
})

// ** Delete many user
export const deleteMultiplePaymentTypeAsync = createAsyncThunk(
  `${ServiceName}/delete-many`,
  async (data: TParamsDeleteMultiplePaymentType) => {
    const response = await deleteMultiplePaymentType(data)
    return response
  }
)
