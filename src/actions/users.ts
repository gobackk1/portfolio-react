import axios, { auth } from '@/axios'
import { asyncActionCreator } from '@/actions'

const usersUrl = `${process.env.REACT_APP_API_URL}/users`

export const readUsers = asyncActionCreator<any, any, Error>(
  'READ_USERS',
  async () => {
    const res = await axios.get(usersUrl, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const searchUsers = asyncActionCreator<any, any, Error>(
  'SEARCH_USERS',
  async keyword => {
    const res = await axios.post(`${usersUrl}/search`, { keyword }, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)
