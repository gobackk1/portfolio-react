import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'
import IStudyRecord from '@/interfaces/IStudyRecord'
import store from '@/store'

interface IPagerRequest {
  page: number
  per: number
  // keyword?: string
}

interface IRecordsResponse {
  not_found: boolean
  records: IStudyRecord[]
}

const studyRecordUrl = `${process.env.REACT_APP_API_URL}/study_records`

export const readFollowUserStudyRecords = asyncActionCreator<
  IPagerRequest,
  IRecordsResponse,
  CustomError
>('READ_FOLLOW_USER_STUDY_RECORDS', async ({ page, per }) => {
  const userId = store.getState().user.id
  const res = await axios.get(
    `${studyRecordUrl}?page=${page}&per=${per}&follow=true&user_id=${userId}`,
    auth
  )

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  if (!res.data.records.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  console.log(res, 'READ_FOLLOW_USER_STUDY_RECORDS')
  return res.data as any
})

// export const putStudyRecord = asyncActionCreator<
//   IStudyRecord,
//   IStudyRecord,
//   CustomError
// >('PUT_STUDY_RECORD', async params => {
//   const res = await axios.put(`${studyRecordUrl}/${params.id}`, params, auth)

//   if (res.statusText !== 'OK') {
//     throw new Error(`Error ${res}`)
//   }

//   console.log(res, 'PUT_STUDY_RECORD')
//   return res.data
// })

// export const resetStudyRecordsState = actionCreator('RESET_STUDY_RECORDS_STATE')
// export const resetSearchStudyRecordsState = actionCreator(
//   'RESET_SEARCH_STUDY_RECORDS_STATE'
// )
// export const setStudyRecordsState = actionCreator<any>(
//   'SET_STUDY_RECORDS_STATE'
// )
// export const updateTeachingMaterialInStudyRecord = actionCreator<any>(
//   'UPDATE_TEACHING_MATERIAL_IN_STUDY_RECORD'
// )
// export const deleteStudyRecordByTeachingMaterialId = actionCreator<number>(
//   'DELETE_STUDY_RECORD_BY_TEACHING_MATERIAL_ID'
// )
