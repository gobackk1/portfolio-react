import axios, { auth } from '@/axios'
import { asyncActionCreator, actionCreator } from '@/actions'
import CustomError from '@/utils/CustomError'

const studyRecordUrl = `${process.env.REACT_APP_API_URL}/study_records`

export const readStudyRecords = asyncActionCreator<any, any, CustomError>(
  'READ_STUDY_RECORDS',
  async ({ page, per }) => {
    const res = await axios.get(
      `${studyRecordUrl}?page=${page}&per=${per}`,
      auth
    )

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

export const searchStudyRecords = asyncActionCreator<any, any, CustomError>(
  'SEARCH_STUDY_RECORDS',
  async params => {
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

    return res
  }
)

export const getStudyRecord = asyncActionCreator<any, any, CustomError>(
  'GET_STUDY_RECORD',
  async id => {
    const res = await axios.get(`${studyRecordUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const postStudyRecord = asyncActionCreator<any, any, CustomError>(
  'POST_STUDY_RECORD',
  async params => {
    const res = await axios.post(studyRecordUrl, params, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const putStudyRecord = asyncActionCreator<any, any, CustomError>(
  'PUT_STUDY_RECORD',
  async params => {
    console.log(params, 'PUT_STUDY_RECORD')
    const res = await axios.put(`${studyRecordUrl}/${params.id}`, params, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const deleteStudyRecord = asyncActionCreator<any, any, CustomError>(
  'DELETE_STUDY_RECORD',
  async id => {
    const res = await axios.delete(`${studyRecordUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const postComment = asyncActionCreator<any, any, CustomError>(
  'POST_STUDY_RECORD_COMMENT',
  async params => {
    const { study_record_id } = params
    console.log(params, 'POST_STUDY_RECORD_COMMENT')
    const res = await axios.post(
      `${studyRecordUrl}/${study_record_id}/study_record_comments/`,
      params,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const deleteComment = asyncActionCreator<any, any, Error>(
  'DELETE_COMMENT',
  async ({ id, study_record_id }) => {
    const res = await axios.delete(
      `${studyRecordUrl}/${study_record_id}/study_record_comments/${id}`,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

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
