import actionCreatorFactory from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'
import axios from '@/axios'

const actionCreator = actionCreatorFactory()
const asyncCreator = asyncFactory(actionCreator)

const auth = {
  auth: true as any
}

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
    const { comment, teaching_material, study_hours } = params
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/study_records`,
      {
        comment,
        teaching_material,
        study_hours
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
    const { comment, teaching_material, study_hours, id } = params
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/study_records/${id}`,
      {
        comment,
        teaching_material,
        study_hours
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
    console.log(res, 'delete')
    return res
  }
)
