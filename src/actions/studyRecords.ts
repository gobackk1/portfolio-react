import actionCreatorFactory from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'
import axios, { auth } from '@/axios'

const actionCreator = actionCreatorFactory()
const asyncCreator = asyncFactory(actionCreator)

export const readStudyRecords = asyncCreator<any, any, Error>(
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

export const getStudyRecord = asyncCreator<any, any, Error>(
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

export const postStudyRecord = asyncCreator<any, any, Error>(
  'POST_STUDY_RECORD',
  async params => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/study_records`,
      {
        ...params
      },
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const putStudyRecord = asyncCreator<any, any, Error>(
  'PUT_STUDY_RECORD',
  async params => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/study_records/${params.id}`,
      {
        ...params
      },
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const deleteStudyRecord = asyncCreator<any, any, Error>(
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

export const postComment = asyncCreator<any, any, Error>(
  'POST_STUDY_RECORD_COMMENT',
  async params => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/study_record_comments/`,
      {
        ...params
      },
      auth
    )

    if (res.statusText !== 'OK') {
      throw new Error(`Error ${res}`)
    }

    return res
  }
)

export const deleteComment = asyncCreator<any, any, Error>(
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
