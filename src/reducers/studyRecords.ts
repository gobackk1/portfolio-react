import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readStudyRecords,
  postStudyRecord,
  getStudyRecord,
  putStudyRecord,
  deleteStudyRecord,
  postComment,
  deleteComment
} from '@/actions/studyRecords'
import ServerResponse from '@/interfaces/ServerResponse'
import { AuthReqParams } from '@/interfaces/AuthReqParams'
import _ from 'lodash'

type AuthDoneParams = {
  params: AuthReqParams
  result: ServerResponse
}

const initialState: any = {
  0: {
    user_id: 0,
    comment: '',
    teaching_material: '',
    study_hours: 0,
    study_record_comments: []
  }
}

export default reducerWithInitialState(initialState)
  // .cases(
  //   [postStudyRecord.async.failed, readStudyRecords.async.failed],
  //   state => {
  //     return {
  //       ...state
  //     }
  //   }
  // )
  .case(readStudyRecords.async.done, (state, done) => {
    //@ts-ignore
    return _.mapKeys(done.result.data, 'id')
  })
  .cases(
    [getStudyRecord.async.done, putStudyRecord.async.done],
    (state, done) => {
      //@ts-ignore
      const data = done.result.data
      return {
        ...state,
        [data.id]: data
      }
    }
  )
  .case(postStudyRecord.async.done, (state, done) => {
    //@ts-ignore
    console.log(done.result.data, 'done.result.data')
    return {
      ...state,
      //@ts-ignore
      [done.result.data.id]: done.result.data
    }
  })
  .case(deleteStudyRecord.async.done, (state, done) => {
    delete state[done.result.data]
    return { ...state }
  })
  .case(postComment.async.done, (state, done) => {
    const study_record_id = done.result.data.study_record_id
    const data = done.result.data
    return {
      ...state,
      [study_record_id]: {
        ...state[study_record_id],
        study_record_comments: [
          ...state[study_record_id].study_record_comments,
          data
        ]
      }
    }
  })
  .case(deleteComment.async.done, (state, done) => {
    const data = done.result.data
    const study_record_id = done.params.study_record_id
    const array = state[study_record_id].study_record_comments.filter(
      comment => comment.id !== data
    )
    return {
      ...state,
      [study_record_id]: {
        ...state[study_record_id],
        study_record_comments: [...array]
      }
    }
  })
