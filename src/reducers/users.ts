import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readUsers,
  searchUsers,
  followUser,
  unFollowUser
} from '@/actions/users'
import _ from 'lodash'

const initialState: any = {
  0: {
    id: 0,
    image_url: '/images/user_images/default.png.png',
    is_following: false,
    name: '',
    user_bio: ''
  }
}

export default reducerWithInitialState(initialState)
  .cases([readUsers.async.done, searchUsers.async.done], (state, done) => {
    return _.mapKeys(done.result.data, 'id')
  })
  .cases(
    [followUser.async.done, unFollowUser.async.done],
    (state, { result }) => {
      return {
        ...state,
        [result.data.user.id]: result.data.user
      }
    }
  )
