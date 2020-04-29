import actionCreatorFactory from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'
import axios from '@/axios'
import ServerResponse from '@/interfaces/ServerResponse'
import { AuthReqParams } from '@/interfaces/AuthReqParams'

const actionCreator = actionCreatorFactory()
const asyncCreator = asyncFactory(actionCreator)

export const login = asyncCreator<AuthReqParams, ServerResponse, Error>(
  'LOGIN',
  async params => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
      email: params.email,
      password: params.password
    })

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const register = asyncCreator<AuthReqParams, ServerResponse, Error>(
  'REGISTER',
  async params => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
      name: params.name,
      email: params.email,
      password: params.password
    })

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const logout = actionCreator('LOGOUT')
