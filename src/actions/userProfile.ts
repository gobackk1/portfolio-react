import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'
import { AxiosResponse } from 'axios'

const usersUrl = `${process.env.REACT_APP_API_URL}/users`

export const getProfile = asyncActionCreator<any, any, Error>(
  'GET_PROFILE',
  async id => {
    const res = await axios.get(`${usersUrl}/${id}`, auth)
    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }
    console.log('GET_PROFILE', res.data)
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

export const readProfileStudyRecords = asyncActionCreator<
  { id: number; page: number; per: number; initialize?: boolean },
  { result: any },
  CustomError
>('GET_PROFILE_STUDY_RECORDS', async ({ id, page, per }) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/study_records?user_id=${id}&page=${page}&per=${per}`,
    auth
  )

  if (res.statusText !== 'OK') {
    throw new CustomError('Error', 'mock')
  }

  if (!res.data.result.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  console.log('GET_PROFILE_STUDY_RECORDS', res.data)
  return res.data
})

export const setUserProfileState = actionCreator<any>('SET_USER_PROFILE_STATE')
