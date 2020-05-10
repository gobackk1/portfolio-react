import axios from '@/axios'
import ServerResponse from '@/interfaces/ServerResponse'
import { AuthReqParams } from '@/interfaces/AuthReqParams'
import { actionCreator, asyncActionCreator } from '@/actions'

const loginUrl = `${process.env.REACT_APP_API_URL}/login`
const usersUrl = `${process.env.REACT_APP_API_URL}/users`

export const login = asyncActionCreator<any, any, Error>(
  'LOGIN',
  async params => await axios.post(loginUrl, params)
)

export const register = asyncActionCreator<any, any, Error>(
  'REGISTER',
  async params => await axios.post(usersUrl, params)
)

export const logout = actionCreator('LOGOUT')
export const clearError = actionCreator('CLEAR_ERROR')
