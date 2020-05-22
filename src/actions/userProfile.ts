import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'

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
  any,
  any,
  CustomError
>('READ_PROFILE_STUDY_RECORDS', async params => {
  const res = await axios.get(`ここにエンドポイント`, auth)
  if (res.statusText !== 'OK') {
    throw new CustomError('Error', 'mock')
  }
  return res
})
export const setUserProfileState = actionCreator<any>('SET_USER_PROFILE_STATE')
