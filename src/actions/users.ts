import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'

const usersUrl = `${process.env.REACT_APP_API_URL}/users`
const relationshipUrl: string = `${process.env.REACT_APP_API_URL}/relationships`

export const readUsers = asyncActionCreator<any, any, Error>(
  'READ_USERS',
  async ({ page, per }) => {
    const res = await axios.get(`${usersUrl}?page=${page}&per=${per}`, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    if (!res.data.result.length) {
      if (res.data.not_found) {
        throw new CustomError(res.data.messages[0], 'record_not_found')
      }
      throw new CustomError('追加するデータがありません', 'any_more_data')
    }

    return res
  }
)

export const searchUsers = asyncActionCreator<any, any, Error>(
  'SEARCH_USERS',
  async params => {
    const res = await axios.post(`${usersUrl}/search`, params, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    if (!res.data.result.length) {
      if (res.data.not_found) {
        throw new CustomError(res.data.messages[0], 'record_not_found')
      }
      throw new CustomError('追加するデータがありません', 'any_more_data')
    }

    return res
  }
)

export const followUser = asyncActionCreator<any, any, Error>(
  'FOLLOW_USER',
  async id => {
    const res = await axios.post(relationshipUrl, { id }, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const unFollowUser = asyncActionCreator<any, any, Error>(
  'UNFOLLOW_USER',
  async id => {
    const res = await axios.delete(`${relationshipUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const clearUsersStateData = actionCreator('CLEAR_USERS_STATE_DATA')
