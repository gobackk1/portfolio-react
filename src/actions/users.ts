import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'
import IUser from '@/interfaces/IUser'

interface IUsersResponse {
  users: IUser[]
  not_found: boolean
}

interface IPagerRequest {
  page: number
  per: number
  keyword?: string
}

const usersUrl = `${process.env.REACT_APP_API_URL}/users`
const relationshipUrl: string = `${process.env.REACT_APP_API_URL}/relationships`
export const resetUsersState = actionCreator('RESET_USERS_STATE')
export const resetSearchUsersState = actionCreator('RESET_SEARCH_USERS_STATE')
export const setUser = actionCreator<any>('SET_USER')

export const readUsers = asyncActionCreator<
  IPagerRequest,
  IUsersResponse,
  CustomError
>('READ_USERS', async ({ page, per }) => {
  const res = await axios.get(`${usersUrl}?page=${page}&per=${per}`, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  if (!res.data.users.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  return res.data
})

export const getUser = asyncActionCreator<number, IUser, CustomError>(
  'GET_USER',
  async id => {
    const res = await axios.get(`${usersUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new CustomError(`Error ${res}`, 'mock')
    }

    return res.data
  }
)

export const searchUsers = asyncActionCreator<
  IPagerRequest,
  IUsersResponse,
  CustomError
>('SEARCH_USERS', async params => {
  const res = await axios.post(`${usersUrl}/search`, params, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  if (!res.data.users.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  return res.data
})

export const followUser = asyncActionCreator<number, IUser, CustomError>(
  'FOLLOW_USER',
  async id => {
    const res = await axios.post(relationshipUrl, { id }, auth)

    if (res.statusText !== 'OK') {
      throw new CustomError(`Error ${res}`, 'mock')
    }

    return res.data
  }
)

export const unFollowUser = asyncActionCreator<number, IUser, CustomError>(
  'UNFOLLOW_USER',
  async id => {
    const res = await axios.delete(`${relationshipUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new CustomError(`Error ${res}`, 'mock')
    }

    return res.data
  }
)
