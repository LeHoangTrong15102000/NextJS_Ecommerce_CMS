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
  return response
})

// ** Update Role
export const updateRoleAsync = createAsyncThunk('role/update', async (data: TParamsEditRole) => {
  const response = await updateRole(data)
  return response
})

// ** Delete Role
export const deleteRoleAsync = createAsyncThunk('role/delete', async (id: string) => {
  const response = await deleteRole(id)
  return response
})
