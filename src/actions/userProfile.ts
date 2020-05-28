import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'
import IStudyRecord from '@/interfaces/IStudyRecord'

const usersUrl = `${process.env.REACT_APP_API_URL}/users`
export const readProfileStudyRecords = asyncActionCreator<
  { id: number; page: number; per: number; initialize?: boolean },
  { records: IStudyRecord[] },
  CustomError
>('READ_PROFILE_STUDY_RECORDS', async ({ id, page, per }) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/study_records?user_id=${id}&page=${page}&per=${per}`,
    auth
  )

  if (res.statusText !== 'OK') {
    throw new CustomError('Error', 'mock')
  }

  if (!res.data.records.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  console.log('READ_PROFILE_STUDY_RECORDS', res.data)
  return res.data
})

export const setUserProfileState = actionCreator<any>('SET_USER_PROFILE_STATE')
export const updateProfileStudyRecords = actionCreator<any>(
  'UPDATE_PROFILE_STUDY_RECORDS'
)
