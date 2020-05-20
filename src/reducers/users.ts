import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readUsers,
  searchUsers,
  followUser,
  unFollowUser,
  clearUsersStateData,
  clearOnLoadUsersList,
  incrementCurrentPage,
  decrementCurrentPage,
  initializeCurrentPage,
  setOnLoadUsersList,
  setErrorMessage,
  initializeCurrentSearchPage,
  incrementCurrentSearchPage,
  decrementCurrentSearchPage
} from '@/actions/users'

import store from '@/store'

async function loadUsersList(this: any): Promise<void> {
  store.dispatch(incrementCurrentPage())
  try {
    await store.dispatch(
      readUsers({
        page: store.getState().users.currentPage,
        per: store.getState().users.perPage
      })
    )
  } catch (e) {
    store.dispatch(clearOnLoadUsersList())
    store.dispatch(decrementCurrentPage())
  }
}

async function dispatchSearchUsers(this: any, keyword: string): Promise<void> {
  try {
    await store.dispatch(
      searchUsers({
        keyword,
        page: store.getState().users.search.currentPage,
        per: store.getState().users.search.perPage
      })
    )
  } catch (e) {
    if (e.type === 'record_not_found') {
      store.dispatch(setErrorMessage(e.message))
    }
    store.dispatch(clearOnLoadUsersList())
    store.dispatch(decrementCurrentSearchPage())
  }
}

async function setSearchQueue(keyword: string) {
  store.dispatch(initializeCurrentSearchPage())
  store.dispatch(setErrorMessage(''))
  store.dispatch(
    setOnLoadUsersList(() => {
      store.dispatch(incrementCurrentSearchPage())
      dispatchSearchUsers(keyword).catch(() =>
        store.dispatch(decrementCurrentSearchPage())
      )
    })
  )
}

const initialState: any = {
  init: false,
  currentPage: 1,
  perPage: 10,
  search: {
    currentPage: 1,
    perPage: 10
  },
  errorMessage: '',
  data: [
    {
      id: 0,
      image_url: '/images/user_images/default.png.png',
      is_following: false,
      name: '',
      user_bio: ''
    }
  ],
  onLoadUsersList: loadUsersList,
  loadUsersList,
  dispatchSearchUsers,
  setSearchQueue
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
        state.onLoadUsersList = loadUsersList
      }
      state.data = state.data.concat(result.data.result)
      console.log('readUsers.async.done, searchUsers.async.done')
      return { ...state }
    }
  )
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
  .case(setOnLoadUsersList, (state, params) => {
    state.onLoadUsersList = params
    return { ...state }
  })
  .case(setErrorMessage, (state, params) => {
    state.errorMessage = params
    return { ...state }
  })
  .case(clearUsersStateData, state => {
    state.data = []
    return { ...state }
  })
  .case(clearOnLoadUsersList, state => {
    state.onLoadUsersList = undefined
    return { ...state }
  })
  .case(initializeCurrentPage, state => {
    state.currentPage = 1
    return { ...state }
  })
  .case(incrementCurrentPage, state => {
    state.currentPage++
    return { ...state }
  })
  .case(decrementCurrentPage, state => {
    state.currentPage--
    return { ...state }
  })
  .case(initializeCurrentSearchPage, state => {
    state.search.currentPage = 1
    return { ...state }
  })
  .case(incrementCurrentSearchPage, state => {
    state.search.currentPage++
    return { ...state }
  })
  .case(decrementCurrentSearchPage, state => {
    state.search.currentPage--
    return { ...state }
  })
