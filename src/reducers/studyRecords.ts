import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readStudyRecords,
  postStudyRecord,
  getStudyRecord,
  putStudyRecord,
  deleteStudyRecord,
  postComment,
  deleteComment,
  searchStudyRecords
} from '@/actions/studyRecords'
import ServerResponse from '@/interfaces/ServerResponse'
import { AuthReqParams } from '@/interfaces/AuthReqParams'
import _ from 'lodash'

type AuthDoneParams = {
  params: AuthReqParams
  result: ServerResponse
}

const initialState: any = {
  loaded: false,
  records: [
    {
      user: {
        name: '',
        image_name: 'default.jpg'
      },
      date: '01/01',
      record: {
        user_id: 0,
        comment: '',
        teaching_material: '',
        study_hours: 0,
        study_record_comments: []
      }
    }
  ]
}

export default reducerWithInitialState(initialState)
  .cases(
    [readStudyRecords.async.done, searchStudyRecords.async.done],
    (state, { result }) => {
      console.log(state, 'readStudyRecords')
      return {
        loaded: true,
        records: [...result.data]
      }
    }
  )
  .cases(
    [getStudyRecord.async.done, putStudyRecord.async.done],
    (state, { result }) => {
      const data = result.data
      const index = state.records.findIndex(r => r.id === data.id)
      if (index !== -1) state.records[index] = data

      console.log(state, 'getStudyRecord or putStudyRecord')
      return { ...state }
    }
  )
  .case(postStudyRecord.async.done, (state, { result }) => {
    const data = result.data
    state.records.unshift(data)

    return { ...state }
  })
  .case(deleteStudyRecord.async.done, (state, { result }) => {
    const id = result.data
    const index = state.records.findIndex(r => r.id === id)
    state.records.splice(index, 1)

    console.log(state, 'deleteStudyRecord')
    return {
      ...state
    }
  })
  .case(postComment.async.done, (state, { result }) => {
    const study_record_id = result.data.comment.study_record_id
    const data = result.data
    const index = state.records.findIndex(r => r.id === study_record_id)
    state.records[index].comments.push(data)

    console.log(state, 'postComment')
    return { ...state }
  })
  .case(deleteComment.async.done, (state, { result }) => {
    const { id, study_record_id } = result.data
    const rindex = state.records.findIndex(r => r.id === study_record_id)
    const { comments } = state.records[rindex]
    const cindex = comments.findIndex(c => c.id === id)
    comments.splice(cindex, 1)

    console.log(state, 'deleteComment')
    return { ...state }
  })
