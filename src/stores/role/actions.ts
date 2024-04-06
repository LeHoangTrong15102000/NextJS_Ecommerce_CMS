// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Types
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

// ** Services
import { createRole, deleteRole, getAllRoles, updateRole } from 'src/services/role'

//
export const ServiceName = 'role'

// ** Get All Roles
export const getAllRolesAsync = createAsyncThunk(
  `${ServiceName}/get-all`,
  async (data: { params: TParamsGetRoles }) => {
    const response = await getAllRoles(data)
    return response
  }
)

// ** Create Role
export const createRoleAsync = createAsyncThunk(`${ServiceName}/create`, async (data: TParamsCreateRole) => {
  const response = await createRole(data)
  return response
})

// ** Update Role
export const updateRoleAsync = createAsyncThunk(`${ServiceName}/update`, async (data: TParamsEditRole) => {
  const response = await updateRole(data)
  return response
})

// ** Delete Role
export const deleteRoleAsync = createAsyncThunk(`${ServiceName}/delete`, async (id: string) => {
  const response = await deleteRole(id)
  return response
})
