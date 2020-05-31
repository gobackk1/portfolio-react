import axios from '@/axios'
import { actionCreator, asyncActionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'

const loginUrl = `${process.env.REACT_APP_API_URL}/login`
const usersUrl = `${process.env.REACT_APP_API_URL}/users`
const options = { withCredentials: true }

export const login = asyncActionCreator<
  { email: string; password: string },
  { id: number; name: string; token: string },
  CustomError
>('LOGIN', async params => {
  const res = await axios.post(loginUrl, params, options)
  console.log(res, 'LOGIN')
  return res.data
})

export const register = asyncActionCreator<
  { email: string; password: string; name: string },
  { id: number; name: string; token: string },
  CustomError
>('REGISTER', async params => {
  const res = await axios.post(usersUrl, params, options)
  console.log(res, 'REGISTER')
  return res.data
})

export const logout = actionCreator('LOGOUT')
export const clearError = actionCreator('CLEAR_ERROR')
