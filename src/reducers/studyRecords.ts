import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readStudyRecords,
  postStudyRecord,
  getStudyRecord,
  putStudyRecord,
  deleteStudyRecord
} from '@/actions'
import ServerResponse from '@/interfaces/ServerResponse'
import UserState from '@/interfaces/UserState'
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
    study_hours: 0
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
