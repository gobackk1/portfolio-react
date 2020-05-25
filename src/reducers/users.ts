import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readUsers,
  searchUsers,
  followUser,
  unFollowUser,
  resetSearchUsersState,
  resetUsersState,
  getUser
} from '@/actions/users'

import store from '@/store'

const dispatchReadUsers = async (per: number): Promise<void> => {
  try {
    await store.dispatch(
      readUsers({
        page: store.getState().users.currentPage,
        per
      })
    )
  } catch (e) {
    console.log(e, 'mock')
  }
}

const dispatchSearchUsers = async (
  keyword: string,
  per: number
): Promise<void> => {
  try {
    await store.dispatch(
      searchUsers({
        keyword,
        page: store.getState().users.search.currentPage,
        per
      })
    )
  } catch (e) {
    console.log(e, 'mock')
  }
}

const initialState: any = {
  init: false,
  isLoading: false,
  currentPage: 1,
  perPage: 10,
  search: {
    init: false,
    currentPage: 1,
    perPage: 10,
    keyword: ''
  },
  errorMessage: '',
  data: [
    {
      user: {
        id: 0,
        image_url: '/images/user_images/default.png.png',
        is_following: false,
        name: '',
        user_bio: ''
      },
      is_following: 0,
      followings_count: 0,
      total_study_hours: 0,
      registered_date: ''
    }
  ],
  onLoadUsers: undefined,
  dispatchReadUsers,
  dispatchSearchUsers
}

export default reducerWithInitialState(initialState)
  .case(readUsers.async.started, state => {
    return { ...state, isLoading: true }
  })
  .cases(
    [readUsers.async.failed, searchUsers.async.failed],
    (state, { error }) => {
      state.isLoading = false
      if (error.type === 'record_not_found') state.errorMessage = error.message
      state.onLoadUsers = undefined
      return { ...state }
    }
  )
  .case(readUsers.async.done, (state, { result }) => {
    if (!state.init) {
      state.data = []
      state.init = true
      state.errorMessage = ''
      state.onLoadUsers = () => {
        dispatchReadUsers(state.perPage)
      }
    }
    state.isLoading = false
    state.currentPage++
    state.data = state.data.concat(result.data.result)
    console.log(state, 'readUsers.async.done')
    return { ...state }
  })
  .case(searchUsers.async.done, (state, { params, result }) => {
    if (!state.search.init) {
      state.data = []
      state.search.init = true
      state.search.keyword = params.keyword
      state.errorMessage = ''
      state.onLoadUsers = () => {
        dispatchSearchUsers(params.keyword, params.per)
      }
    }
    state.search.currentPage++
    state.data = state.data.concat(result.data.result)
    console.log('readUsers.async.done')
    return { ...state }
  })
  .case(getUser.async.done, (state, { result }) => {
    console.log('result', result)
    state.data.push(result)
    console.log(state)
    return { ...state }
  })
  .cases(
    [followUser.async.done, unFollowUser.async.done],
    (state, { result }) => {
      const { id } = result.data.user
      const index = state.data.findIndex(d => d.id === id)
      state.data[index] = result.data.user
      console.log('followUser.async.done, unFollowUser.async.done')
      return state
    }
  )
  .case(resetUsersState, state => {
    state.init = false
    state.currentPage = 1
    state.data = []
    state.errorMessage = ''
    return { ...state }
  })
  .case(resetSearchUsersState, state => {
    state.search.init = false
    state.search.currentPage = 1
    state.data = []
    state.errorMessage = ''
    return { ...state }
  })
