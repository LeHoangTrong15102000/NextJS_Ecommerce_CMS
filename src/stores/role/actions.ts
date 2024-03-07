// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'
import { createRole, deleteRole, getAllRoles, updateRole } from 'src/services/role'

// ** Get All Roles
export const getAllRolesAsync = createAsyncThunk('role/get-all', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)
  return response
})

// ** Create Role
export const createRoleAsync = createAsyncThunk('role/create', async (data: TParamsCreateRole) => {
  const response = await createRole(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data.message,
    typeError: response?.response?.data.typeError
  }
})

// ** Update Role
export const updateRoleAsync = createAsyncThunk('role/update', async (data: TParamsEditRole) => {
  const response = await updateRole(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data.message,
    typeError: response?.response?.data.typeError
  }
})

// ** Delete Role
export const deleteRoleAsync = createAsyncThunk('role/delete', async (id: string) => {
  const response = await deleteRole(id)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data.message,
    typeError: response?.response?.data.typeError
  }
})
