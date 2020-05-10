import axios, { auth } from '@/axios'
import { asyncActionCreator } from '@/actions'

const studyRecordUrl = `${process.env.REACT_APP_API_URL}/study_records`

export const readStudyRecords = asyncActionCreator<any, any, Error>(
  'READ_STUDY_RECORDS',
  async () => {
    const res = await axios.get(studyRecordUrl, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const searchStudyRecords = asyncActionCreator<any, any, Error>(
  'SEARCH_STUDY_RECORDS',
  async keyword => {
    const res = await axios.post(`${studyRecordUrl}/search`, { keyword }, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const getStudyRecord = asyncActionCreator<any, any, Error>(
  'READ_STUDY_RECORD',
  async id => {
    const res = await axios.get(`${studyRecordUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const postStudyRecord = asyncActionCreator<any, any, Error>(
  'POST_STUDY_RECORD',
  async params => {
    const res = await axios.post(studyRecordUrl, params, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const putStudyRecord = asyncActionCreator<any, any, Error>(
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

export const deleteStudyRecord = asyncActionCreator<any, any, Error>(
  'DELETE_STUDY_RECORD',
  async id => {
    const res = await axios.delete(`${studyRecordUrl}/${id}`, auth)

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const postComment = asyncActionCreator<any, any, Error>(
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
