import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { readUsers, searchUsers } from '@/actions/users'
import _ from 'lodash'

const initialState: any = {
  0: {
    user_id: 0,
    comment: '',
    teaching_material: '',
    study_hours: 0,
    study_record_comments: []
  }
}

export default reducerWithInitialState(initialState).cases(
  [readUsers.async.done, searchUsers.async.done],
  (state, done) => {
    return _.mapKeys(done.result.data, 'id')
  }
)
