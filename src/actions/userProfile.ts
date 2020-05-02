import axios, { auth } from '@/axios'
import { asyncActionCreator } from '@/actions'

const usersUrl = `${process.env.REACT_APP_API_URL}/users`

export const initProfile = asyncActionCreator<any, any, Error>(
  'INIT_PROFILE',
  async id => {
    const res = await axios.get(`${usersUrl}/${id}`, auth)
    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const updateProfile = asyncActionCreator<any, any, Error>(
  'UPDATE_PROFILE',
  async params => {
    const res = await axios.put(`${usersUrl}/${params.id}`, params, auth)
    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)
