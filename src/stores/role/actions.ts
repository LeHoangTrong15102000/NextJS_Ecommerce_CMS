// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios
import axios from 'axios'
import { registerAuth } from 'src/services/auth'
import { TParamsGetRoles } from 'src/types/role'
import { getAllRoles } from 'src/services/role'

// ** Get All Roles
export const getAllRolesAsync = createAsyncThunk('role/get-all', async (params: TParamsGetRoles) => {
  const response = await getAllRoles(params)
  return response
})
