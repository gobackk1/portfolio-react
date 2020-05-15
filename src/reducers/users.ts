import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readUsers,
  searchUsers,
  followUser,
  unFollowUser
} from '@/actions/users'

const initialState: any = {
  init: false,
  data: [
    {
      id: 0,
      image_url: '/images/user_images/default.png.png',
      is_following: false,
      name: '',
      user_bio: ''
    }
  ]
}

export default reducerWithInitialState(initialState)
  .case(readUsers.async.failed, state => {
    return state
  })
  .cases(
    [readUsers.async.done, searchUsers.async.done],
    (state, { result }) => {
      if (!state.init) {
        state.data = []
        state.init = true
      }
      state.data = state.data.concat(result.data)
      console.log(result, 'readUsers.async.done, searchUsers.async.done')
      return {
        ...state
      }
    }
  )
  .cases(
    [followUser.async.done, unFollowUser.async.done],
    (state, { result }) => {
      const { id } = result.data.user
      const index = state.data.findIndex(d => d.id === id)
      state.data[index] = result.data.user
      console.log(result, 'followUser.async.done, unFollowUser.async.done')
      return { ...state }
    }
  )
