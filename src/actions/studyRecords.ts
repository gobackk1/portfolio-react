import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'
import IStudyRecord from '@/interfaces/IStudyRecord'

interface IPagerRequest {
  page: number
  per: number
  keyword?: string
}

interface IRecordsResponse {
  not_found: boolean
  records: IStudyRecord[]
}

interface ICommentResponse {
  id: number
  date: string
  comment_body: string
  created_at: string
  updated_at: string
  study_record_id: number
  user: {
    id: number
    image_url: string
    name: string
  }
}

interface IPostStudyRecordRequest {
  image_select: string
  image_url: string
  material_id: number
  study_hours: number
  teaching_material_name: string
}

const studyRecordUrl = `${process.env.REACT_APP_API_URL}/study_records`

export const readStudyRecords = asyncActionCreator<
  IPagerRequest,
  IRecordsResponse,
  CustomError
>('READ_STUDY_RECORDS', async ({ page, per }) => {
  const res = await axios.get(`${studyRecordUrl}?page=${page}&per=${per}`, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  if (!res.data.records.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  console.log(res, 'READ_STUDY_RECORDS')
  return res.data
})

export const searchStudyRecords = asyncActionCreator<
  IPagerRequest,
  IRecordsResponse,
  CustomError
>('SEARCH_STUDY_RECORDS', async params => {
  const res = await axios.post(`${studyRecordUrl}/search`, params, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  if (!res.data.result.length) {
    if (res.data.not_found) {
      throw new CustomError(res.data.messages[0], 'record_not_found')
    }
    throw new CustomError('追加するデータがありません', 'any_more_data')
  }

  console.log(res, 'SEARCH_STUDY_RECORDS')
  return res.data
})

export const getStudyRecord = asyncActionCreator<
  number,
  IStudyRecord,
  CustomError
>('GET_STUDY_RECORD', async id => {
  const res = await axios.get(`${studyRecordUrl}/${id}`, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  console.log(res, 'GET_STUDY_RECORD')
  return res.data
})

export const postStudyRecord = asyncActionCreator<
  IPostStudyRecordRequest,
  IStudyRecord,
  CustomError
>('POST_STUDY_RECORD', async params => {
  const res = await axios.post(studyRecordUrl, params, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  console.log(res, 'POST_STUDY_RECORD')
  return res.data
})

export const putStudyRecord = asyncActionCreator<
  IStudyRecord,
  IStudyRecord,
  CustomError
>('PUT_STUDY_RECORD', async params => {
  const res = await axios.put(`${studyRecordUrl}/${params.id}`, params, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  console.log(res, 'PUT_STUDY_RECORD')
  return res.data
})

export const deleteStudyRecord = asyncActionCreator<
  number,
  number,
  CustomError
>('DELETE_STUDY_RECORD', async id => {
  const res = await axios.delete(`${studyRecordUrl}/${id}`, auth)

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  console.log(res, 'DELETE_STUDY_RECORD')
  return res.data
})

export const postComment = asyncActionCreator<
  { comment_body: string; study_record_id: number },
  ICommentResponse,
  CustomError
>('POST_STUDY_RECORD_COMMENT', async params => {
  const { study_record_id } = params
  const res = await axios.post(
    `${studyRecordUrl}/${study_record_id}/study_record_comments/`,
    params,
    auth
  )

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  console.log(res, 'POST_STUDY_RECORD_COMMENT')
  return res.data
})

export const deleteComment = asyncActionCreator<
  { id: number; study_record_id: number },
  { id: number; study_record_id: number },
  CustomError
>('DELETE_COMMENT', async ({ id, study_record_id }) => {
  const res = await axios.delete(
    `${studyRecordUrl}/${study_record_id}/study_record_comments/${id}`,
    auth
  )

  if (res.statusText !== 'OK') {
    throw new Error(`Error ${res}`)
  }

  console.log(res, 'DELETE_COMMENT')
  return res.data
})

export const resetStudyRecordsState = actionCreator('RESET_STUDY_RECORDS_STATE')
export const resetSearchStudyRecordsState = actionCreator(
  'RESET_SEARCH_STUDY_RECORDS_STATE'
)
export const setStudyRecordsState = actionCreator<any>(
  'SET_STUDY_RECORDS_STATE'
)
export const updateTeachingMaterialInStudyRecord = actionCreator<any>(
  'UPDATE_TEACHING_MATERIAL_IN_STUDY_RECORD'
)
export const deleteStudyRecordByTeachingMaterialId = actionCreator<number>(
  'DELETE_STUDY_RECORD_BY_TEACHING_MATERIAL_ID'
)
