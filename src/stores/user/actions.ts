// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'
import { createUser, deleteMultipleUser, deleteUser, getAllUsers, updateUser } from 'src/services/user'

export const ServiceName = 'user'

// ** Get All Users
export const getAllUsersAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetUsers }) => {
    const response = await getAllUsers(data)
    return response
  }
)

// ** Create User
export const createUserAsync = createAsyncThunk(`${ServiceName}/create`, async (data: TParamsCreateUser) => {
  const response = await createUser(data)
  return response
})

// ** Update User
export const updateUserAsync = createAsyncThunk(`${ServiceName}/update`, async (data: TParamsEditUser) => {
  const response = await updateUser(data)
  return response
})

// ** Delete User
export const deleteUserAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deleteUser(id)
  return response
})

// ** Delete many user
export const deleteMultipleUserAsync = createAsyncThunk(
  `${ServiceName}/delete-many`,
  async (data: TParamsDeleteMultipleUser) => {
    const response = await deleteMultipleUser(data)
    return response
  }
)
