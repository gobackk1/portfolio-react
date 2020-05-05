import axios, { auth } from '@/axios'
import { asyncActionCreator } from '@/actions'

export const readStudyRecords = asyncActionCreator<any, any, Error>(
  'READ_STUDY_RECORDS',
  async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/study_records`,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const searchStudyRecords = asyncActionCreator<any, any, Error>(
  'SEARCH_STUDY_RECORDS',
  async keyword => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/study_records/search`,
      { keyword },
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const getStudyRecord = asyncActionCreator<any, any, Error>(
  'READ_STUDY_RECORD',
  async id => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/study_records/${id}`,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const postStudyRecord = asyncActionCreator<any, any, Error>(
  'POST_STUDY_RECORD',
  async params => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/study_records`,
      params,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const putStudyRecord = asyncActionCreator<any, any, Error>(
  'PUT_STUDY_RECORD',
  async params => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/study_records/${params.id}`,
      params,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const deleteStudyRecord = asyncActionCreator<any, any, Error>(
  'DELETE_STUDY_RECORD',
  async id => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/study_records/${id}`,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const postComment = asyncActionCreator<any, any, Error>(
  'POST_STUDY_RECORD_COMMENT',
  async params => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/study_record_comments/`,
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
  async params => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/study_record_comments/${params.id}`,
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)
